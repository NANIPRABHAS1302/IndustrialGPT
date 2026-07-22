@echo off
echo ============================================================
echo IndustrialGPT - Generating Physical PDF, DOCX, PPTX & ZIP Files
echo ============================================================
cd /d "c:\IndustrialGPT"
if exist ".venv\Scripts\python.exe" (
    .venv\Scripts\python.exe docs\create_and_verify.py
) else (
    python docs\create_and_verify.py
)
echo ============================================================
echo Done! All files generated in Hackathon_Submission_Package.
echo ============================================================
pause
