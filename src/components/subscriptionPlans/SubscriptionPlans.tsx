import { Link } from "react-router-dom";

const plans = [
  {
    title: "Basic",
    description: "Essential tools to kickstart your learning journey.",
    price: 20,
    popular: false,
    features: [
      "Access to basic courses",
      "Standard community support",
      "Weekly progress updates",
      "Course completion certificates",
    ],
  },
  {
    title: "Pro",
    description: "Ideal for dedicated learners seeking comprehensive growth.",
    price: 30,
    popular: true,
    features: [
      "Access to all premium courses",
      "Priority 1-on-1 teacher support",
      "Interactive live Q&A sessions",
      "Custom learning milestones",
      "Downloadable offline resources",
    ],
  },
  {
    title: "Premium",
    description: "Ultimate experience with tailored 1-on-1 mentorship.",
    price: 45,
    popular: false,
    features: [
      "All Pro feature benefits",
      "Dedicated personal mentor",
      "Unlimited teacher bookings",
      "Career guidance sessions",
    ],
  },
];

const SubscriptionPlans = () => {
  return (
    <section className="bg-neutral-50 py-20 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-gold-300 bg-gold-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
            Flexible Pricing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            Subscription Plans
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Choose the perfect plan tailored to your educational goals. Upgrade,
            downgrade, or cancel anytime with complete flexibility.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;

            return (
              <div
                key={index}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  isPopular
                    ? "z-10 bg-white text-neutral-900 shadow-2xl lg:-translate-y-2 lg:scale-105 border-2 border-teal-500 ring-4 ring-teal-500/10"
                    : "bg-white text-neutral-900 shadow-lg border border-neutral-200 hover:border-teal-200"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-teal-500 to-teal-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-bold text-neutral-900`}>
                      {plan.title}
                    </h3>
                    {isPopular && (
                      <span className="rounded-full bg-gold-500/20 px-3 py-1 text-sm font-semibold text-gold-300">
                        Best Value
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-3 text-sm leading-relaxed text-neutral-600`}
                  >
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                      ${plan.price}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isPopular ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      / month
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className={`my-8 h-px ${
                      isPopular ? "bg-neutral-800" : "bg-neutral-100"
                    }`}
                  />

                  {/* Feature List */}
                  <ul className="space-y-4 text-sm">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <svg
                          className={`h-5 w-5 shrink-0 ${
                            isPopular ? "text-teal-400" : "text-teal-600"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Button */}
                <div className="mt-8">
                  <Link to="/login">
                    <button
                      className={`w-full cursor-pointer rounded-full py-3.5 px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                        isPopular
                          ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25 hover:bg-teal-400"
                          : "bg-neutral-900 text-white hover:bg-teal-600"
                      }`}
                    >
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
