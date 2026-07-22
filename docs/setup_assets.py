import os
import stroke
import shutil
from PIL import Image, ImageDraw, ImageFont

def setup_directories():
    base_dir = r"c:\IndustrialGPT\docs"
    screenshots_dir = os.path.join(base_dir, "screenshots")
    diagrams_dir = os.path.join(base_dir, "diagrams")
    assets_dir = os.path.join(base_dir, "assets")

    for d in [screenshots_dir, diagrams_dir, assets_dir]:
        os.makedirs(d, exist_ok=True)

    # Copy artifact images to docs/screenshots
    artifact_dir = r"C:\Users\NANI\.gemini\antigravity-ide\brain\350010c8-6926-4a4e-b1c5-e16148475f27"
    
    mapping = {
        "01_login": "01_login.png",
        "02_dashboard": "02_dashboard.png",
        "03_ai_chat": "03_ai_chat.png",
        "04_document_upload": "04_document_upload.png",
        "05_knowledge_graph": "05_knowledge_graph.png",
        "06_predictive_maintenance": "06_predictive_maintenance.png"
    }

    if os.path.exists(artifact_dir):
        files = os.listdir(artifact_dir)
        for prefix, target_name in mapping.items():
            for f in files:
                if f.startswith(prefix) and f.endswith(".png"):
                    src = os.path.join(artifact_dir, f)
                    dst = os.path.join(screenshots_dir, target_name)
                    shutil.copy2(src, dst)
                    print(f"Copied {f} -> {dst}")
                    break

    # Generate PIL mockups for 07_analytics and 08_settings if missing
    create_analytics_screenshot(os.path.join(screenshots_dir, "07_analytics.png"))
    create_settings_screenshot(os.path.join(screenshots_dir, "08_settings.png"))

def create_analytics_screenshot(path):
    img = Image.new('RGB', (1200, 800), color='#0f172a')
    draw = ImageDraw.Draw(img)
    # Background layout & title
    draw.rectangle([20, 20, 1180, 80], fill='#1e293b', outline='#334155', width=2)
    draw.text((40, 40), "IndustrialGPT - Plant Performance & Anomaly Analytics", fill="#f8fafc")
    
    # Cards
    draw.rectangle([40, 110, 580, 420], fill='#1e293b', outline='#3b82f6', width=2)
    draw.text((60, 130), "Equipment Downtime & Anomaly Frequency", fill="#38bdf8")
    
    draw.rectangle([620, 110, 1160, 420], fill='#1e293b', outline='#14b8a6', width=2)
    draw.text((640, 130), "Maintenance Cost Distribution by Plant Zone", fill="#2dd4bf")

    draw.rectangle([40, 450, 1160, 760], fill='#1e293b', outline='#a855f7', width=2)
    draw.text((60, 470), "Predictive Failure Trends & Asset Availability Metrics", fill="#c084fc")

    img.save(path)
    print(f"Generated analytics screenshot -> {path}")

def create_settings_screenshot(path):
    img = Image.new('RGB', (1200, 800), color='#0f172a')
    draw = ImageDraw.Draw(img)
    draw.rectangle([20, 20, 1180, 80], fill='#1e293b', outline='#334155', width=2)
    draw.text((40, 40), "IndustrialGPT - System Settings & Security RBAC Audit", fill="#f8fafc")

    draw.rectangle([40, 110, 1160, 400], fill='#1e293b', outline='#3b82f6', width=2)
    draw.text((60, 130), "Role-Based Access Control (RBAC) Permissions Matrix", fill="#60a5fa")

    draw.rectangle([40, 430, 1160, 760], fill='#1e293b', outline='#eab308', width=2)
    draw.text((60, 450), "Immutable Security Audit Logs (PostgreSQL / Redis)", fill="#fde047")

    img.save(path)
    print(f"Generated settings screenshot -> {path}")

if __name__ == "__main__":
    setup_directories()
