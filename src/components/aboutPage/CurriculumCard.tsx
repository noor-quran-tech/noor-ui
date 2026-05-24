export interface Curriculum {
  title: string;
  description: string;
}

export default function CurriculumCard({
  curriculum,
}: {
  curriculum: Curriculum;
}) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
      <h3 className="text-md font-bold text-slate-900">{curriculum.title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        {curriculum.description}
      </p>
    </div>
  );
}
