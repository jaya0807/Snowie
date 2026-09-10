import urllib.request
import urllib.parse
import os

os.makedirs("frontend/public/assets/storyworld", exist_ok=True)
os.makedirs("frontend/public/assets/storyworld/characters", exist_ok=True)

# 1. Fetch remaining Fluent 3D Emojis
fluent_assets = {
    "tree1": "Evergreen tree/3D/evergreen_tree_3d.png",
    "present": "Wrapped gift/3D/wrapped_gift_3d.png",
}

base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

for name, path in fluent_assets.items():
    encoded_path = urllib.parse.quote(path)
    url = f"{base_url}{encoded_path}"
    out_file = f"frontend/public/assets/storyworld/{name}.png"
    print(f"Downloading {name} from {url}...")
    try:
        urllib.request.urlretrieve(url, out_file)
        print(f"  Success: {name}")
    except Exception as e:
        print(f"  Failed: {name} - {e}")

# 2. Fetch diverse child characters from DiceBear Micah
characters = {
    "maya": "seed=Maya&baseColor=f9c9b6",
    "aarav": "seed=Aarav&baseColor=8d5524",
    "riya": "seed=Riya&baseColor=c68642",
    "kabir": "seed=Kabir&baseColor=e0ac69"
}

dicebear_base = "https://api.dicebear.com/9.x/micah/svg?"

for name, params in characters.items():
    emotions = {
        "neutral": "&mouth=smirk",
        "happy": "&mouth=smile,laughing",
        "sad": "&mouth=sad,nervous",
        "surprised": "&mouth=surprised,pucker"
    }
    
    for emotion, em_params in emotions.items():
        url = f"{dicebear_base}{params}{em_params}&backgroundColor=transparent"
        out_file = f"frontend/public/assets/storyworld/characters/{name}_{emotion}.svg"
        print(f"Downloading {name} ({emotion}) from {url}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                with open(out_file, 'wb') as f:
                    f.write(response.read())
            print(f"  Success: {name} ({emotion})")
        except Exception as e:
            print(f"  Failed: {name} ({emotion}) - {e}")

print("Done!")
