class ScoringEngine:
    """Static scoring utilities for activity task performance."""

    @staticmethod
    def calculate_multi_step_accuracy(correct_steps: int, total_steps: int) -> float:
        """Returns ratio of correct to total steps."""
        if total_steps <= 0:
            return 0.0
        return round(correct_steps / total_steps, 4)

    @staticmethod
    def calculate_binary_accuracy(is_correct: bool) -> float:
        """Returns 1.0 for correct, 0.0 for incorrect."""
        return 1.0 if is_correct else 0.0

    @staticmethod
    def evaluate_pose_accuracy(expected_pose: str, detected_pose: str) -> float:
        """
        Compares expected and detected pose strings.
        Returns 1.0 for exact match, 0.0 for mismatch or missing data.
        """
        if not expected_pose or not detected_pose:
            return 0.0
        return 1.0 if str(expected_pose).strip().upper() == str(detected_pose).strip().upper() else 0.0
