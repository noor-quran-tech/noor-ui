export interface Rule {
  title1: string;
  title2: string;
  description: string;
}

export default function RulesCard({ rule }: { rule: Rule }) {
  return (
    <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="font-bold text-teal-600 text-sm uppercase tracking-wider">
        {rule.title1}
      </div>
      <h4 className="text-base font-bold text-slate-900">{rule.title2}</h4>
      <p className="text-xs text-slate-600 leading-relaxed">
        {rule.description}
      </p>
    </div>
  );
}
