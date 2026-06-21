import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { SessionStatus } from "@utils/types/session";

import axiosAPI from "@lib/axios";
import { Role } from "@utils/types/user";

interface UserProfileData {
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

interface SessionData {
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
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserProfilePage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
        toast.error("Failed to load profile details.");
      }

      if (sessionsRes.status === "fulfilled") {
        setSessions(sessionsRes.value.data.data || []);
      } else {
        toast.error("Failed to load user sessions.");
      }

      setLoading(false);
    }

    fetchData();
  }, [id, role]);

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
          <span>←</span> Back to Dashboard
        </button>
        <div className="p-12 text-center bg-white border border-neutral-100 rounded-2xl shadow-xs">
          <div className="w-12 h-12 bg-error-bg text-error rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            No profile record located
          </h3>
          <p className="text-neutral-500 text-xs">
            Verify the workspace link or user parameters identifier.
          </p>
        </div>
      </div>
    );
  }

  const isStudent = profile.user.role === Role.STUDENT;
  const fullName = `${profile.user.firstName} ${profile.user.lastName}`;
  const initials = `${profile.user.firstName?.[0] ?? ""}${
    profile.user.lastName?.[0] ?? ""
  }`.toUpperCase();
  const addressParts = [
    profile.addressLine1,
    profile.addressLine2,
    profile.city,
    profile.country,
  ].filter(Boolean);

  return (
    <div className="main-content max-w-6xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer -ml-3"
      >
        <span>←</span> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ---------------- LEFT: Identity card ---------------- */}
        <aside className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-6 h-fit space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              {profile.user.profileImage ? (
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
                  profile.user.isActive ? "bg-success" : "bg-neutral-300"
                }`}
                title={profile.user.isActive ? "Active" : "Inactive"}
              />
            </div>

            <div>
              <h1 className="text-lg font-bold text-neutral-900">{fullName}</h1>
              <p className="text-xs text-neutral-500">{profile.user.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gold-50 text-gold-700">
                {isStudent ? "Student" : "Teacher"}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  profile.isApproved
                    ? "bg-success-bg text-success"
                    : "bg-warning-bg text-warning"
                }`}
              >
                {profile.isApproved ? "Approved" : "Pending approval"}
              </span>
            </div>

            <span
              className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getStatusStyle(
                profile.verificationStatus,
              )}`}
            >
              {profile.verificationStatus}
            </span>
          </div>

          <hr className="border-neutral-100" />

          {/* Quick facts */}
          <dl className="space-y-3 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Phone</dt>
              <dd className="text-neutral-900 font-medium text-right">
                {profile.phoneNumber || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Location</dt>
              <dd className="text-neutral-900 font-medium text-right">
                {profile.city}, {profile.country}
              </dd>
            </div>
            {profile.dateOfBirth && (
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Date of birth</dt>
                <dd className="text-neutral-900 font-medium text-right">
                  {formatDate(profile.dateOfBirth)}
                </dd>
              </div>
            )}
            {!isStudent && profile.yearsOfExperience !== undefined && (
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Experience</dt>
                <dd className="text-neutral-900 font-medium text-right">
                  {profile.yearsOfExperience} yrs
                </dd>
              </div>
            )}
            {isStudent && profile.level && (
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Level</dt>
                <dd className="text-neutral-900 font-medium text-right">
                  {profile.level}
                </dd>
              </div>
            )}
          </dl>

          {addressParts.length > 0 && (
            <>
              <hr className="border-neutral-100" />
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">
                  Address
                </h3>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {addressParts.join(", ")}
                </p>
              </div>
            </>
          )}

          {profile.parent && (
            <>
              <hr className="border-neutral-100" />
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                  Parent / Guardian
                </h3>
                <p className="text-xs font-semibold text-neutral-900">
                  {profile.parent.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {profile.parent.email}
                </p>
                <p className="text-xs text-neutral-500">
                  {profile.parent.phoneNumber}
                </p>
              </div>
            </>
          )}
        </aside>

        {/* ---------------- RIGHT: Details + Sessions ---------------- */}
        <section className="md:col-span-2 space-y-6">
          {/* Bio / about */}
          <div className="bg-white border border-neutral-100 rounded-2xl shadow-xs p-6">
            <h2 className="text-sm font-bold text-neutral-900 mb-3">About</h2>
            {profile.bio ? (
              <p className="text-sm text-neutral-700 leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <p className="text-sm text-neutral-400 italic">
                No bio has been added yet.
              </p>
            )}

            {profile.languages?.length || profile.teachingLevels?.length ? (
              <div className="mt-5 space-y-4">
                {profile.languages && profile.languages.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang) => (
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

                {profile.teachingLevels &&
                  profile.teachingLevels.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                        Teaching levels
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.teachingLevels.map((level) => (
                          <span
                            key={level}
                            className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold-50 text-gold-700"
                          >
                            {level}
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
              <h2 className="text-sm font-bold text-neutral-900">Sessions</h2>
              <span className="text-[11px] font-semibold text-neutral-400">
                {sessions.length} total
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-10 h-10 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-3 text-base font-bold">
                  ·
                </div>
                <p className="text-sm font-semibold text-neutral-700">
                  No sessions yet
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Sessions will appear here once scheduled.
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
                        {session.subject?.name
                          ? `${session.subject.name} · `
                          : ""}
                        {formatDateTime(session.startTime)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getStatusStyle(
                          session.status,
                        )}`}
                      >
                        {session.status}
                      </span>
                      {session.externalLink && (
                        <a
                          href={session.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
                        >
                          Join →
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfilePage;
