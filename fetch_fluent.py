import urllib.request
import urllib.parse
import os

assets = {
    "circus_tent": "Circus tent/3D/circus_tent_3d.png",
    "ferris_wheel": "Ferris wheel/3D/ferris_wheel_3d.png",
    "balloon": "Balloon/3D/balloon_3d.png",
    "cloud": "Cloud/3D/cloud_3d.png",
    "sparkles": "Sparkles/3D/sparkles_3d.png",
    "clown_face": "Clown face/3D/clown_face_3d.png",
    "gloves": "Gloves/3D/gloves_3d.png"
}

os.makedirs("frontend/public/assets/circus3d", exist_ok=True)
base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

for name, path in assets.items():
    # URL encode the path to handle spaces
    encoded_path = urllib.parse.quote(path)
    url = f"{base_url}{encoded_path}"
    out_file = f"frontend/public/assets/circus3d/{name}.png"
    print(f"Downloading {name} from {url}...")
    try:
        urllib.request.urlretrieve(url, out_file)
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
