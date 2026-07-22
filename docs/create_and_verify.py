import os
import sys
import time

# Import direct generator
from create_documents_direct import main as build_files

print("Starting generation of physical output files...")
build_files()

print("\n" + "=" * 70)
print("PHYSICAL FILE EXISTENCE VERIFICATION REPORT")
print("=" * 70)

target_files = [
    r"c:\IndustrialGPT\docs\Hackathon_Submission_Package\01_Project_Report\Project_Report.pdf",
    r"c:\IndustrialGPT\docs\Hackathon_Submission_Package\01_Project_Report\Project_Report.docx",
    r"c:\IndustrialGPT\docs\Hackathon_Submission_Package\02_Hackathon_Submission\Hackathon_Submission.pdf",
    r"c:\IndustrialGPT\docs\Hackathon_Submission_Package\03_Presentation\IndustrialGPT_Presentation.pptx",
    r"c:\IndustrialGPT\docs\Hackathon_Submission_Package\10_Final_Submission\IndustrialGPT_ET_AI_Hackathon_Submission.zip"
]

all_exist = True
for fpath in target_files:
    if os.path.exists(fpath):
        stat = os.stat(fpath)
        mtime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_mtime))
        print(f"\n[✓] VERIFIED: File exists on disk!")
        print(f"    Path:      {fpath}")
        print(f"    Size:      {stat.st_size:,} bytes")
        print(f"    Timestamp: {mtime}")
    else:
        print(f"\n[X] MISSING: File does NOT exist -> {fpath}")
        all_exist = False

print("\n" + "=" * 70)
if all_exist:
    print("VERIFICATION RESULT: ALL REQUIRED OUTPUT FILES PHYSICALLY EXIST ON DISK!")
else:
    print("VERIFICATION RESULT: SOME FILES ARE MISSING!")
print("=" * 70)
