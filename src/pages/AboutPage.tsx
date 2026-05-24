import React from "react";
import { Link } from "react-router-dom";

import CurriculumCard, {
  type Curriculum,
} from "@components/aboutPage/CurriculumCard";
import LeadershipCard, {
  type TeamMember,
} from "@components/aboutPage/LeadershipCard";
import RulesCard, { type Rule } from "@components/aboutPage/RulesCard";
import StatsCard, { type StatItem } from "@components/aboutPage/StatsCard";

const stats: StatItem[] = [
  { value: "500+", label: "Certified Teachers" },
  { value: "50,000+", label: "Global Students" },
  { value: "80+", label: "Nationalities" },
  { value: "5", label: "Supported Languages" },
];

// Management roles aligned with Noor Platform Organizational Hierarchy Sec 7.1 / 7.2
const leadership: TeamMember[] = [
  {
    name: "Mohamed Aboelmoniem",
    role: "CEO & COO",
    bio: "Drives the platform's long-term strategic vision, annual objectives, and institutional growth. Directs day-to-day global operations, financial reporting, and the strict vetting frameworks governing certified Ijazah validation and oral admission testing.",
    initials: "MA",
  },
  {
    name: "Al-Hassan Ali",
    role: "CTO & Software Engineer",
    bio: "Architects the platform's technical core and virtual classroom features. Orchestrates real-time interactive audio/video engines, automated timezone-shifting calendars, and absolute infrastructure security complying strictly with global GDPR data protection standards.",
    initials: "AA",
  },
];

const curriculum: Curriculum[] = [
  {
    title: "1. Quran Recitation & Tajweed",
    description:
      "Master proper articulation points (Makharij), rules of NunSakinah, Madd, and rhythmic recitation styles from certifiedteachers.",
  },
  {
    title: "2. Memorization (Hifz)",
    description:
      "Structured memorization schedules adapted to your individual capacity, complete with systemic review cycles and performance mapping.",
  },
  {
    title: "3. Classical Arabic & Grammar",
    description:
      "Comprehensive conversational fluency, vocabulary building, and syntax/morphology (Nahw & Sarf) to comprehend Arabic texts directly.",
  },
  {
    title: "4. Quranic Understanding",
    description:
      "Delve into the linguistic analysis of the Quranic text along with essential contextual commentary (Tafsir) to enrich daily practice.",
  },
];

const rules: Rule[] = [
  {
    title1: "Academic Authenticity",
    title2: "Strict Sanad & Ijazah Vetting",
    description:
      "Teachers must undergo strict authentication checks on credentials and an audio recitation assessment by our expert quality team prior to onboarding.",
  },
  {
    title1: "Family-First Environment",
    title2: "Comprehensive Guardian Control",
    description:
      "Parents have complete visibility via administrative dashboards to track class records, text messaging streams, and technical progress maps for minors under 16.",
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Quranic Header Inscription */}

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-16 md:pt-24 md:pb-20 max-w-7xl mx-auto border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              About Noor Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              The global reference for{" "}
              <span className="text-teal-600">Quranic Excelence</span> and
              Arabic learning.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-slate-600 text-base leading-relaxed">
              Noor Platform is a mission-driven ecosystem built to connect
              specialized, certified Muslim educators holding traditional
              authorizations (Ijazah) with eager students worldwide. We offer a
              safe, structured, and authentic environment that bridges classical
              Islamic scholarship with state-of-the-art virtual classroom
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Specification Metrics Section */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <StatsCard stat={stat} key={idx} />
          ))}
        </div>
      </section>

      {/* Educational Tracks Framework */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Our Core Curriculum Pathways
          </h2>
          <p className="text-slate-600">
            A precise, structured curriculum designed to take students from
            absolute zero foundational rules up to chains of transmission
            (Isnad) back to the Prophet (ﷺ).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {curriculum.map((curriculum, idx) => (
            <CurriculumCard curriculum={curriculum} key={idx} />
          ))}
        </div>
      </section>

      {/* Safety & Quality Assurance Philosophies */}
      <section className="bg-slate-100 border-t border-slate-200 px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Built on Safety & Authenticity
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Noor Platform operates under strict structural governance rules to
              protect both academic truth and the privacy of our global student
              body.
            </p>
          </div>

          {rules.map((rule, idx) => (
            <RulesCard rule={rule} key={idx} />
          ))}
        </div>
      </section>

      {/* Operational Leadership Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Platform Management
          </h2>
          <p className="text-sm text-slate-600">
            The core management team directing academic guidelines and tech
            deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadership.map((member, index) => (
            <LeadershipCard member={member} key={index} />
          ))}
        </div>
      </section>

      {/* Support for 5 Official Interface Languages */}
      <section className="bg-white border-t border-b border-slate-200 py-6 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Supported Interfaces: English • العربية • Français • اردو • Bahasa
          Melayu
        </p>
      </section>

      {/* Final Call to Action */}
      <section className="px-6 py-16 md:py-20 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Begin Your Journey to Excellence
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">
          Create a free account to browse verified teacher profiles, negotiate
          custom schedules, and attend an interactive trial session.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 font-semibold text-white rounded-lg shadow-md transition duration-150"
          >
            Start Your Journey Now
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm transition duration-150"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
