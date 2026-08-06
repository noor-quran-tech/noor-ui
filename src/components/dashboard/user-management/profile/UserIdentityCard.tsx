import { useTranslation } from "react-i18next";
import type { UserProfileData } from "@pages/dashboard/UserProfilePage";
import { Role } from "@utils/types/user";

interface UserIdentityCardProps {
  profile: UserProfileData | null;
  formatDate: (value?: string) => string;
}

const UserIdentityCard = ({ profile, formatDate }: UserIdentityCardProps) => {
  const { t } = useTranslation();

  const isStudent = profile?.user.role === Role.STUDENT;
  const fullName = `${profile?.user.firstName} ${profile?.user.lastName}`;
  const initials = `${profile?.user.firstName?.[0] ?? ""}${
    profile?.user.lastName?.[0] ?? ""
  }`.toUpperCase();
  const addressParts = [
    profile?.addressLine1,
    profile?.addressLine2,
    profile?.city,
    profile?.country,
  ].filter(Boolean);

  return (
    <aside className="bg-white border min-w-2xs border-neutral-100 rounded-2xl shadow-xs p-6 h-fit space-y-6">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          {profile?.user.profileImage ? (
            <img
              src={profile.user.profileImage}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-teal-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-bold border-2 border-teal-100">
              {initials || "?"}
            </div>
          )}
          <span
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
              profile?.user.isActive ? "bg-success" : "bg-neutral-300"
            }`}
            title={
              profile?.user.isActive
                ? t("dashboard.userProfile.identityCard.status.active")
                : t("dashboard.userProfile.identityCard.status.inactive")
            }
          />
        </div>

        <div>
          <h1 className="text-lg font-bold text-neutral-900">{fullName}</h1>
          <p className="text-xs text-neutral-500">{profile?.user.email}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gold-50 text-gold-700">
            {isStudent
              ? t("dashboard.userProfile.identityCard.roles.student")
              : t("dashboard.userProfile.identityCard.roles.teacher")}
          </span>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
              profile?.isApproved
                ? "bg-success-bg text-success"
                : "bg-warning-bg text-warning"
            }`}
          >
            {profile?.isApproved
              ? t("dashboard.userProfile.identityCard.approval.approved")
              : t("dashboard.userProfile.identityCard.approval.pending")}
          </span>
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
          {profile?.verificationStatus
            ? t(
                `dashboard.userProfile.identityCard.verification.${profile.verificationStatus}`,
                { defaultValue: profile.verificationStatus },
              )
            : "—"}
        </span>
      </div>

      <hr className="border-neutral-100" />

      {/* Quick facts */}
      <dl className="space-y-3 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">
            {t("dashboard.userProfile.identityCard.labels.phone")}
          </dt>
          <dd className="text-neutral-900 font-medium text-right rtl:text-left">
            {profile?.phoneNumber || "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">
            {t("dashboard.userProfile.identityCard.labels.location")}
          </dt>
          <dd className="text-neutral-900 font-medium text-right rtl:text-left">
            {profile?.city}, {profile?.country}
          </dd>
        </div>
        {profile?.dateOfBirth && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">
              {t("dashboard.userProfile.identityCard.labels.dateOfBirth")}
            </dt>
            <dd className="text-neutral-900 font-medium text-right rtl:text-left">
              {formatDate(profile?.dateOfBirth)}
            </dd>
          </div>
        )}
        {!isStudent && profile?.yearsOfExperience !== undefined && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">
              {t("dashboard.userProfile.identityCard.labels.experience")}
            </dt>
            <dd className="text-neutral-900 font-medium text-right rtl:text-left">
              {t("dashboard.userProfile.identityCard.labels.experienceValue", {
                years: profile?.yearsOfExperience,
              })}
            </dd>
          </div>
        )}
        {isStudent && profile?.level && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">
              {t("dashboard.userProfile.identityCard.labels.level")}
            </dt>
            <dd className="text-neutral-900 font-medium text-right rtl:text-left">
              {profile?.level}
            </dd>
          </div>
        )}
      </dl>

      {addressParts.length > 0 && (
        <>
          <hr className="border-neutral-100" />
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">
              {t("dashboard.userProfile.identityCard.labels.address")}
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {addressParts.join(", ")}
            </p>
          </div>
        </>
      )}

      {profile?.parent && (
        <>
          <hr className="border-neutral-100" />
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-2">
              {t("dashboard.userProfile.identityCard.labels.parentGuardian")}
            </h3>
            <p className="text-xs font-semibold text-neutral-900">
              {profile?.parent.name}
            </p>
            <p className="text-xs text-neutral-500">{profile?.parent.email}</p>
            <p className="text-xs text-neutral-500">
              {profile?.parent.phoneNumber}
            </p>
          </div>
        </>
      )}
    </aside>
  );
};

export default UserIdentityCard;
