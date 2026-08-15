import quran1 from "@assets/images/quran1.jpg";
import quran2 from "@assets/images/quran2.png";
import quran3 from "@assets/images/quran3.jpg";

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Interactive Live Classes",
      description:
        "Connect directly with expert teachers in real-time. Engage in dynamic discussions, ask questions instantly, and get feedback that accelerates your learning journey.",
      image: quran1,
      tag: "Interactive Learning",
    },
    {
      id: 2,
      title: "Personalized Study Plans",
      description:
        "Tailor your education to match your unique pace and goals. Track your weekly milestones, access custom resources, and master topics at your own convenience.",
      image: quran2,
      tag: "Flexible Schedule",
    },
    {
      id: 3,
      title: "Verified Expert Instructors",
      description:
        "Learn from certified educators with years of proven experience. Every tutor undergoes rigorous verification to guarantee top-tier instruction.",
      image: quran3,
      tag: "Top Educators",
    },
  ];

  return (
    <section className="bg-neutral-50 py-20 px-4 sm:px-6 lg:px-12 ">
      <div className="mx-auto max-w-7xl space-y-16 lg:space-y-24">
        {features.map((feature, index) => {
          const isEven = index % 2 === 1;

          return (
            <div
              key={feature.id}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${
                isEven ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Text Side */}
              <div className="w-full lg:w-1/2 text-center lg:text-left rtl:lg:text-right">
                <span className="inline-block rounded-full border border-gold-300 bg-gold-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
                  {feature.tag}
                </span>

                <h2 className="mt-4 text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
                  {feature.title}
                </h2>

                <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
                  {feature.description}
                </p>
              </div>

              {/* Image Side */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 shadow-xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto max-h-112.5 object-contain object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
