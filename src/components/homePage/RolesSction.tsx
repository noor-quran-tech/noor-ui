import i18n from "@/i18n";
import RolesCard from "@components/homePage/RolesCard";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const RolesSction = () => {
  const { t } = useTranslation();

  const roles = [
    {
      icon: "🎓",
      title: t("home.rolesSection.roles.students.title"),
      description: t("home.rolesSection.roles.students.description"),
      features: [
        t("home.rolesSection.roles.students.features.browse"),
        t("home.rolesSection.roles.students.features.track"),
        t("home.rolesSection.roles.students.features.feedback"),
        t("home.rolesSection.roles.students.features.reports"),
      ],
    },
    {
      icon: "✏️",
      title: t("home.rolesSection.roles.teachers.title"),
      description: t("home.rolesSection.roles.teachers.description"),
      features: [
        t("home.rolesSection.roles.teachers.features.availability"),
        t("home.rolesSection.roles.teachers.features.subjects"),
        t("home.rolesSection.roles.teachers.features.feedback"),
        t("home.rolesSection.roles.teachers.features.reputation"),
      ],
    },
  ];

  const isArabic = i18n.language === "ar";

  return (
    <div>
      {/* ROLES */}
      <section
        className="mx-auto max-w-7xl px-6 py-24 lg:px-12"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
            {t("home.rolesSection.badge")}
          </p>

          <h2 className="max-w-2xl text-4xl font-black leading-tight text-teal-900">
            {t("home.rolesSection.titlePrefix")}
            <span className="text-gold-500">
              {t("home.rolesSection.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        {/* Animated Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
            >
              <RolesCard role={role} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RolesSction;
