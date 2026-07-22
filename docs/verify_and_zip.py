import os
import shutil
import zipfile

def verify_and_regenerate_zip():
    pkg_dir = r"c:\IndustrialGPT\docs\Hackathon_Submission_Package"
    final_dir = os.path.join(pkg_dir, "10_Final_Submission")
    os.makedirs(final_dir, exist_ok=True)
    zip_path = os.path.join(final_dir, "IndustrialGPT_ET_AI_Hackathon_Submission.zip")

    # Audit list of expected files
    expected_files = [
        "INDEX.md",
        "FILE_MANIFEST.md",
        os.path.join("01_Project_Report", "Project_Report.md"),
        os.path.join("02_Hackathon_Submission", "Hackathon_Submission.md"),
        os.path.join("02_Hackathon_Submission", "EXECUTIVE_SUMMARY.md"),
        os.path.join("04_Documentation", "README.md"),
        os.path.join("04_Documentation", "API_DOCUMENTATION.md"),
        os.path.join("04_Documentation", "ARCHITECTURE.md"),
        os.path.join("04_Documentation", "DATABASE_SCHEMA.md"),
        os.path.join("04_Documentation", "USER_MANUAL.md"),
        os.path.join("04_Documentation", "INSTALLATION_GUIDE.md"),
        os.path.join("09_Verification", "FINAL_SUBMISSION_CHECKLIST.md")
    ]

    print("Verifying package contents...")
    for rel_path in expected_files:
        full_p = os.path.join(pkg_dir, rel_path)
        if os.path.exists(full_p):
            print(f"  [✓] Verified: {rel_path}")
        else:
            print(f"  [X] Missing: {rel_path}")

    # Regenerate ZIP
    if os.path.exists(zip_path):
        os.remove(zip_path)

    print(f"\nRegenerating submission ZIP archive -> {zip_path}")
    count = 0
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(pkg_dir):
            for file in files:
                if file == "IndustrialGPT_ET_AI_Hackathon_Submission.zip":
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(pkg_dir))
                zipf.write(file_path, arcname)
                count += 1

    zip_size = os.path.getsize(zip_path)
    print(f"Archive successfully regenerated! {count} files packaged. Total size: {zip_size:,} bytes.")

if __name__ == "__main__":
    verify_and_regenerate_zip()
