import { useTranslation } from "react-i18next";
import {
  Headphones,
  Award,
  GraduationCap,
  FileCheck,
  BookOpenCheck,
  BadgeDollarSign,
} from "lucide-react";

const WhyUsSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Headphones,
      title: t("home.whyUs.features.supportTitle"),
      description: t("home.whyUs.features.supportDesc"),
    },
    {
      icon: Award,
      title: t("home.whyUs.features.qualityTitle"),
      description: t("home.whyUs.features.qualityDesc"),
    },
    {
      icon: GraduationCap,
      title: t("home.whyUs.features.teachersTitle"),
      description: t("home.whyUs.features.teachersDesc"),
    },
    {
      icon: FileCheck,
      title: t("home.whyUs.features.reportsTitle"),
      description: t("home.whyUs.features.reportsDesc"),
    },
    {
      icon: BookOpenCheck,
      title: t("home.whyUs.features.facilitiesTitle"),
      description: t("home.whyUs.features.facilitiesDesc"),
    },
    {
      icon: BadgeDollarSign,
      title: t("home.whyUs.features.guaranteeTitle"),
      description: t("home.whyUs.features.guaranteeDesc"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 px-4 sm:px-6 lg:px-8 text-neutral-800">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADER */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-teal-900 sm:text-5xl">
            {t("home.whyUs.badge")}
          </h2>

          <h3 className="mt-3 text-lg font-bold text-teal-500 sm:text-xl">
            {t("home.whyUs.title")}
          </h3>

          <p className="mt-1 text-sm font-semibold text-teal-600 sm:text-base">
            {t("home.whyUs.subtitle")}
          </p>

          {/* Gold Decorative Divider */}
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal-400" />

          {/* Description */}
          <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t("home.whyUs.description")}
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center animate-fade-in"
              >
                {/* Icon Container */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-teal-500 shadow-sm transition-transform duration-300 hover:scale-105">
                  <IconComponent className="h-8 w-8 stroke-[1.75]" />
                </div>

                {/* Title */}
                <h4 className="text-xl font-bold text-neutral-900">
                  {feature.title}
                </h4>

                {/* Body Text */}
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
