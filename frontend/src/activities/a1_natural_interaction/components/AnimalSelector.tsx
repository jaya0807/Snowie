interface Props {
  favAnimal: string;
  setFavAnimal: (a: string) => void;
  nextStep: () => void;
}

export default function AnimalSelector({ favAnimal, setFavAnimal, nextStep }: Props) {
  const animals = [
    { emoji: "🐶", label: "Dog" },
    { emoji: "🐱", label: "Cat" },
    { emoji: "🐼", label: "Panda" },
    { emoji: "🦁", label: "Lion" },
    { emoji: "🐰", label: "Bunny" },
    { emoji: "🦋", label: "Butterfly" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {animals.map(a => (
        <button
          key={a.label}
          onClick={() => {
            setFavAnimal(a.label);
            setTimeout(nextStep, 1000);
          }}
          className={`flex flex-col items-center justify-center p-4 w-24 h-24 rounded-3xl border-4 transition-all duration-300 transform hover:scale-110 ${
            favAnimal === a.label ? 'border-brand bg-brand/10 scale-110' : 'border-transparent bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <span className="text-5xl drop-shadow-md">{a.emoji}</span>
          <span className="font-bold text-zinc-600 text-xs mt-2">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
