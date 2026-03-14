"""
Auto-installer for bundled vamscli wheel.
This runs on first use of piart command if vamscli is not already installed.
"""
import os
import sys
import subprocess
from pathlib import Path
from importlib.metadata import distribution, PackageNotFoundError


def display_success_banner():
    """Display ASCII art banner for successful PIART installation."""
    print("\n" + "="*80)
    
    # PIART Acronym and Success Message
    print("""
    ██████╗ ██╗ █████╗ ██████╗ ████████╗
    ██╔══██╗██║██╔══██╗██╔══██╗╚══██╔══╝
    ██████╔╝██║███████║██████╔╝   ██║   
    ██╔═══╝ ██║██╔══██║██╔══██╗   ██║   
    ██║     ██║██║  ██║██║  ██║   ██║   
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
    
    Physical Intelligence Asset Reuse Taskforce
    """)
    print("="*80)
    print("="*80 + "\n")


def install_bundled_vamscli():
    """Install the bundled vamscli wheel if not already installed."""
    
    # Check if vamscli is already installed
    try:
        distribution('vamscli')
        return True  # Already installed, nothing to do
    except PackageNotFoundError:
        pass
    
    try:
        # Find the bundled wheel file
        package_dir = Path(__file__).parent
        bundled_dir = package_dir / "bundled"
        
        wheel_files = list(bundled_dir.glob("vamscli-*.whl"))
        if not wheel_files:
            print("Warning: No bundled vamscli wheel found")
            return False
            
        wheel_file = wheel_files[0]  # Take the first/only wheel
        
        print("Installing vamscli dependency...")
        print(f"Installing: {wheel_file.name}")
        
        # Install the wheel using pip
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", str(wheel_file)
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            # Display success banner (comment out the line below to disable ASCII art)
            display_success_banner()
            return True
        else:
            print(f"❌ Failed to install vamscli: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"Error installing bundled vamscli: {e}")
        return False


if __name__ == "__main__":
    install_bundled_vamscli()