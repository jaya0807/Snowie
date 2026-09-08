interface Props {
  feeling: string;
  setFeeling: (f: string) => void;
  nextStep: () => void;
}

export default function FeelingSelector({ feeling, setFeeling, nextStep }: Props) {
  const feelings = [
    { emoji: "😊", label: "Happy" },
    { emoji: "🤩", label: "Excited" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😴", label: "Sleepy" },
    { emoji: "😟", label: "Not so good" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {feelings.map(f => (
        <button
          key={f.label}
          onClick={() => {
            setFeeling(f.label);
            setTimeout(nextStep, 1000); // Auto-advance after 1 sec
          }}
          className={`flex flex-col items-center justify-center p-4 rounded-3xl border-4 transition-all duration-300 transform hover:scale-110 ${
            feeling === f.label ? 'border-brand bg-brand/10 scale-110' : 'border-transparent bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <span className="text-5xl mb-2 drop-shadow-md">{f.emoji}</span>
          <span className="font-bold text-zinc-600 text-sm">{f.label}</span>
        </button>
      ))}
    </div>
  );
}
