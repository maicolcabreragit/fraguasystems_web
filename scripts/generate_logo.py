"""
Fragua Systems — Professional Logo Generator via Vertex AI (Imagen 3)
Uses Google Cloud $300 credits via Vertex AI endpoint.
"""

import os
import sys
import time
import base64
import json
import subprocess
import urllib.request
import urllib.error

PROJECT_ID = "185039956964"
REGION = "us-central1"
MODEL = "imagen-3.0-generate-002"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "brand")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════════
# Professional Corporate Logo Prompts
# ═══════════════════════════════════════════════════════════════

PROMPTS = {
    "monogram_fs_copper": (
        "Professional corporate logo mark for a B2B technology consulting firm called Fragua Systems. "
        "Minimalist geometric monogram combining letters F and S into one unified clean shape. "
        "Inspired by Accenture and McKinsey branding. Single solid warm copper-bronze color on "
        "pure white background. No text labels, no gradients, no 3D. Flat solid vector aesthetic. "
        "Clean precise lines. Suitable for business cards. Square format."
    ),
    "monogram_fs_dark": (
        "Elegant corporate monogram logo combining F and S letters into one geometric mark. "
        "Dark charcoal gray on white background. Inspired by luxury consulting firms like "
        "Bain and BCG. Ultra-minimal, mathematically precise. No text, no gradients, no 3D. "
        "Professional for a Fortune 500 annual report. Flat solid vector. Square format."
    ),
    "abstract_structure": (
        "Clean minimal corporate logo for a premium enterprise software company. "
        "Abstract geometric shape suggesting structure, precision, digital transformation. "
        "Inspired by SAP, Palantir, Stripe logo design. Single solid dark gray mark on white. "
        "No text, no icons, no literal objects. Ultra-minimal professional identity. "
        "Flat vector with sharp clean edges. Square format."
    ),
    "forge_abstract": (
        "Sophisticated minimal corporate logo for a technology company named Fragua (forge). "
        "Abstract shape subtly suggesting transformation and engineering. NOT a literal anvil. "
        "Think Deloitte green dot simplicity. Single warm bronze-copper tone on white background. "
        "No text, no flourishes. Professional for a board meeting. Clean geometric. "
        "Flat solid vector, suitable as favicon. Square format."
    ),
    "geometric_mark": (
        "Ultra-premium corporate identity mark for a B2B enterprise technology firm. "
        "Single geometric shape — interlocking planes or angular intersection — conveying "
        "precision engineering. Warm copper bronze on white background. No text, no literal imagery. "
        "The kind of mark on a McKinsey or Goldman Sachs presentation. Mathematically perfect. "
        "Flat vector, clean, corporate. Square format."
    ),
}


def get_access_token() -> str:
    gcloud_path = os.path.join(
        os.environ.get("LOCALAPPDATA", ""),
        "Google", "Cloud SDK", "google-cloud-sdk", "bin", "gcloud.cmd"
    )
    result = subprocess.run(
        [gcloud_path, "auth", "print-access-token"],
        capture_output=True, text=True, timeout=15
    )
    token = result.stdout.strip()
    if not token:
        print(f"❌ gcloud error: {result.stderr}")
        sys.exit(1)
    return token


def generate_image(prompt_name: str, prompt_text: str, access_token: str) -> str | None:
    url = (
        f"https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}"
        f"/locations/{REGION}/publishers/google/models/{MODEL}:predict"
    )
    
    payload = {
        "instances": [{"prompt": prompt_text}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "1:1",
            "personGeneration": "dont_allow",
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else ""
        print(f"  ❌ HTTP {e.code}: {error_body[:300]}")
        return None
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None
    
    predictions = result.get("predictions", [])
    if predictions and "bytesBase64Encoded" in predictions[0]:
        img_bytes = base64.b64decode(predictions[0]["bytesBase64Encoded"])
        mime = predictions[0].get("mimeType", "image/png")
        ext = "png" if "png" in mime else "webp" if "webp" in mime else "jpg"
        
        filename = f"logo_{prompt_name}.{ext}"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        
        size_kb = len(img_bytes) / 1024
        print(f"  ✅ {filename} ({size_kb:.0f} KB)")
        return filepath
    
    print(f"  ⚠️ No image in response: {json.dumps(result)[:200]}")
    return None


def main():
    print(f"\n🔥 Fragua Systems — Vertex AI Logo Generator")
    print(f"   Model: {MODEL} (Imagen 3)")
    print(f"   Project: {PROJECT_ID} | Region: {REGION}")
    print(f"   Output: {os.path.abspath(OUTPUT_DIR)}")
    print(f"\n   🔑 Getting access token...")
    
    access_token = get_access_token()
    print(f"   ✅ Authenticated")
    print(f"   Generating {len(PROMPTS)} variations...\n")
    
    results = []
    
    for i, (name, prompt) in enumerate(PROMPTS.items(), 1):
        print(f"  [{i}/{len(PROMPTS)}] {name}...")
        filepath = generate_image(name, prompt, access_token)
        if filepath:
            results.append(filepath)
        else:
            print(f"  ❌ Failed")
        
        if i < len(PROMPTS):
            time.sleep(2)
        print()
    
    print(f"{'='*50}")
    print(f"✅ Generated {len(results)}/{len(PROMPTS)} logos via Vertex AI")
    print(f"📁 {os.path.abspath(OUTPUT_DIR)}")
    for r in results:
        print(f"   → {os.path.basename(r)}")
    print()


if __name__ == "__main__":
    main()
