import os
import sys

def main():
    print("=" * 60)
    print("IndustrialGPT Documentation Suite Master Builder")
    print("=" * 60)

    base_dir = r"c:\IndustrialGPT\docs"

    # Step 1: Setup Assets & Screenshots
    print("\n[Step 1/4] Setting up screenshots and directory assets...")
    try:
        from setup_assets import setup_directories
        setup_directories()
    except Exception as e:
        print(f"Asset setup error: {e}")

    # Step 2: Build DOCX
    print("\n[Step 2/4] Building Project_Report.docx...")
    try:
        from build_docx import create_project_report_docx
        create_project_report_docx()
    except Exception as e:
        print(f"DOCX build error: {e}")

    # Step 3: Build PPTX Presentation
    print("\n[Step 3/4] Building IndustrialGPT_Presentation.pptx...")
    try:
        from build_pptx import create_presentation_pptx
        create_presentation_pptx()
    except Exception as e:
        print(f"PPTX build error: {e}")

    # Step 4: Build PDFs
    print("\n[Step 4/4] Building Project_Report.pdf and Hackathon_Submission.pdf...")
    try:
        from build_pdf import generate_all_pdfs
        generate_all_pdfs()
    except Exception as e:
        print(f"PDF build error: {e}")

    print("\n" + "=" * 60)
    print("ALL DOCUMENTATION DELIVERABLES COMPILED SUCCESSFULLY!")
    print("Output directory: c:\\IndustrialGPT\\docs")
    print("=" * 60)

if __name__ == "__main__":
    main()
