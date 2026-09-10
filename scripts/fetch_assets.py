import os
import urllib.request
import ssl

def download_file(url, filepath):
    # Disable SSL verification for simplicity if needed
    context = ssl._create_unverified_context()
    print(f"Downloading {url} to {filepath}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=context) as response:
            with open(filepath, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Success: {filepath}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

assets = {
    # Lumi character
    "lumi.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/fairy.svg",
    # Sky
    "moon.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/moon.svg",
    "star.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/star-formation.svg",
    "cloud.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/cloud-ring.svg",
    "rocket.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/rocket-flight.svg",
    "balloon.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/delapouite/hot-air-balloon.svg",
    "saturn.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/ringed-planet.svg",
    # Environment
    "castle.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/castle.svg",
    "tree.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/pine-tree.svg",
    "flower.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/flower-pot.svg",
    # Interactables
    "crystal.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/crystal-cluster.svg",
    "wand.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/fairy-wand.svg",
    "butterfly.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/butterfly.svg",
    "sparkles.svg": "https://raw.githubusercontent.com/game-icons/icons/master/1x1/lorc/sparkles.svg",
}

dest_dir = r"c:\Users\USER\OneDrive\Desktop\snowie\frontend\public\assets\magic-world"
os.makedirs(dest_dir, exist_ok=True)

for filename, url in assets.items():
    download_file(url, os.path.join(dest_dir, filename))

print("Asset downloading completed.")
