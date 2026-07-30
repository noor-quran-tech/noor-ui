import StatsCard from "@components/aboutPage/StatsCard";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "2.4K+", label: "Active Students" },
  { value: "380+", label: "Verified Teachers" },
  { value: "96%", label: "Satisfaction Rate" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-100 bg-linear-to-br from-neutral-50 via-teal-50 to-gold-50">
      {/* Background Blur */}
      <div className="absolute -right-32 -top-32 h-105 w-105 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold-200/30 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12">
        {/* LEFT */}
        <div className="relative z-10 animate-fade-in text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-teal-500" />
            <span className="relative inline-flex h-3 w-3 rounded-full animate-ping bg-teal-500" />
            Live Tutoring Platform
          </div>

          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight text-teal-900 sm:text-5xl lg:mx-0 lg:text-6xl">
            Where <span className="text-teal-600">knowledge</span>
            <br />
            meets the right
            <br />
            <span className="text-gold-500">teacher</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg lg:mx-0 lg:leading-8">
            Noor connects students with expert teachers through personalized
            sessions, intelligent matching, and meaningful feedback.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <Link
              to="/login/"
              className="rounded-full bg-teal-600 px-7 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-teal-700 no-underline"
            >
              Start Learning →
            </Link>

            <Link
              to="/signup/"
              className="rounded-full border border-teal-200 bg-white px-7 py-4 text-center text-sm font-semibold text-teal-600 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:text-teal-700"
            >
              Teach on Noor
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-neutral-200 pt-10">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} stat={stat} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative z-10 flex justify-center pt-4 sm:pt-0">
          {/* Floating container */}
          <div className="hidden items-center justify-center rounded-full bg-linear-to-br p-8 shadow-xl animate-float lg:flex sm:p-10">
            {/* Rotating icon */}
            <BookOpen
              size={110}
              className="text-teal-600 opacity-70 animate-spin-slow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
