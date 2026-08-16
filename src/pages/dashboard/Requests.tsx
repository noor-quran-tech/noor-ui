import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import type {
  ReviewStatus,
  StudentSubjectRequest,
  TeacherSubjectRequest,
} from "@utils/types/subject";
import type { TabPagination } from "@utils/types/public";
import type { RootState } from "@store/store";

import axiosAPI from "@lib/axios";
import { resolveApiErrorMessage } from "@lib/errorMessage";
import ReviewSubjectRequestModal, {
  type AuditingTarget,
} from "@components/dashboard/requests/ReviewSubjectRequestModal";
import HeaderComponent from "@components/dashboard/requests/HeaderComponent";
import TableComponent from "@components/dashboard/requests/TableComponent";
import { Role } from "@utils/types/user";

const ITEMS_PER_PAGE = 10;

const Requests = () => {
  const { t } = useTranslation();

  const loggedInProfile = useSelector((state: RootState) => state.auth.profile);
  const loggedInProfileRole = loggedInProfile.type;

  const [activeTab, setActiveTab] = useState<"student" | "teacher">(
    loggedInProfileRole !== Role.TEACHER ? "student" : "teacher",
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [studentRequests, setStudentRequests] = useState<
    StudentSubjectRequest[]
  >([]);
  const [teacherRequests, setTeacherRequests] = useState<
    TeacherSubjectRequest[]
  >([]);

  const [studentPagination, setStudentPagination] = useState<TabPagination>({
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
  });

  const [teacherPagination, setTeacherPagination] = useState<TabPagination>({
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
  });

  // Review Dialog States
  const [auditTarget, setAuditTarget] = useState<AuditingTarget | null>(null);
  const [submittingAudit, setSubmittingAudit] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<ReviewStatus>("PENDING");
  const [formNotes, setFormNotes] = useState<string>("");

  const fetchData = async (type: "student" | "teacher", page: number) => {
    setLoading(true);
    if (type === "student") {
      let endpoint = "/student-subject-requests";
      try {
        if (loggedInProfileRole === Role.STUDENT) {
          endpoint = `/student-subject-requests?search=${loggedInProfile.id}`;
        }
        const res = await axiosAPI.get(endpoint, {
          params: { page, limit: ITEMS_PER_PAGE },
        });
        setStudentRequests(res.data.data || []);
        setStudentPagination({
          currentPage: page,
          totalPages: res.data.totalPages || 1,
          totalData: res.data.total || res.data.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
        toast.error(t("dashboard.requests.page.toasts.loadError", { type }));
      } finally {
        setLoading(false);
      }
    } else {
      try {
        let endpoint = "/teacher-subject-requests";
        if (loggedInProfileRole === Role.TEACHER) {
          endpoint = `/teacher-subject-requests?search=${loggedInProfile.id}`;
        }

        const res = await axiosAPI.get(endpoint, {
          params: { page, limit: ITEMS_PER_PAGE },
        });
        setTeacherRequests(res.data.data || []);
        setTeacherPagination({
          currentPage: page,
          totalPages: res.data.totalPages || 1,
          totalData: res.data.total || res.data.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
        toast.error(t("dashboard.requests.page.toasts.loadError", { type }));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    (() => {
      if (
        loggedInProfileRole === Role.ADMIN ||
        loggedInProfileRole === Role.STUDENT
      )
        fetchData("student", 1);
      if (
        loggedInProfileRole === Role.ADMIN ||
        loggedInProfileRole === Role.TEACHER
      )
        fetchData("teacher", 1);
    })();
  }, []);

  const currentPagination =
    activeTab === "student" ? studentPagination : teacherPagination;

  const handlePageChange = (newPage: number, type: "student" | "teacher") => {
    if (newPage >= 1 && newPage <= currentPagination.totalPages) {
      fetchData(type, newPage);
    }
  };

  const openAuditModal = (
    req: StudentSubjectRequest | TeacherSubjectRequest,
    type: "student" | "teacher",
  ) => {
    setAuditTarget({
      id: req.id,
      type,
      currentStatus: req.status,
      currentNotes: req.reviewNotes || "",
    });
    setFormStatus(req.status);
    setFormNotes(req.reviewNotes || "");
  };

  const handleUpdateStatusSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    if (!auditTarget) return;

    setSubmittingAudit(true);
    const endpoint =
      auditTarget.type === "student"
        ? `/student-subject-requests/${auditTarget.id}`
        : `/teacher-subject-requests/${auditTarget.id}`;

    try {
      // API payload containing newly evaluated review details
      const response = await axiosAPI.patch(endpoint, {
        status: formStatus,
        reviewNotes: formNotes.trim() || null,
      });

      const updatedRecord = response.data?.data;

      // Optimistically match and patch the element locally inside our state tree arrays
      if (auditTarget.type === "student") {
        setStudentRequests((prev) =>
          prev.map((item) =>
            item.id === auditTarget.id
              ? {
                  ...item,
                  ...updatedRecord,
                  status: formStatus,
                  reviewNotes: formNotes,
                }
              : item,
          ),
        );
      } else {
        setTeacherRequests((prev) =>
          prev.map((item) =>
            item.id === auditTarget.id
              ? {
                  ...item,
                  ...updatedRecord,
                  status: formStatus,
                  reviewNotes: formNotes,
                }
              : item,
          ),
        );
      }

      toast.success(t("dashboard.requests.page.toasts.updateSuccess"));
      setAuditTarget(null);
    } catch (err) {
      console.error(err);
      const errTitle = t("dashboard.requests.page.toasts.defaultErrorTitle");
      const errMsg = resolveApiErrorMessage(
        err,
        t,
        t("dashboard.requests.page.toasts.defaultErrorMessage"),
      );

      toast.error(errTitle, {
        description: errMsg,
      });
    } finally {
      setSubmittingAudit(false);
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    const schemas: Record<ReviewStatus, string> = {
      PENDING: "bg-amber-50 text-amber-700 border-amber-200/60",
      UNDER_REVIEW:
        "bg-blue-50 text-blue-700 border-blue-200/60 whitespace-nowrap",
      ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200/60",
    };
    return `px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${schemas[status]}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen relative">
      {/* Top Banner Heading with Table */}

      <HeaderComponent
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        studentPagination={studentPagination}
        teacherPagination={teacherPagination}
      />

      <TableComponent
        loading={loading}
        activeTab={activeTab}
        studentRequests={studentRequests}
        getStatusBadge={getStatusBadge}
        openAuditModal={openAuditModal}
        teacherRequests={teacherRequests}
        currentPagination={currentPagination}
        handlePageChange={handlePageChange}
      />

      {/* Review subject request modal */}
      <ReviewSubjectRequestModal
        auditTarget={auditTarget}
        setAuditTarget={setAuditTarget}
        handleUpdateStatusSubmit={handleUpdateStatusSubmit}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        formNotes={formNotes}
        setFormNotes={setFormNotes}
        submittingAudit={submittingAudit}
      />
    </div>
  );
};

export default Requests;
