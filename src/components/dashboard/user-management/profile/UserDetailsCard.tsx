import { useTranslation } from "react-i18next";
import type {
  SessionData,
  UserProfileData,
} from "@pages/dashboard/UserProfilePage";

interface UserDetailsCardProps {
  profile: UserProfileData | null;
  sessions: SessionData[];
  formatDateTime: (value: string) => string;
  getStatusStyle: (status: string) => string;
}

const UserDetailsCard = ({
  profile,
  sessions,
  formatDateTime,
  getStatusStyle,
}: UserDetailsCardProps) => {
  const { t } = useTranslation();

  return (
    <section className="md:col-span-2 space-y-6">
      {/* Bio / about */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-6">
        <h2 className="text-sm font-bold text-neutral-900 mb-3">
          {t("dashboard.userProfile.detailsCard.about.title")}
        </h2>
        {profile?.bio ? (
          <p className="text-sm text-neutral-700 leading-relaxed">
            {profile?.bio}
          </p>
        ) : (
          <p className="text-sm text-neutral-400 italic">
            {t("dashboard.userProfile.detailsCard.about.emptyBio")}
          </p>
        )}

        {profile?.languages?.length || profile?.teachingLevels?.length ? (
          <div className="mt-5 space-y-4">
            {profile?.languages && profile?.languages.length > 0 && (
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                  {t("dashboard.userProfile.detailsCard.about.languages")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.languages.map((lang: string) => (
                    <span
                      key={lang}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.teachingLevels && profile?.teachingLevels.length > 0 && (
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                  {t("dashboard.userProfile.detailsCard.about.teachingLevels")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.teachingLevels.map((level) => (
                    <span
                      key={level}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold-50 text-gold-700"
                    >
                      {t(`levels.${level.toLowerCase()}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Sessions */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-neutral-900">
            {t("dashboard.userProfile.detailsCard.sessions.title")}
          </h2>
          <span className="text-[11px] font-semibold text-neutral-400">
            {t("dashboard.userProfile.detailsCard.sessions.total", {
              count: sessions.length,
            })}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-10 h-10 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-3 text-base font-bold">
              ·
            </div>
            <p className="text-sm font-semibold text-neutral-700">
              {t("dashboard.userProfile.detailsCard.sessions.emptyTitle")}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {t("dashboard.userProfile.detailsCard.sessions.emptyDescription")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {session.subject?.name ? `${session.subject.name} · ` : ""}
                    {formatDateTime(session.startTime)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getStatusStyle(
                      session.status,
                    )}`}
                  >
                    {t(
                      `dashboard.userProfile.detailsCard.sessions.status.${session.status.toLowerCase()}`,
                      { defaultValue: session.status },
                    )}
                  </span>
                  {session.externalLink && (
                    <a
                      href={session.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      {t("dashboard.userProfile.detailsCard.sessions.join")}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default UserDetailsCard;
