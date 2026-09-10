import urllib.request
import urllib.parse
import os

os.makedirs("frontend/public/assets/movie", exist_ok=True)

fluent_assets = {
    "chair": "Chair/3D/chair_3d.png",
    "ball": "Soccer ball/3D/soccer_ball_3d.png",
    "bed": "Bed/3D/bed_3d.png",
    "tree": "Deciduous tree/3D/deciduous_tree_3d.png",
    "house": "House/3D/house_3d.png",
    "flower": "Cherry blossom/3D/cherry_blossom_3d.png",
    "toy": "Teddy bear/3D/teddy_bear_3d.png",
    "camera": "Movie camera/3D/movie_camera_3d.png",
    "mic": "Studio microphone/3D/studio_microphone_3d.png",
    "clapper": "Clapper board/3D/clapper_board_3d.png",
    "star": "Star/3D/star_3d.png",
    "light": "Light bulb/3D/light_bulb_3d.png",
    "girl": "Girl/3D/girl_3d.png",
    "boy": "Boy/3D/boy_3d.png"
}

base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

for name, path in fluent_assets.items():
    encoded_parts = [urllib.parse.quote(p) for p in path.split('/')]
    encoded_path = '/'.join(encoded_parts)
    
    url = f"{base_url}{encoded_path}"
    out_file = f"frontend/public/assets/movie/{name}.png"
    print(f"Downloading {name} from {url}...")
    try:
        urllib.request.urlretrieve(url, out_file)
        print(f"  Success: {name}")
    except Exception as e:
        print(f"  Failed: {name} - {e}")

print("Done!")
