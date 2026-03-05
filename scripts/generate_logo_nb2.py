"""
Fragua Systems — Brand-Aligned Logo Generator (Nano Banana 2)
Prompts designed to match the Industrial Luxe design system.
"""

import os, sys, time, base64, json, urllib.request, urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("❌ Set GEMINI_API_KEY"); sys.exit(1)

MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "brand", "v3")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════════
# Brand Context:
# - Fragua = Forge (Spanish). Metaphor: raw materials → refined solutions
# - B2B HORECA sector: hotels, restaurants, catering
# - Design system: "Industrial Luxe" - dark corporate + warm copper
# - Palette: Abyss Black #0A0A0A, Forged Slate #1A1D23,
#            Molten Copper #C86A3D, Industrial Gold #B8941F,
#            Titanium White #F5F5F5
# - Web: dark hero, sharp geometric lines, no rounded corners
# - Target: decision-makers, trust, ROI, compliance
# ═══════════════════════════════════════════════════════════════

PROMPTS = {
    # 1: The forge flame rendered as an abstract corporate mark
    "fragua_flame": (
        "Create a highly professional and memorable corporate logo mark. "
        "The mark should be an abstract, geometric interpretation of a forge flame — "
        "NOT a literal fire, but a sophisticated angular shape that subtly evokes "
        "heat, transformation, and precision engineering. Use exactly two colors: "
        "molten copper (#C86A3D) as the primary mark color and dark slate (#1A1D23) "
        "as an accent shadow or secondary plane. Set on a clean white (#FFFFFF) background. "
        "The style should be ultra-clean, geometric, with sharp angles (zero rounded corners). "
        "Think premium B2B corporate identity used by engineering consultancies. "
        "No text, no literal objects, no gradients, no 3D effects. "
        "Flat vector aesthetic. Must be recognizable at favicon size (32x32px). "
        "Square 1:1 format."
    ),

    # 2: Interlocking F geometry — structural, architectural
    "structural_f": (
        "Design a premium corporate logo mark based on the letter F, "
        "constructed from interlocking geometric planes that suggest both "
        "a steel structural beam and a digital circuit. The F should feel "
        "architectural and load-bearing, not decorative. Use warm copper-bronze "
        "(#C86A3D) as the main color on pure white background. Sharp corners only, "
        "no curves. Inspired by the precision of Swiss design and the authority of "
        "firms like Palantir or Stripe. The mark should feel like it belongs on an "
        "engineering blueprint. No text, no embellishments. Flat solid vector. "
        "Must work as both a dark-background icon and light-background icon. "
        "Memorable and distinctive. Square 1:1 format."
    ),

    # 3: FS monogram — intertwined precision
    "precision_fs": (
        "Create an elegant corporate monogram logo combining the letters F and S "
        "into a single interconnected geometric mark. The two letters should share "
        "structural elements — like a well-engineered joint — suggesting unity and "
        "precision. Color: single tone of warm copper (#C86A3D) on white background. "
        "The style must be sharp, angular, with no rounded edges. "
        "Inspired by top-tier consulting firm identities (McKinsey, BCG, Bain) "
        "but more distinctive and modern. The monogram should be instantly "
        "recognizable and memorable. No decorations, no gradients, no 3D. "
        "Professional enough for corporate stationery and investor presentations. "
        "Square 1:1 format."
    ),

    # 4: Abstract anvil — the forge's foundation
    "anvil_abstract": (
        "Design a minimalist, abstract corporate logo mark that very subtly suggests "
        "an anvil shape — the symbol of a forge. It should NOT look like a literal anvil, "
        "but rather an elegant geometric abstraction that evokes solidity, foundation, "
        "and transformation. Use two tones: dark charcoal (#1A1D23) for the main shape "
        "and warm copper (#C86A3D) for a single accent element (like a spark or edge). "
        "White background. Sharp geometric angles, zero curves. The mark should convey "
        "industrial authority and premium engineering. Think of how Deloitte uses a simple "
        "dot — this should be that level of sophistication but more memorable. "
        "No text, no gradients. Flat clean vector. Square 1:1 format."
    ),

    # 5: Copper ingot — transformation complete
    "copper_ingot": (
        "Create a corporate logo mark shaped like a refined, geometric copper ingot or bar — "
        "representing the finished product of a forge: raw materials transformed into something "
        "valuable and precise. Use warm copper tones (#C86A3D and #B8941F) with sharp angular "
        "facets that catch light differently (flat geometric planes, NOT realistic shading). "
        "White background. The shape should be instantly distinctive and memorable. "
        "Think of the Stripe logo's simplicity or the Airbnb logo's memorability "
        "but with an industrial, engineering feel. No text, no decorative elements. "
        "Sharp edges only. Flat vector. Works at any size from favicon to billboard. "
        "Square 1:1 format."
    ),

    # 6: The spark — moment of creation
    "spark_mark": (
        "Design a distinctive corporate logo mark representing an abstract spark — "
        "the moment metal meets metal in a forge. NOT a literal spark or explosion, "
        "but two sharp geometric shapes meeting at a precise point, creating a sense "
        "of energy and precision engineering. Color: warm copper (#C86A3D) with a small "
        "accent of industrial gold (#B8941F) at the intersection point. White background. "
        "Ultra-clean geometric design with sharp angles. Modern premium corporate identity "
        "suitable for a technology engineering firm. Must be highly memorable and distinctive — "
        "the kind of logo that makes people ask 'who designed that?' "
        "No text, no curves, no gradients. Flat solid vector. Square 1:1 format."
    ),
}


def generate(name, prompt):
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["image", "text"], "temperature": 1.0}
    }
    req = urllib.request.Request(API_URL, json.dumps(payload).encode(), {"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            r = json.loads(resp.read())
        for c in r.get("candidates", []):
            for p in c.get("content", {}).get("parts", []):
                if "inlineData" in p:
                    data = base64.b64decode(p["inlineData"]["data"])
                    mime = p["inlineData"].get("mimeType", "image/png")
                    ext = "png" if "png" in mime else "webp" if "webp" in mime else "jpg"
                    fp = os.path.join(OUTPUT_DIR, f"logo_{name}.{ext}")
                    with open(fp, "wb") as f: f.write(data)
                    print(f"  ✅ logo_{name}.{ext} ({len(data)//1024} KB)")
                    return fp
    except urllib.error.HTTPError as e:
        print(f"  ❌ HTTP {e.code}: {e.read().decode()[:200] if e.fp else ''}")
    except Exception as e:
        print(f"  ❌ {e}")
    return None


def main():
    print(f"\n🔥 Fragua Systems — Brand-Aligned Logo Generator v3")
    print(f"   Model: Nano Banana 2 ({MODEL})")
    print(f"   Output: {os.path.abspath(OUTPUT_DIR)}\n")
    
    results = []
    for i, (n, p) in enumerate(PROMPTS.items(), 1):
        print(f"  [{i}/{len(PROMPTS)}] {n}...")
        r = generate(n, p)
        if r: results.append(r)
        else: print(f"  ❌ Failed")
        if i < len(PROMPTS):
            print(f"  ⏳ 12s...")
            time.sleep(12)
        print()
    
    print(f"{'='*50}")
    print(f"✅ {len(results)}/{len(PROMPTS)} logos generated")
    for r in results: print(f"   → {os.path.basename(r)}")


if __name__ == "__main__":
    main()
