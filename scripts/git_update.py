import subprocess

def run_command(command):
    """Run a shell command and print its output."""
    try:
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        exit(1)

def main():
    # Step 1: Fetch all updates
    print("Fetching all updates...")
    run_command("git fetch --all")

    # Step 2: Ask user for commit SHA
    commit_sha = input("Enter the commit SHA to force hard reset to: ").strip()

    # Step 3: Perform hard reset
    print(f"Resetting to commit {commit_sha}...")
    run_command(f"git reset --hard {commit_sha}")

    # Step 4: Ask if user wants to clean untracked files
    clean_choice = input("Do you want to run 'git clean --fdx' to remove untracked files and directories? (y/n): ").strip().lower()
    if clean_choice == 'y':
        print("Cleaning untracked files and directories...")
        run_command("git clean --fdx")
    else:
        print("Skipping 'git clean --fdx'.")

if __name__ == "__main__":
    main()