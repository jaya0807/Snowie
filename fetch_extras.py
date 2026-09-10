import urllib.request
import urllib.parse
import os

os.makedirs("frontend/public/assets/circus3d", exist_ok=True)

# Download additional useful Fluent 3D assets we'll compose the scene from
extras = {
    "star": "Star/3D/star_3d.png",
    "party_popper": "Party popper/3D/party_popper_3d.png",
    "confetti_ball": "Confetti ball/3D/confetti_ball_3d.png",
    "sun": "Sun/3D/sun_3d.png",
    "rainbow": "Rainbow/3D/rainbow_3d.png",
    "trophy": "Trophy/3D/trophy_3d.png",
    "eyes": "Eyes/3D/eyes_3d.png",
    "red_heart": "Red heart/3D/red_heart_3d.png",
    "musical_note": "Musical note/3D/musical_note_3d.png",
}

base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

for name, path in extras.items():
    encoded_path = urllib.parse.quote(path)
    url = f"{base_url}{encoded_path}"
    out_file = f"frontend/public/assets/circus3d/{name}.png"
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, out_file)
        print(f"  OK: {name}")
    except Exception as e:
        print(f"  FAILED: {name} - {e}")

print("Done!")
