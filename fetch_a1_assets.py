import os
import urllib.request
import time

BASE_URL = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets"

ASSETS = {
    # Animals
    "fox.png": "Fox/3D/fox_3d.png",
    "bunny.png": "Rabbit face/3D/rabbit_face_3d.png",
    "bear.png": "Bear/3D/bear_3d.png",
    "panda.png": "Panda/3D/panda_3d.png",
    "puppy.png": "Dog face/3D/dog_face_3d.png",
    "lion.png": "Lion/3D/lion_3d.png",
    
    # Environment
    "sun.png": "Sun with face/3D/sun_with_face_3d.png",  # Use Sun with face instead
    "cloud.png": "Cloud/3D/cloud_3d.png",
    "tree.png": "Evergreen tree/3D/evergreen_tree_3d.png", # Use Evergreen tree
    "flower.png": "Blossom/3D/blossom_3d.png",
    "sparkles.png": "Sparkles/3D/sparkles_3d.png",
    "mushroom.png": "Mushroom/3D/mushroom_3d.png"
}

TARGET_DIR = r"C:\Users\USER\OneDrive\Desktop\snowie\frontend\public\assets\a1"

def main():
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    for filename, remote_path in ASSETS.items():
        url_path = urllib.parse.quote(remote_path)
        url = f"{BASE_URL}/{url_path}"
        dest = os.path.join(TARGET_DIR, filename)
        
        print(f"Downloading {filename}...")
        try:
            # Add User-Agent to avoid potential blocks
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                content = response.read()
                # Check if we got a 404 (github returns text/plain for 404)
                if len(content) < 100 or b"404: Not Found" in content:
                    print(f"  -> 404 Not Found for {remote_path}")
                else:
                    with open(dest, "wb") as f:
                        f.write(content)
                    print(f"  -> Saved {len(content)} bytes to {dest}")
        except Exception as e:
            print(f"  -> Failed: {e}")

    with open(os.path.join(TARGET_DIR, "LICENSE.md"), "w") as f:
        f.write("# Microsoft Fluent UI Emojis\n\nLicense: MIT\nhttps://github.com/microsoft/fluentui-emoji")

if __name__ == "__main__":
    import urllib.parse
    main()
