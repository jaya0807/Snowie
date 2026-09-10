import sys
sys.path.append('.')
from src.perception_pipeline import PerceptionPipeline

p = PerceptionPipeline()

# Mock pose data where hands are raised high above the head
# Y = 0.0 is top, 1.0 is bottom.
# Nose is at 0.5 (middle).
# Wrists are at 0.2 (above nose).
mock_pose = {
    "nose": [0.5, 0.5, 0.9],
    "left_wrist": [0.3, 0.2, 0.8],
    "right_wrist": [0.7, 0.2, 0.8],
    "left_shoulder": [0.4, 0.6, 0.9],
    "right_shoulder": [0.6, 0.6, 0.9]
}

print("Testing RAISE_ONE_HAND:")
print(p._validate_pose(mock_pose, "RAISE_ONE_HAND"))

print("Testing RAISE_BOTH_HANDS:")
print(p._validate_pose(mock_pose, "RAISE_BOTH_HANDS"))

# Mock clap: Wrists close to each other
mock_clap = {
    "nose": [0.5, 0.2, 0.9],
    "left_wrist": [0.5, 0.5, 0.8],
    "right_wrist": [0.55, 0.5, 0.8],
    "left_shoulder": [0.4, 0.3, 0.9],
    "right_shoulder": [0.6, 0.3, 0.9]
}
print("Testing CLAP:")
print(p._validate_pose(mock_clap, "CLAP"))

# Mock touch head: wrists near nose
mock_head = {
    "nose": [0.5, 0.2, 0.9],
    "left_wrist": [0.45, 0.22, 0.8],
    "right_wrist": [0.55, 0.22, 0.8],
    "left_shoulder": [0.4, 0.5, 0.9],
    "right_shoulder": [0.6, 0.5, 0.9]
}
print("Testing TOUCH_HEAD:")
print(p._validate_pose(mock_head, "TOUCH_HEAD"))

# Mock touch shoulders: wrists near shoulders
mock_shoulders = {
    "nose": [0.5, 0.2, 0.9],
    "left_wrist": [0.4, 0.5, 0.8],
    "right_wrist": [0.6, 0.5, 0.8],
    "left_shoulder": [0.4, 0.5, 0.9],
    "right_shoulder": [0.6, 0.5, 0.9]
}
print("Testing TOUCH_SHOULDERS:")
print(p._validate_pose(mock_shoulders, "TOUCH_SHOULDERS"))
