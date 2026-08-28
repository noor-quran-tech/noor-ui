import { Link } from "react-router-dom";

import "@styles/homepage.css";

import Footer from "@components/main/AppFooter";
import StepsCard from "@components/homePage/StepsCard";
import WhyUsSection from "@components/homePage/WhyUsSection";
import TestimonialCard from "@components/homePage/TestimonialCard";
import FAQ from "@components/homePage/FAQ";
import HeroSection from "@components/homePage/HeroSection";
import { useTranslation } from "react-i18next";
import RolesSction from "@components/homePage/RolesSction";
import FeaturesSection from "@components/homePage/FeaturesSection";
import SubscriptionPlansHome from "@components/subscriptionPlans/SubscriptionPlansHome";

const steps = [
  {
    number: "01",
    title: "Create Account",
    description:
      "Register as a student or teacher and complete your profile within minutes.",
  },
  {
    number: "02",
    title: "Choose Subject",
    description:
      "Browse available subjects and submit requests based on your learning goals.",
  },
  {
    number: "03",
    title: "Get Matched",
    description:
      "We connect students with the most suitable teachers automatically.",
  },
  {
    number: "04",
    title: "Start Learning",
    description:
      "Join online sessions and track your academic improvement over time.",
  },
];

const testimonials = [
  {
    name: "Nour El-Din",
    role: "Student, Grade 10",
    text: "Noor helped me to memorize the quran in a simple way",
  },
  {
    name: "Dr. Amira Shalaby",
    role: "Arabic Teacher",
    text: "Managing sessions and communicating with students became incredibly smooth.",
  },
  {
    name: "Sheikh Mohamed Fathy",
    role: "Quran Teacher",
    text: "Teaching online through Noor feels organized, professional, and comfortable.",
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen overflow-x-hidden text-neutral-900">
      {/* HERO */}
      <HeroSection />

      <WhyUsSection />

      <FeaturesSection />

      <RolesSction />

      {/* HOW IT WORKS */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-20">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
              How It Works
            </p>

            <h2 className="max-w-2xl text-4xl font-black leading-tight text-teal-900">
              Start learning in just a few simple steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, idx) => (
              <StepsCard key={idx} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <div className="mb-16">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
            Testimonials
          </p>

          <h2 className="text-4xl font-black text-teal-900">
            Loved by students & teachers
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <TestimonialCard item={item} key={idx} />
          ))}
        </div>
      </section>

      <SubscriptionPlansHome />
      <FAQ />

      {/* CTA */}
      <section className="p-6 pb-24 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-linear-to-r from-teal-800 via-teal-700 to-teal-600 px-8 py-20 shadow-2xl lg:px-16">
          <div className="absolute -right-20 -top-20 h-65 w-65 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div>
              <h2 className="max-w-2xl text-4xl font-black leading-tight text-white">
                {t("cta.title")}
              </h2>

              <p className="mt-5 max-w-xl text-lg text-teal-50">
                {t("cta.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10"
              >
                {t("cta.join")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
