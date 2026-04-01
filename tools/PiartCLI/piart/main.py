"""
Piart CLI - A wrapper around vamscli that exposes 'repo/repos' instead of 'asset/assets'.

All logic lives in vamscli. This wrapper:
  1. Translates repo/repos → asset/assets in argv before forwarding to vamscli.
  2. Translates asset/Asset/ASSET/assets/Assets/ASSETS → repo equivalents in output.
  3. Replaces 'vamscli' with 'piart' in any help or error text.
"""

import os
import re
import sys
import subprocess
import shutil

try:
    from dotenv import load_dotenv
except ImportError:
    pass


def _check_vamscli_available():
    """Check if vamscli is available and try to install bundled version if needed."""
    # First check if vamscli command is available
    if shutil.which('vamscli'):
        return True
        
    # If not available, try to install bundled version
    try:
        from .install_bundled import install_bundled_vamscli
        if install_bundled_vamscli():
            return True
    except Exception as e:
        print(f"Warning: Could not install bundled vamscli: {e}")
        
    return False


# ---------------------------------------------------------------------------
# Translation tables
# ---------------------------------------------------------------------------

# Patterns applied to each CLI argument BEFORE forwarding to vamscli.
# Order matters: longer/more-specific patterns first.
_ARG_IN_PATTERNS = [
    (re.compile(r'\brepos\b'), 'assets'),
    (re.compile(r'\brepo\b'),  'asset'),
]

# Patterns applied to captured output text BEFORE printing to the user.
# Case variants handled explicitly so we don't mangle mixed-case words.
_TEXT_OUT_PATTERNS = [
    # All-caps plurals / singulars
    (re.compile(r'\bASSETS\b'), 'REPOS'),
    (re.compile(r'\bASSET\b'),  'REPO'),
    # Title-case plurals / singulars
    (re.compile(r'\bAssets\b'), 'Repos'),
    (re.compile(r'\bAsset\b'),  'Repo'),
    # Lowercase plurals / singulars
    (re.compile(r'\bassets\b'), 'repos'),
    (re.compile(r'\basset\b'),  'repo'),
    # Translate the binary name so help text refers to 'piart'
    (re.compile(r'\bvamscli\b'), 'piart'),
    (re.compile(r'\bVamsCLI\b'), 'PiartCLI'),
]


def _translate_arg(arg: str) -> str:
    """Translate a single CLI argument from piart vocabulary → vamscli vocabulary."""
    for pattern, replacement in _ARG_IN_PATTERNS:
        arg = pattern.sub(replacement, arg)
    return arg


def _translate_args(args: list) -> list:
    """Translate all CLI arguments."""
    return [_translate_arg(arg) for arg in args]


def _translate_output(text: str) -> str:
    """Translate vamscli output text from vamscli vocabulary → piart vocabulary."""
    for pattern, replacement in _TEXT_OUT_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


# ---------------------------------------------------------------------------
# Subprocess execution helpers
# ---------------------------------------------------------------------------

def _run_interactive(cmd: list) -> int:
    """
    Run vamscli in a way that allows interactive stdin (e.g. click.confirm prompts).

    stdout and stderr are piped through a line-by-line translator so the user
    still sees translated output in real-time, but stdin is inherited from the
    parent process so interactive prompts work normally.
    """
    import threading
    import io

    auth_expired = [False]

    def _pipe_and_translate(src, dst, is_stderr=False):
        """Read character by character from src, translate, write to dst with word boundary awareness."""
        # Use a text-mode wrapper around the raw pipe
        reader = io.TextIOWrapper(src, encoding='utf-8', errors='replace')
        buffer = ""
        output_buffer = ""
        
        try:
            while True:
                if auth_expired[0]:
                    return
                char = reader.read(1)
                if not char:  # EOF
                    # Flush any remaining buffer
                    if output_buffer:
                        translated = _translate_output(output_buffer)
                        dst.write(translated)
                        dst.flush()
                    break
                    
                buffer += char
                output_buffer += char
                
                # Check for auth error on complete lines
                if char == '\n' and is_stderr and ("Token Expired" in buffer or "Authentication Error" in buffer or "token has expired" in buffer.lower()):
                    auth_expired[0] = True
                    return
                
                # If we hit a word boundary or whitespace, translate and output the accumulated text
                if char in ' \t\n\r' or not char.isalnum():
                    if output_buffer:
                        translated = _translate_output(output_buffer)
                        dst.write(translated)
                        dst.flush()
                        output_buffer = ""
                # If the output buffer gets too long (for very long words), flush it
                elif len(output_buffer) > 50:
                    translated = _translate_output(output_buffer)
                    dst.write(translated)
                    dst.flush()
                    output_buffer = ""
                
                # Clear main buffer on newline to avoid accumulating too much
                if char == '\n':
                    buffer = ""
        except Exception:
            pass

    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=sys.stdin,  # pass through for interactive prompts
    )

    t_out = threading.Thread(
        target=_pipe_and_translate,
        args=(process.stdout, sys.stdout, False),
        daemon=True,
    )
    t_err = threading.Thread(
        target=_pipe_and_translate,
        args=(process.stderr, sys.stderr, True),
        daemon=True,
    )
    t_out.start()
    t_err.start()
    process.wait()
    t_out.join()
    t_err.join()
    
    if auth_expired[0]:
        return -999
    return process.returncode


def _run_batch(cmd: list) -> int:
    """
    Run vamscli with captured stdout/stderr and translate all output at once.

    Used for non-interactive/piped invocations (e.g. scripts, --json-output).
    """
    result = subprocess.run(cmd, capture_output=True, text=True)
    if "Token Expired" in result.stderr or "Authentication Error" in result.stderr or "token has expired" in result.stderr.lower():
        return -999

    sys.stdout.write(_translate_output(result.stdout))
    sys.stderr.write(_translate_output(result.stderr))
    return result.returncode


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def _reauthenticate() -> bool:
    """Attempt to silently re-authenticate using .env credentials."""
    if 'load_dotenv' in globals():
        # Load local .env first, then fallback to global ~/.piart.env if present
        load_dotenv()
        global_env = os.path.expanduser("~/.piart.env")
        if os.path.exists(global_env):
            load_dotenv(global_env)

        
    username = os.getenv("VAMS_USER")
    password = os.getenv("VAMS_PASSWORD")
    
    # Interactive prompt if missing
    if not username or not password:
        sys.stderr.write("piart: Token expired. No credentials found in .env.\n")
        sys.stderr.flush()
        try:
            if not username:
                username = input("VAMS Username: ").strip()
            if not password:
                import getpass
                password = getpass.getpass("VAMS Password: ")
        except (KeyboardInterrupt, EOFError):
            sys.stderr.write("\nAuthentication cancelled.\n")
            return False
            
        if not username or not password:
            sys.stderr.write("Username and password are required. Cannot re-authenticate.\n")
            return False
            
        # Save to global .env for next time
        try:
            global_env = os.path.expanduser("~/.piart.env")
            with open(global_env, 'w') as f:
                f.write(f"VAMS_USER={username}\n")
                f.write(f"VAMS_PASSWORD={password}\n")
            # Set restrictive permissions (600) so only the user can read the password
            os.chmod(global_env, 0o600)
            sys.stderr.write(f"Credentials saved to {global_env}\n")
        except Exception as e:
            sys.stderr.write(f"Warning: could not save credentials to ~/.piart.env: {e}\n")

        
    cmd = ["vamscli", "auth", "login", "-u", username, "-p", password]
    sys.stderr.write("Reauthenticating...\n")
    sys.stderr.flush()
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        return True
    else:
        sys.stderr.write("piart: Auto-reauthentication failed.\n")
        sys.stderr.write(_translate_output(result.stderr))
        return False


def main() -> None:
    """Main entry point for the piart wrapper CLI."""
    if 'load_dotenv' in globals():
        load_dotenv()
        global_env = os.path.expanduser("~/.piart.env")
        if os.path.exists(global_env):
            load_dotenv(global_env)

    # Ensure vamscli is available (install bundled version if needed)
    if not _check_vamscli_available():
        print("\n❌ Error: Unable to set up vamscli dependency.")
        print("The bundled vamscli installation failed.")
        sys.exit(1)
        
    user_args = sys.argv[1:]
    vamscli_args = _translate_args(user_args)
    cmd = ['vamscli'] + vamscli_args

    while True:
        # Use interactive mode when stdin is a TTY and not outputting JSON.
        if sys.stdin.isatty() and '--json-output' not in vamscli_args:
            rc = _run_interactive(cmd)
        else:
            rc = _run_batch(cmd)
            
        if rc == -999:
            if _reauthenticate():
                continue
            else:
                sys.exit(1)
        
        sys.exit(rc)


if __name__ == '__main__':
    main()
