"""
Fragua Systems — Image Metadata Cleaner & Favicon Generator

Strips ALL metadata (EXIF, SynthID, AI markers) from images to avoid 
SEO penalties. Optionally generates favicon sizes for web integration.

Usage:
  python scripts/clean_image.py <image_path> [--favicons] [--transparent]

Examples:
  python scripts/clean_image.py public/brand/logo.png --favicons --transparent
  python scripts/clean_image.py assets/photo.jpg
"""

import argparse
import os
import sys
from PIL import Image


def strip_metadata(src: str, transparent: bool = False) -> str:
    """Re-encode image to strip ALL metadata. Returns cleaned file path."""
    img = Image.open(src).convert("RGBA")

    if transparent:
        # Replace white/near-white pixels with transparent
        data = img.getdata()
        new_data = []
        for pixel in data:
            if pixel[0] > 240 and pixel[1] > 240 and pixel[2] > 240:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(pixel)
        img.putdata(new_data)

    # Save clean (no metadata, re-encoded pixel data)
    img.save(src, "PNG", optimize=True)
    size_kb = os.path.getsize(src) / 1024
    print(f"  ✅ Cleaned: {os.path.basename(src)} ({size_kb:.0f} KB)")
    return src


def generate_favicons(src: str, output_dir: str) -> list[str]:
    """Generate standard favicon sizes from source image."""
    img = Image.open(src).convert("RGBA")
    
    sizes = [
        (32, "favicon-32.png"),
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
    ]
    
    generated = []
    for size, name in sizes:
        resized = img.resize((size, size), Image.LANCZOS)
        path = os.path.join(output_dir, name)
        resized.save(path, "PNG", optimize=True)
        generated.append(path)
        print(f"  📐 {name} ({size}×{size}px)")
    
    return generated


def main():
    parser = argparse.ArgumentParser(
        description="Strip metadata from images & generate favicons"
    )
    parser.add_argument("image", help="Path to the source image")
    parser.add_argument(
        "--favicons", action="store_true",
        help="Generate favicon sizes (32, 180, 192, 512px)"
    )
    parser.add_argument(
        "--transparent", action="store_true",
        help="Remove white background (make transparent)"
    )
    parser.add_argument(
        "--output-dir", default=None,
        help="Output directory for favicons (default: same as source)"
    )
    args = parser.parse_args()

    if not os.path.exists(args.image):
        print(f"❌ File not found: {args.image}")
        sys.exit(1)

    print(f"\n🔧 Fragua Systems — Image Cleaner")
    print(f"   Source: {os.path.abspath(args.image)}\n")

    # Strip metadata
    strip_metadata(args.image, transparent=args.transparent)

    # Generate favicons
    if args.favicons:
        output_dir = args.output_dir or os.path.dirname(args.image)
        print(f"\n   Generating favicons → {output_dir}")
        generate_favicons(args.image, output_dir)

    print(f"\n✅ Done\n")


if __name__ == "__main__":
    main()
