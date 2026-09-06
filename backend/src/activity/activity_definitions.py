# Activity Definitions A1 - A6

ACTIVITIES = {
    "A1": {
        "id": "A1",
        "name": "Natural Interaction / Warm-up",
        "domain": "baseline",
        "difficulty_levels": ["Low"],
        "instructions": "Robot/screen greets child and asks a simple question.",
        "stimulus_generator": "greet_and_ask",
        "expected_response": "verbal_or_attention",
        "scoring_rule": "baseline_only",
        "duration_limit": 60,
        "data_to_collect": ["response_latency", "interaction_duration", "head_orientation", "body_movement"]
    },
    "A2": {
        "id": "A2",
        "name": "Follow the Instruction",
        "domain": "instruction_following",
        "difficulty_levels": ["Low", "Medium", "High"],
        "instructions": "Child is asked to touch objects in sequence.",
        "stimulus_generator": "visual_prompt_sequence",
        "expected_response": "touch_sequence",
        "scoring_rule": "multi_step_accuracy",
        "duration_limit": 30,
        "data_to_collect": ["accuracy", "latency", "completion"]
    },
    "A3": {
        "id": "A3",
        "name": "Visual Target Finding",
        "domain": "target_selection",
        "difficulty_levels": ["Low", "Medium", "High"],
        "instructions": "Display known objects and ask the child to find a target.",
        "stimulus_generator": "distractor_grid",
        "expected_response": "target_selection",
        "scoring_rule": "binary_accuracy",
        "duration_limit": 45,
        "data_to_collect": ["target_response_time", "correctness", "head_orientation", "movement_events"]
    },
    "A4": {
        "id": "A4",
        "name": "Imitation",
        "domain": "action_imitation",
        "difficulty_levels": ["Low", "Medium"],
        "instructions": "Robot/screen demonstrates simple action and asks child to repeat.",
        "stimulus_generator": "action_demonstration",
        "expected_response": "pose_match",
        "scoring_rule": "pose_accuracy",
        "duration_limit": 30,
        "data_to_collect": ["response_latency", "action_completion", "left_right_correspondence"]
    },
    "A5": {
        "id": "A5",
        "name": "Emotion / Social Interaction",
        "domain": "social_emotional",
        "difficulty_levels": ["Low", "Medium"],
        "instructions": "Show a face/scene and ask the child to select an emotion.",
        "stimulus_generator": "emotion_scene",
        "expected_response": "emotion_selection",
        "scoring_rule": "binary_accuracy",
        "duration_limit": 30,
        "data_to_collect": ["task_correctness", "response_latency", "completion", "verbal_response"]
    },
    "A6": {
        "id": "A6",
        "name": "Controlled Challenge",
        "domain": "response_to_demand",
        "difficulty_levels": ["Medium", "High"],
        "instructions": "Keep task similar while increasing demand (e.g. speed).",
        "stimulus_generator": "speed_challenge",
        "expected_response": "sustained_attention",
        "scoring_rule": "tolerance_duration",
        "duration_limit": 120,
        "data_to_collect": ["response_time", "accuracy", "movement_events", "head_orientation", "abandonment", "help_requests"]
    }
}
