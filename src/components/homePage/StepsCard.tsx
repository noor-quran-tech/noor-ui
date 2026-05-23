interface Step {
  number: string;
  title: string;
  description: string;
}

function StepsCard({ step }: { step: Step }) {
  return (
    <div
      key={step.number}
      className="rounded-[28px] border border-neutral-100 bg-neutral-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="mb-6 text-5xl font-black text-gold-200">
        {step.number}
      </div>

      <h3 className="text-xl font-bold text-teal-900">{step.title}</h3>

      <p className="mt-4 leading-7 text-neutral-600">{step.description}</p>
    </div>
  );
}

export default StepsCard;
