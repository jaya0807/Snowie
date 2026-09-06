class ScoringEngine:
    @staticmethod
    def calculate_multi_step_accuracy(correct_steps, total_steps):
        """
        accuracy = correct steps / total steps
        This is task performance, not a clinical score.
        """
        if total_steps <= 0:
            return 0.0
        return correct_steps / total_steps

    @staticmethod
    def calculate_binary_accuracy(is_correct):
        return 1.0 if is_correct else 0.0

    @staticmethod
    def evaluate_pose_accuracy(expected_pose, detected_pose):
        # Coarse pose-state matching
        # This is a stub for the actual comparison logic
        return 1.0 # Perfect match
