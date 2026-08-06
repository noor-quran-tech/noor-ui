import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function AppFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-neutral-100 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center lg:flex-row lg:px-12">
        <Link to="/" className="text-2xl font-black text-gold-400">
          {t("footer.brand")}
        </Link>

        <div className="flex items-center gap-8 text-sm text-neutral-500">
          <Link to="about">{t("footer.about")}</Link>
          <Link to="contact">{t("footer.contact")}</Link>
        </div>

        <p className="text-sm text-neutral-400">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
export default AppFooter;
