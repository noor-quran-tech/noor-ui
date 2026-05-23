interface Role {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export default function RolesCard({ role }: { role: Role }) {
  return (
    <div
      key={role.title}
      className="group rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-teal-200 hover:shadow-2xl"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
        {role.icon}
      </div>

      <h3 className="text-2xl font-bold text-teal-900">{role.title}</h3>

      <p className="mt-4 leading-8 text-neutral-600">{role.description}</p>

      <ul className="mt-8 space-y-4">
        {role.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-neutral-700"
          >
            <div className="h-2 w-2 rounded-full bg-gold-400" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
