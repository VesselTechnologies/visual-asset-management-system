# Piart CLI

A thin wrapper around [`vamscli`](../VamsCLI) that exposes `repo`/`repos` terminology instead of `asset`/`assets`. All actual logic lives in `vamscli` — `piart` purely translates vocabulary in both directions.

## Key Features

- **🔄 Automatic Setup**: Automatically installs `vamscli` and configures with preconfigured backend on first run
- **📝 Vocabulary Translation**: Seamlessly translates between `repo`/`repos` (PIART) and `asset`/`assets` (VamsCLI)  
- **🔐 Auto-Reauthentication**: Automatically re-authenticates when sessions expire (with `.env` support)
- **⚡ Zero Configuration**: Just install and run - everything else is handled automatically

## How it works

### Automatic First-Run Setup

On your first run, `piart` automatically:

1. **Installs VamsCLI**: Downloads and installs the bundled `vamscli` dependency
2. **Configures Backend**: Uses the preconfigured backend URL and runs setup automatically  
3. **Ready to Use**: You can immediately start using `piart` commands

### Vocabulary Translation

| User types | Forwarded to vamscli as |
|---|---|
| `piart repos list` | `vamscli assets list` |
| `piart repo get` | `vamscli asset get` |

Output from `vamscli` is translated back before being shown:

| vamscli output | piart shows |
|---|---|
| `Asset created successfully` | `Repo created successfully` |
| `Use 'vamscli assets list'` | `Use 'piart repos list'` |

## Installation & Distribution

To easily share and install both CLIs without cloning the entire repository, users can install them directly from the Git repository using `pip`:

```bash
# 1. Install vamscli directly from the repository
pip install "git+https://github.com/awslabs/visual-asset-management-system.git#subdirectory=tools/VamsCLI"

# 2. Install piart directly from the repository
pip install "git+https://github.com/awslabs/visual-asset-management-system.git#subdirectory=tools/PiartCLI"
```

*Alternatively, maintainers can build `.whl` files using `python -m build --wheel` in both directories and distribute the two `.whl` files to users, who can then install them via `pip install vamscli-*.whl piart-*.whl`.*

## Usage

### Quick Start (First Time)

```bash
# Just run any piart command - setup happens automatically!
piart repos list

# On first run, you'll see:
# 🔧 PIART Setup Required
# This appears to be your first time using PIART.
# Configuring with preconfigured backend: https://97o933vkj1.execute-api.us-east-1.amazonaws.com
# ✅ Setup completed successfully!
```

### Regular Commands

`piart` accepts the same flags and subcommands as `vamscli`, with `repo`/`repos` substituted for `asset`/`assets`:

```bash
piart --help
piart auth login -u user@example.com
piart repos list -d my-database
piart repos create -d my-database --name "My Repo" --description "desc" --distributable
piart repos get my-repo -d my-database
piart repos delete my-repo -d my-database --confirm
```

### Manual Setup (Optional)

You can also run setup manually with the preconfigured backend:

```bash
piart setup https://97o933vkj1.execute-api.us-east-1.amazonaws.com
```

All other commands (`auth`, `database`, `tag`, `workflow`, etc.) pass through unchanged.

## Auto-Reauthentication

`piart` can automatically re-authenticate if your session expires during a command. To enable this, create a `.env` file in your working directory, or a global `~/.piart.env` file in your home directory, containing your credentials:

```env
VAMS_USER=your_username
VAMS_PASSWORD=your_password
```

When `piart` detects a "Token Expired" error, it will silently log you back in using these credentials and automatically retry your original command so you don't have to break your workflow. It checks the local `.env` first, then falls back to `~/.piart.env`.

## Troubleshooting

**Command not found: piart**

If you run `piart` after successful installation and see `command not found`, `pip` installed the executable into a user directory that is not in your system's `PATH` variable (this often looks like `~/.local/bin` or `~/Library/Python/3.x/bin` on macOS/Linux). 

You have two options:
1. **(Recommended)** Add the pip binary directory to your system `PATH` in your `~/.bashrc` or `~/.zshrc` file.
2. **Fallback:** You can always invoke the CLI directly through Python using:
   ```bash
   python -m piart repos list
   ```

**Setup fails during first run**

If the automatic setup process fails:

1. **Check network connectivity**: Ensure you can reach the preconfigured backend URL from your machine
2. **Manual setup**: Try running setup manually: `piart setup https://97o933vkj1.execute-api.us-east-1.amazonaws.com`
3. **Check vamscli logs**: The underlying error may be logged in vamscli log files
4. **Contact support**: If the issue persists, contact support with the error details

**VamsCLI installation fails**

If the automatic vamscli installation fails:
1. Try installing vamscli manually: `pip install vamscli`
2. Check that you have sufficient permissions to install packages
3. If using a virtual environment, ensure it's activated

**Skip automatic setup**

If you need to skip the automatic setup (e.g., for testing):
```bash
# These commands won't trigger automatic setup
piart --help
piart --version
piart setup https://97o933vkj1.execute-api.us-east-1.amazonaws.com  # Manual setup
```
