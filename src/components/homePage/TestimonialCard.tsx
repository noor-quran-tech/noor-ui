interface ItemType {
  name: string;
  role: string;
  text: string;
}

function TestimonialCard({ item }: { item: ItemType }) {
  return (
    <div
      key={item.name}
      className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm"
    >
      <div className="mb-6 text-5xl font-black text-gold-300">“</div>

      <p className="leading-8 text-neutral-600">{item.text}</p>

      <div className="mt-8">
        <h4 className="font-bold text-teal-900">{item.name}</h4>

        <p className="mt-1 text-sm text-neutral-500">{item.role}</p>
      </div>
    </div>
  );
}
export default TestimonialCard;
