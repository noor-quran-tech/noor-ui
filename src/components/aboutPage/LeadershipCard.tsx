export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}
export default function LeadershipCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-teal-950 text-teal-400 font-mono text-sm font-bold flex items-center justify-center">
          {member.initials}
        </div>
        <div className="space-y-0.5">
          <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
            {member.role}
          </p>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
          {member.bio}
        </p>
      </div>
    </div>
  );
}
