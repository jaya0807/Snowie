
const LEVELS = [
  {
    id: "moon",
    name: "Moon",
    color: "from-slate-700 to-slate-900",
    choicesCount: 3,
    target: "rocket",
    distractors: ["moon", "star", "comet"],
    feedbackPos: "Great job, Space Explorer! 🌙",
    feedbackNeg: "Almost! Try again! 🚀"
  },
  {
    id: "mars",
    name: "Mars",
    color: "from-red-900 to-orange-900",
    choicesCount: 5,
    target: "rocket",
    distractors: ["planet_ringed", "star", "moon", "comet", "satellite", "ufo", "alien"],
    feedbackPos: "Amazing! You found it on Mars! 🔴",
    feedbackNeg: "Keep looking, Explorer! 🚀"
  },
  {
    id: "galaxy",
    name: "Galaxy",
    color: "from-indigo-900 via-purple-900 to-black",
    choicesCount: 8,
    target: "rocket",
    distractors: ["planet_ringed", "star", "moon", "comet", "satellite", "ufo", "alien", "sparkles", "galaxy"],
    feedbackPos: "Incredible! You conquered the Galaxy! 🌌",
    feedbackNeg: "It's tricky out here, try again! 🚀"
  }
];


export { LEVELS };
