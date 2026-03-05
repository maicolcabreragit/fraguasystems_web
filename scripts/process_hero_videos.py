"""
Fragua Systems — Video Processor for Hero Background
Strips audio, metadata (AI markers), and compresses for web delivery.
"""

import os
import subprocess
import sys

FFMPEG = os.path.join(
    os.environ.get("LOCALAPPDATA", ""),
    "Microsoft", "WinGet", "Packages",
    "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
    "ffmpeg-8.0.1-full_build", "bin", "ffmpeg.exe"
)

VIDEO_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "hero-videos")
PROCESSED_DIR = os.path.join(VIDEO_DIR, "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Target: ~1-2MB per video for fast loading
# CRF 28-32 = good quality for background video (blurred by overlay anyway)
# Scale to 1280x720 max (hero bg doesn't need 1080p)
# Strip all metadata with -map_metadata -1

def process_video(input_path: str, output_path: str) -> bool:
    """Process a single video: strip audio, metadata, compress."""
    cmd = [
        FFMPEG,
        "-y",                       # Overwrite
        "-i", input_path,
        "-an",                      # Strip audio
        "-c:v", "libx264",          # H.264 codec
        "-preset", "slow",          # Better compression
        "-crf", "30",               # Quality (28-32 for bg video)
        "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
        "-pix_fmt", "yuv420p",      # Browser compatibility
        "-movflags", "+faststart",  # Progressive loading
        "-map_metadata", "-1",      # Strip ALL metadata
        "-fflags", "+bitexact",     # Deterministic output (no encoder tags)
        "-flags:v", "+bitexact",
        output_path,
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print(f"  ❌ ffmpeg error: {result.stderr[-300:]}")
            return False
        return True
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def main():
    print(f"\n🎬 Fragua Systems — Hero Video Processor")
    print(f"   ffmpeg: {os.path.basename(FFMPEG)}")
    print(f"   Source: {os.path.abspath(VIDEO_DIR)}")
    print(f"   Output: {os.path.abspath(PROCESSED_DIR)}")
    
    if not os.path.exists(FFMPEG):
        print(f"   ❌ ffmpeg not found at: {FFMPEG}")
        sys.exit(1)
    
    videos = [f for f in os.listdir(VIDEO_DIR) if f.endswith(".mp4") and os.path.isfile(os.path.join(VIDEO_DIR, f))]
    videos.sort()
    
    print(f"   Videos: {len(videos)}")
    print()
    
    results = []
    total_saved = 0
    
    for i, filename in enumerate(videos, 1):
        input_path = os.path.join(VIDEO_DIR, filename)
        output_path = os.path.join(PROCESSED_DIR, filename)
        
        input_size = os.path.getsize(input_path) / (1024 * 1024)
        print(f"  [{i}/{len(videos)}] {filename} ({input_size:.1f} MB)...")
        
        ok = process_video(input_path, output_path)
        
        if ok and os.path.exists(output_path):
            output_size = os.path.getsize(output_path) / (1024 * 1024)
            reduction = ((input_size - output_size) / input_size) * 100
            total_saved += (input_size - output_size)
            print(f"  ✅ {output_size:.1f} MB (-{reduction:.0f}%)")
            results.append(filename)
        else:
            print(f"  ❌ Failed")
        print()
    
    # Replace originals with processed versions
    if results:
        print(f"  📦 Replacing originals with processed versions...")
        for filename in results:
            src = os.path.join(PROCESSED_DIR, filename)
            dst = os.path.join(VIDEO_DIR, filename)
            os.replace(src, dst)
            print(f"     ✅ {filename}")
    
    # Cleanup processed dir
    try:
        os.rmdir(PROCESSED_DIR)
    except OSError:
        pass
    
    print(f"\n{'='*50}")
    print(f"✅ Processed {len(results)}/{len(videos)} videos")
    print(f"💾 Saved {total_saved:.1f} MB total")
    print(f"📁 {os.path.abspath(VIDEO_DIR)}")
    print()


if __name__ == "__main__":
    main()
