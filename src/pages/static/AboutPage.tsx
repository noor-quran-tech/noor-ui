import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CurriculumCard, {
  type Curriculum,
} from "@components/aboutPage/CurriculumCard";
import LeadershipCard, {
  type TeamMember,
} from "@components/aboutPage/LeadershipCard";
import RulesCard, { type Rule } from "@components/aboutPage/RulesCard";
import StatsCard, { type StatItem } from "@components/aboutPage/StatsCard";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const stats: StatItem[] = [
    { value: "500+", label: t("about.stats.certifiedTeachers") },
    { value: "50,000+", label: t("about.stats.globalStudents") },
    { value: "80+", label: t("about.stats.nationalities") },
    { value: "5", label: t("about.stats.supportedLanguages") },
  ];

  // Management roles aligned with Noor Platform Organizational Hierarchy Sec 7.1 / 7.2
  const leadership: TeamMember[] = [
    {
      name: "Mohamed Aboelmoniem",
      role: "CEO & COO",
      bio: t("about.leadership.mohamed.bio"),
      initials: "MA",
    },
    {
      name: "Al-Hassan Ali",
      role: "CTO & Software Engineer",
      bio: t("about.leadership.alHassan.bio"),
      initials: "AA",
    },
  ];

  const curriculum: Curriculum[] = [
    {
      title: t("about.curriculum.recitationTitle"),
      description: t("about.curriculum.recitationDesc"),
    },
    {
      title: t("about.curriculum.hifzTitle"),
      description: t("about.curriculum.hifzDesc"),
    },
    {
      title: t("about.curriculum.arabicTitle"),
      description: t("about.curriculum.arabicDesc"),
    },
    {
      title: t("about.curriculum.understandingTitle"),
      description: t("about.curriculum.understandingDesc"),
    },
  ];

  const rules: Rule[] = [
    {
      title1: t("about.rules.academicAuthTitle1"),
      title2: t("about.rules.academicAuthTitle2"),
      description: t("about.rules.academicAuthDesc"),
    },
    {
      title1: t("about.rules.familyFirstTitle1"),
      title2: t("about.rules.familyFirstTitle2"),
      description: t("about.rules.familyFirstDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Quranic Header Inscription */}

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-16 md:pt-24 md:pb-20 max-w-7xl mx-auto border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {t("about.badge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              {t("about.heroTitle")}{" "}
              <span className="text-teal-600">
                {t("about.heroTitleHighlight")}
              </span>{" "}
              {t("about.heroTitleEnd")}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-slate-600 text-base leading-relaxed">
              {t("about.heroDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Platform Specification Metrics Section */}
      <section className="bg-white border-b border-slate-200 px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatsCard stat={stat} key={stat.value} />
          ))}
        </div>
      </section>

      {/* Educational Tracks Framework */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {t("about.curriculum.sectionTitle")}
          </h2>
          <p className="text-slate-600">
            {t("about.curriculum.sectionDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {curriculum.map((item) => (
            <CurriculumCard curriculum={item} key={item.title} />
          ))}
        </div>
      </section>

      {/* Safety & Quality Assurance Philosophies */}
      <section className="bg-slate-100 border-t border-slate-200 px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t("about.rules.sectionTitle")}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("about.rules.sectionDesc")}
            </p>
          </div>

          {rules.map((rule) => (
            <RulesCard rule={rule} key={rule.title1} />
          ))}
        </div>
      </section>

      {/* Operational Leadership Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {t("about.management.title")}
          </h2>
          <p className="text-sm text-slate-600">
            {t("about.management.description")}
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
          {t("about.supportedInterfaces")}
        </p>
      </section>

      {/* Final Call to Action */}
      <section className="px-6 py-16 md:py-20 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {t("about.cta.title")}
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">
          {t("about.cta.description")}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 font-semibold text-white rounded-lg shadow-md transition duration-150"
          >
            {t("about.cta.startNow")}
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm transition duration-150"
          >
            {t("about.cta.contactSupport")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
