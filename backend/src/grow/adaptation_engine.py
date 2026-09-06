class AdaptationEngine:
    """
    Adapts next activity based on transparent rules.
    """
    @staticmethod
    def adapt_difficulty(current_difficulty, performance_history):
        """
        Example rule: consistently strong performance -> increase complexity; 
        sharp drop -> maintain or reduce complexity.
        """
        if not performance_history:
            return current_difficulty
            
        latest = performance_history[-1]
        accuracy = latest.get("accuracy", 0.0)
        
        difficulties = ["Low", "Medium", "High"]
        
        try:
            curr_idx = difficulties.index(current_difficulty)
        except ValueError:
            return current_difficulty

        if accuracy > 0.8:
            # Increase complexity
            return difficulties[min(len(difficulties)-1, curr_idx + 1)]
        elif accuracy < 0.3:
            # Reduce complexity
            return difficulties[max(0, curr_idx - 1)]
            
        return current_difficulty
