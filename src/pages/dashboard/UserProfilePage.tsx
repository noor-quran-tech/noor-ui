import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { SessionStatus } from "@utils/types/session";

import axiosAPI from "@lib/axios";
import { Role } from "@utils/types/user";
import UserIdentityCard from "@components/dashboard/user-management/profile/UserIdentityCard";
import UserDetailsCard from "@components/dashboard/user-management/profile/UserDetailsCard";

export interface UserProfileData {
  id: string;
  country: string;
  city: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  bio?: string | null;
  phoneNumber: string;
  dateOfBirth?: string;
  yearsOfExperience?: number;
  languages?: string[];
  teachingLevels?: string[];
  level?: string;
  verificationStatus: string;
  isApproved: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    role: string;
    isActive: boolean;
  };
  parent?: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
  } | null;
}

export interface SessionData {
  id: string;
  title: string;
  status: SessionStatus;
  startTime: string;
  externalLink?: string | null;
  subject?: {
    name: string;
  };
}

const statusStyles: Record<string, string> = {
  SCHEDULED: "bg-teal-50 text-teal-700",
  COMPLETED: "bg-success-bg text-success",
  CANCELLED: "bg-error-bg text-error",
  MISSED: "bg-warning-bg text-warning",
  RUNNING: "bg-neutral-bg text-neutral",
};

const getStatusStyle = (status: string) =>
  statusStyles[status?.toLowerCase()] || "bg-neutral-100 text-neutral-600";

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserProfilePage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const role = pathname.includes("/students") ? Role.STUDENT : Role.TEACHER;
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      const profileEndpoint =
        role === Role.STUDENT ? `students/${id}` : `teachers/${id}`;
      const sessionsEndpoint =
        role === Role.STUDENT
          ? `students/${id}/sessions`
          : `teachers/${id}/sessions`;

      const [profileRes, sessionsRes] = await Promise.allSettled([
        axiosAPI.get(profileEndpoint),
        axiosAPI.get(sessionsEndpoint),
      ]);

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.data.data);
      } else {
        toast.error(t("dashboard.userProfile.errors.profileLoadFailed"));
      }

      if (sessionsRes.status === "fulfilled") {
        setSessions(sessionsRes.value.data.data || []);
      } else {
        toast.error(t("dashboard.userProfile.errors.sessionsLoadFailed"));
      }

      setLoading(false);
    }

    fetchData();
  }, [id, role, t]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse p-6">
        <div className="h-6 w-32 bg-neutral-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-white border border-neutral-100 rounded-2xl" />
          <div className="md:col-span-2 h-96 bg-white border border-neutral-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer mb-6"
        >
          <span className="rtl:rotate-180">←</span>{" "}
          {t("dashboard.userProfile.backToDashboard")}
        </button>
        <div className="p-12 text-center bg-white border border-neutral-100 rounded-2xl shadow-xs">
          <div className="w-12 h-12 bg-error-bg text-error rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            {t("dashboard.userProfile.notFound.title")}
          </h3>
          <p className="text-neutral-500 text-xs">
            {t("dashboard.userProfile.notFound.description")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content max-w-6xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer -ml-3"
      >
        <span className="rtl:rotate-180">←</span>{" "}
        {t("dashboard.userProfile.backToDashboard")}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ---------------- LEFT: Identity card ---------------- */}

        <UserIdentityCard profile={profile} formatDate={formatDate} />

        {/* ---------------- RIGHT: Details + Sessions ---------------- */}

        <UserDetailsCard
          profile={profile}
          sessions={sessions}
          formatDateTime={formatDateTime}
          getStatusStyle={getStatusStyle}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
