import StatsCard from "@components/aboutPage/StatsCard";
import { Link } from "react-router-dom";
import backgroundImage from "@assets/images/background.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const stats = [
    { value: "2.4K+", label: t("home.hero.stats.activeStudents") },
    { value: "380+", label: t("home.hero.stats.verifiedTeachers") },
    { value: "96%", label: t("home.hero.stats.satisfactionRate") },
  ];

  return (
    <section className="relative overflow-hidden border-b border-neutral-100 bg-neutral-900">
      {/* Background Image & Overlay */}
      <img
        src={backgroundImage}
        alt="Hero Background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* <div className="absolute inset-0 bg-neutral-950/75 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-transparent" /> */}

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12">
        {/* LEFT / CONTENT */}
        <div className="animate-fade-in text-center lg:text-left rtl:lg:text-right">
          {/* Aya / Quote Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-md">
            <span
              className={`font-serif  ${isArabic ? "text-2xl font-bold" : "text-sm font-bold"}`}
            >
              {t("home.hero.quranVerse")}
            </span>
            <span className="text-[10px] opacity-70">
              {t("home.hero.verseReference")}
            </span>
          </div>

          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:mx-0 lg:text-6xl">
            {isArabic ? (
              <>
                {t("home.hero.titlePrefix")}
                <span className="text-teal-400">
                  {t("home.hero.titleHighlight1")}
                </span>
                <br />
                {t("home.hero.titleSuffix")}
                <span className="text-gold-400">
                  {t("home.hero.titleHighlight2")}
                </span>
              </>
            ) : (
              <>
                {t("home.hero.titlePrefix")}
                <span className="text-teal-400">
                  {t("home.hero.titleHighlight1")}
                </span>
                <br />
                {t("home.hero.titleMiddle")}
                <br />
                <span className="text-gold-400">
                  {t("home.hero.titleHighlight2")}
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg lg:mx-0 lg:leading-8">
            {t("home.hero.description")}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <Link
              to="/login/"
              className="rounded-full bg-teal-600 px-7 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-teal-500 no-underline"
            >
              {t("home.hero.startLearning")}
            </Link>

            <Link
              to="/signup/"
              className="rounded-full border border-neutral-300/30 bg-white/10 backdrop-blur-md px-7 py-4 text-center text-sm font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              {t("home.hero.teachOnNoor")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 text-white">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
