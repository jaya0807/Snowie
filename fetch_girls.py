import urllib.request
import urllib.parse
import os

os.makedirs("frontend/public/assets/storyworld/characters", exist_ok=True)

# 2. Fetch diverse child characters from DiceBear Micah
characters = {
    "maya": "seed=Sophia&baseColor=f9c9b6&hair=full",
    "riya": "seed=Jasmine&baseColor=c68642&hair=full"
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
