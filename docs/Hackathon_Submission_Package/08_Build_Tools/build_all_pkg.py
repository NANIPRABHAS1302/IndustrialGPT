import os
import shutil
import zipfile

def create_submission_zip():
    pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    final_dir = os.path.join(pkg_dir, "10_Final_Submission")
    os.makedirs(final_dir, exist_ok=True)
    zip_path = os.path.join(final_dir, "IndustrialGPT_ET_AI_Hackathon_Submission.zip")

    print(f"\nCreating final submission archive -> {zip_path}")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(pkg_dir):
            for file in files:
                # Do not include the output zip inside itself
                if file == "IndustrialGPT_ET_AI_Hackathon_Submission.zip":
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(pkg_dir))
                zipf.write(file_path, arcname)

    print(f"ZIP archive creation completed! Archive size: {os.path.getsize(zip_path)} bytes")

def main():
    print("=" * 60)
    print("IndustrialGPT Hackathon Package Master Builder")
    print("=" * 60)

    try:
        from build_docx_pkg import create_project_report_docx
        create_project_report_docx()
    except Exception as e:
        print(f"DOCX error: {e}")

    try:
        from build_pptx_pkg import create_presentation_pptx
        create_presentation_pptx()
    except Exception as e:
        print(f"PPTX error: {e}")

    try:
        from build_pdf_pkg import generate_all_pdfs
        generate_all_pdfs()
    except Exception as e:
        print(f"PDF error: {e}")

    create_submission_zip()

if __name__ == "__main__":
    main()
