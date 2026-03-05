"""
Fragua Systems — Hero Video Generator via Vertex AI (Veo 3.1)
Generates cinematic hero background videos for the website.

Usage:
  python scripts/generate_hero_videos.py [--fast]

Flags:
  --fast    Use veo-3.1-fast-generate-001 (faster, lower quality)
  default   Use veo-3.1-generate-001 (best quality)
"""

import os
import sys
import time
import json
import base64
import subprocess
import urllib.request
import urllib.error

PROJECT_ID = "185039956964"
REGION = "us-central1"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "hero-videos")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════════
# Hero Video Prompts — Cinematic HORECA Engineering
#
# Design brief:
# - Realistic, photographic quality (NOT AI-looking)
# - Dark, warm tones: abyss black, copper, gold accents
# - No text, no faces, no logos
# - Slow, ambient motion (hero background loops)
# - 16:9 landscape, 8 seconds each
# - Consistent visual language across all 5
# ═══════════════════════════════════════════════════════════════

PROMPTS = {
    # 1: The Forge — Molten copper, sparks, transformation
    "forge_transformation": (
        "Cinematic slow-motion shot inside a modern artisan forge. "
        "Molten copper being poured from a crucible into a precision mold, "
        "glowing orange-amber light illuminating the dark workshop. "
        "Shallow depth of field, sparks floating slowly through the air "
        "like stars. The camera slowly dollies forward. Shot on ARRI Alexa "
        "with anamorphic lenses. Warm copper and deep black color palette. "
        "No people visible, just hands and tools. No text or logos. "
        "Atmospheric, premium, mysterious."
    ),

    # 2: Hotel Lobby — Premium HORECA environment
    "hotel_lobby_evening": (
        "Elegant cinematic tracking shot through a luxury boutique hotel "
        "lobby at golden hour. Warm ambient lighting from copper-shade "
        "pendant lamps. Dark wood reception desk with brushed metal accents. "
        "Soft bokeh from fairy lights. A grand staircase in the background. "
        "No people in focus, just ambient atmosphere. Shot on Panavision "
        "with shallow depth of field. Slow dolly movement. Color graded "
        "with warm amber highlights and deep shadows. Hyper-realistic "
        "editorial photography style. No text."
    ),

    # 3: Restaurant Kitchen — Precision & Excellence
    "kitchen_precision": (
        "Professional cinematic shot of a high-end restaurant kitchen. "
        "Close-up of copper pans on a gas range with blue flames, "
        "steam rising gracefully. Warm copper cookware gleaming under "
        "industrial pendant lights. Selective focus, everything beyond "
        "the foreground is a soft warm bokeh. Slow camera push-in. "
        "Shot on RED V-Raptor, 85mm anamorphic lens. Dark moody lighting "
        "with warm copper and gold highlights. No faces visible. "
        "Michelin-star atmosphere. No text or logos."
    ),

    # 4: Data Center — Digital Infrastructure
    "data_infrastructure": (
        "Cinematic tracking shot down a corridor of a modern data center. "
        "Server racks with subtle blue and copper LED indicator lights "
        "creating geometric patterns in the darkness. Cable management "
        "illuminated by warm amber work lights. Slow steady dolly forward. "
        "Shot on Sony Venice 2 with vintage anamorphic glass. Shallow depth "
        "of field with beautiful lens flares from the LEDs. Dark atmosphere "
        "with isolated warm highlights. No people. The intersection of "
        "technology and craftsmanship. No text or logos."
    ),

    # 5: Abstract Copper Detail — The Brand Essence
    "copper_detail_abstract": (
        "Extreme macro cinematic shot of liquid copper solidifying on a "
        "polished dark surface. The metal transitions from molten orange "
        "to solid copper-bronze, creating organic crystalline patterns. "
        "Slow motion at 120fps. The surface reflects ambient warm light. "
        "Shot on Phantom Flex4K high-speed camera. Ultra-shallow depth of "
        "field. Dark background fading to pure black at the edges. "
        "Mesmerizing, meditative, premium. Abstract art that suggests "
        "transformation and engineering. No text or logos."
    ),
}


def get_access_token() -> str:
    """Get Google Cloud access token via gcloud CLI."""
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


def generate_video(prompt_name: str, prompt_text: str, access_token: str, model: str) -> str | None:
    """Submit a video generation request and poll for completion."""
    
    # Step 1: Submit the generation request (returns an operation)
    url = (
        f"https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}"
        f"/locations/{REGION}/publishers/google/models/{model}:predictLongRunning"
    )
    
    payload = {
        "instances": [{"prompt": prompt_text}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "16:9",
            "durationSeconds": 8,
            "personGeneration": "dont_allow",
            "resolution": "1080p",
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else ""
        print(f"  ❌ HTTP {e.code}: {error_body[:500]}")
        return None
    except Exception as e:
        print(f"  ❌ Request error: {e}")
        return None
    
    # Step 2: Get the operation name and poll via fetchPredictOperation
    operation_name = result.get("name")
    if not operation_name:
        # Direct response (unlikely for video)
        return _extract_video(result, prompt_name)
    
    short_id = operation_name.split("/")[-1][:20]
    print(f"  ⏳ Operation: {short_id}...")
    
    # Poll using fetchPredictOperation endpoint
    poll_url = (
        f"https://{REGION}-aiplatform.googleapis.com/v1/"
        f"projects/{PROJECT_ID}/locations/{REGION}/publishers/google/"
        f"models/{model}:fetchPredictOperation"
    )
    
    max_polls = 90  # 7.5 minutes max (videos can take a while)
    
    for i in range(max_polls):
        time.sleep(5)
        
        poll_payload = json.dumps({"operationName": operation_name}).encode("utf-8")
        poll_req = urllib.request.Request(
            poll_url,
            data=poll_payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            method="POST"
        )
        try:
            with urllib.request.urlopen(poll_req, timeout=30) as resp:
                status = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8") if e.fp else ""
            print(f"  ⚠️ Poll HTTP {e.code}: {error_body[:200]}")
            continue
        except Exception as e:
            print(f"  ⚠️ Poll error: {e}")
            continue
        
        if status.get("done"):
            response = status.get("response", status)
            return _extract_video(response, prompt_name)
        
        elapsed = (i + 1) * 5
        if elapsed % 30 == 0:
            print(f"  ⏳ {elapsed}s elapsed...")
    
    print(f"  ❌ Timeout after {max_polls * 5}s")
    return None


def _extract_video(response: dict, prompt_name: str) -> str | None:
    """Extract video bytes from the API response and save to file."""
    predictions = response.get("predictions", [])
    
    for pred in predictions:
        if "bytesBase64Encoded" in pred:
            video_bytes = base64.b64decode(pred["bytesBase64Encoded"])
            mime = pred.get("mimeType", "video/mp4")
            ext = "mp4" if "mp4" in mime else "webm" if "webm" in mime else "mp4"
            
            filename = f"hero_{prompt_name}.{ext}"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            with open(filepath, "wb") as f:
                f.write(video_bytes)
            
            size_mb = len(video_bytes) / (1024 * 1024)
            print(f"  ✅ {filename} ({size_mb:.1f} MB)")
            return filepath
    
    # Check for GCS URI
    for pred in predictions:
        if "gcsUri" in pred:
            print(f"  📁 Stored at: {pred['gcsUri']}")
            return pred["gcsUri"]
    
    print(f"  ⚠️ No video in response: {json.dumps(response)[:300]}")
    return None


def main():
    fast_mode = "--fast" in sys.argv
    model = "veo-3.1-fast-generate-001" if fast_mode else "veo-3.1-generate-001"
    
    print(f"\n🎬 Fragua Systems — Hero Video Generator")
    print(f"   Model: {model} (Veo 3.1)")
    print(f"   Project: {PROJECT_ID} | Region: {REGION}")
    print(f"   Output: {os.path.abspath(OUTPUT_DIR)}")
    print(f"   Videos: {len(PROMPTS)} × 8s @ 1080p 16:9")
    print(f"\n   🔑 Getting access token...")
    
    access_token = get_access_token()
    print(f"   ✅ Authenticated")
    print(f"   Generating {len(PROMPTS)} hero videos...\n")
    
    results = []
    
    for i, (name, prompt) in enumerate(PROMPTS.items(), 1):
        print(f"  [{i}/{len(PROMPTS)}] {name}...")
        filepath = generate_video(name, prompt, access_token, model)
        if filepath:
            results.append(filepath)
        else:
            print(f"  ❌ Failed")
        
        if i < len(PROMPTS):
            time.sleep(3)  # Brief pause between requests
        print()
    
    print(f"{'='*50}")
    print(f"✅ Generated {len(results)}/{len(PROMPTS)} hero videos")
    print(f"📁 {os.path.abspath(OUTPUT_DIR)}")
    for r in results:
        print(f"   → {os.path.basename(r) if not r.startswith('gs://') else r}")
    print()


if __name__ == "__main__":
    main()
