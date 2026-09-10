import urllib.request
import urllib.parse
import os

os.makedirs("frontend/public/assets/space", exist_ok=True)

fluent_assets = {
    "astronaut": "Woman astronaut/3D/woman_astronaut_3d.png",
    "rocket": "Rocket/3D/rocket_3d.png",
    "moon": "Crescent moon/3D/crescent_moon_3d.png",
    "full_moon": "Full moon/3D/full_moon_3d.png",
    "planet_ringed": "Ringed planet/3D/ringed_planet_3d.png",
    "earth": "Globe showing Americas/3D/globe_showing_americas_3d.png",
    "star": "Star/3D/star_3d.png",
    "comet": "Comet/3D/comet_3d.png",
    "galaxy": "Milky way/3D/milky_way_3d.png",
    "satellite": "Satellite/3D/satellite_3d.png",
    "alien": "Alien/3D/alien_3d.png",
    "ufo": "Flying saucer/3D/flying_saucer_3d.png",
    "sparkles": "Sparkles/3D/sparkles_3d.png"
}

base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

for name, path in fluent_assets.items():
    # Split path to handle encoded directories vs filenames
    parts = path.split('/')
    encoded_parts = [urllib.parse.quote(p) for p in parts]
    encoded_path = '/'.join(encoded_parts)
    
    url = f"{base_url}{encoded_path}"
    out_file = f"frontend/public/assets/space/{name}.png"
    print(f"Downloading {name} from {url}...")
    try:
        urllib.request.urlretrieve(url, out_file)
        print(f"  Success: {name}")
    except Exception as e:
        print(f"  Failed: {name} - {e}")

print("Done!")
