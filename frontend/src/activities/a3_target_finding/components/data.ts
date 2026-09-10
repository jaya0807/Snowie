import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { 
  GiPirateCaptain, GiGalleon, GiPalmTree, GiIsland, 
  GiTreasureMap, GiKey, GiCoins, GiCompass, 
  GiGemPendant, GiDiamondRing, GiStarMedal, GiScallop,
  GiSwapBag, GiPirateHat
} from "react-icons/gi";
import { FaCloud } from "react-icons/fa";

// Speak utility using Web Speech API
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1; // Piratey pitch
    window.speechSynthesis.speak(utterance);
  }
};


type TreasureObject = {
  id: string;
  type: string;
  color: string;
  icon: any;
};

// Task Bank Pool
const TASKS = [
  {
    level: 1,
    instruction: "Can you find the GOLD COIN?",
    target: "gold_coin",
    objects: [
      { id: "gold_coin", type: "coin", color: "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]", icon: GiCoins },
      { id: "pirate_hat", type: "hat", color: "text-gray-800", icon: GiPirateHat },
      { id: "shell", type: "shell", color: "text-pink-300", icon: GiScallop },
      { id: "compass", type: "compass", color: "text-orange-400", icon: GiCompass }
    ]
  },
  {
    level: 2,
    instruction: "Can you find the TREASURE PURSE?",
    target: "treasure_purse",
    objects: [
      { id: "treasure_purse", type: "purse", color: "text-amber-700", icon: GiSwapBag },
      { id: "pirate_hat", type: "hat", color: "text-gray-800", icon: GiPirateHat },
      { id: "gold_coin", type: "coin", color: "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]", icon: GiCoins },
      { id: "compass", type: "compass", color: "text-orange-400", icon: GiCompass },
      { id: "shell", type: "shell", color: "text-pink-300", icon: GiScallop },
      { id: "key", type: "key", color: "text-yellow-500", icon: GiKey },
      { id: "gem", type: "gem", color: "text-blue-500", icon: GiGemPendant },
      { id: "map", type: "map", color: "text-yellow-100", icon: GiTreasureMap }
    ]
  },
  {
    level: 3,
    instruction: "Look closely! Can you find the MAGICAL GEM?",
    target: "gem",
    objects: [
      { id: "gold_coin", type: "coin", color: "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]", icon: GiCoins },
      { id: "silver_coin", type: "coin", color: "text-gray-400", icon: GiCoins },
      { id: "bronze_coin", type: "coin", color: "text-amber-800", icon: GiCoins },
      { id: "gold_key", type: "key", color: "text-yellow-400", icon: GiKey },
      { id: "treasure_purse", type: "purse", color: "text-amber-700", icon: GiSwapBag },
      { id: "pirate_hat", type: "hat", color: "text-gray-800", icon: GiPirateHat },
      { id: "gem", type: "gem", color: "text-blue-500", icon: GiGemPendant },
      { id: "compass", type: "compass", color: "text-orange-400", icon: GiCompass },
      { id: "shell", type: "shell", color: "text-pink-300", icon: GiScallop },
      { id: "map", type: "map", color: "text-yellow-100", icon: GiTreasureMap },
      { id: "ring", type: "ring", color: "text-red-400", icon: GiDiamondRing },
      { id: "star", type: "star", color: "text-yellow-300", icon: GiStarMedal }
    ]
  }
];


export { speak, TASKS };
