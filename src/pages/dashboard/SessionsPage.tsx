import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import axiosAPI from "@lib/axios";
import { SessionStatus, type SessionData } from "@utils/types/session";
import SessionsListComponent from "@components/dashboard/sessions/SessionsListComponent";
import CreateAndUpdateSessionModal from "@components/dashboard/sessions/CreateAndUpdateSessionModal";
import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import UnauthorizedPage from "@pages/static/Unauthorized";
import { Role } from "@utils/types/user";

// Types
export interface RelationOption {
  id: string;
  name: string;
}

interface APIUser {
  firstName: string;
  lastName: string;
}

interface APIStudentOrTeacher {
  id: string;
  user: APIUser;
}

interface APISubject {
  id: string;
  name: string;
}

const SessionsPage = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.profile);
  const loggedInUserRole = loggedInUser.type;

  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);

  // Modal & Option States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null); // null means creating new

  const [students, setStudents] = useState<RelationOption[]>([]);
  const [teachers, setTeachers] = useState<RelationOption[]>([]);
  const [subjects, setSubjects] = useState<RelationOption[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    studentId: "",
    teacherId: "",
    subjectId: "",
    startTime: "",
    endTime: "",
    externalLink: "",
    status: SessionStatus.SCHEDULED,
    googleEventId: "",
  });

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      let sessionsEndpoint = "/sessions";
      if (loggedInUserRole !== Role.ADMIN) {
        sessionsEndpoint =
          loggedInUserRole === Role.STUDENT
            ? `students/${loggedInUser.id}/sessions`
            : `teachers/${loggedInUser.id}/sessions`;
      }

      const response = await axiosAPI.get(sessionsEndpoint);
      setSessions(response.data.data || []);
    } catch {
      toast.error("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch options for the form
  const fetchModalOptions = async () => {
    try {
      const [studentsRes, teachersRes, subjectsRes] = await Promise.all([
        axiosAPI.get("/students"),
        axiosAPI.get("/teachers"),
        axiosAPI.get("/subjects"),
      ]);

      setStudents(
        studentsRes.data.data?.map((s: APIStudentOrTeacher) => ({
          id: s.id,
          name: `${s.user.firstName} ${s.user.lastName}`,
        })) || [],
      );
      setTeachers(
        teachersRes.data.data?.map((t: APIStudentOrTeacher) => ({
          id: t.id,
          name: `${t.user.firstName} ${t.user.lastName}`,
        })) || [],
      );
      setSubjects(
        subjectsRes.data.data?.map((sub: APISubject) => ({
          id: sub.id,
          name: sub.name,
        })) || [],
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load form data.");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSessions();
    })();
  }, []);

  useEffect(() => {
    (() => {
      if (isModalOpen) {
        fetchModalOptions();
      }
    })();
  }, [isModalOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for a clean layout (Create mode)
  const handleOpenCreateModal = () => {
    setEditingSessionId(null);
    setFormData({
      title: "",
      description: "",
      studentId: "",
      teacherId: "",
      subjectId: "",
      startTime: "",
      endTime: "",
      externalLink: "",
      status: SessionStatus.SCHEDULED,
      googleEventId: "",
    });
    setIsModalOpen(true);
  };

  // Open modal with pre-filled inputs (Edit mode)
  const handleOpenEditModal = (session: SessionData) => {
    setEditingSessionId(session.id);

    // Format ISO string back to local browser format input tags need (YYYY-MM-DDTHH:mm)
    const formatToLocalInput = (isoString: string) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setFormData({
      title: session.title,
      description: session.description || "",
      studentId: session.studentId,
      teacherId: session.teacherId,
      subjectId: session.subjectId,
      startTime: formatToLocalInput(session.startTime),
      endTime: formatToLocalInput(session.endTime),
      externalLink: session.externalLink,
      status: session.status,
      googleEventId: session.googleEventId ?? "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      if (editingSessionId) {
        let endpoint = `/sessions/${editingSessionId}`;
        if (loggedInUserRole === Role.TEACHER) {
          endpoint = `/sessions/${editingSessionId}/status`;
        }
        // Edit Mode: Send update API request
        await axiosAPI.patch(endpoint, payload);
        toast.success("Session updated successfully!");
      } else {
        // Create Mode: Send save request
        await axiosAPI.post("/sessions", payload);
        toast.success("Session created successfully!");
        // setSessions((prev) => [res.data.data, ...prev]);
      }
      await fetchSessions();

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      let errMsg = "Check Your inputs";
      if (isAxiosError(err) && err.response?.data) {
        const serverData = err?.response?.data;

        if (Array.isArray(serverData.errors) && serverData.errors.length > 0) {
          errMsg = serverData.errors[0].message;
        } else if (serverData.message) {
          errMsg = serverData.message;
        }
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      toast.error("Failed to save session", {
        description: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case SessionStatus.RUNNING:
        return "bg-teal-50 text-teal-700 border-teal-200 animate-pulse";
      case SessionStatus.SCHEDULED:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case SessionStatus.COMPLETED:
        return "bg-neutral-100 text-neutral-700 border-neutral-300";
      case SessionStatus.CANCELLED:
      case SessionStatus.MISSED:
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  if (!loggedInUser) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans pb-12 selection:bg-teal-100">
      <div className="max-w-6xl mx-auto px-4 pt-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Sessions
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              View and manage student-teacher sessions
            </p>
          </div>
          {loggedInUserRole === Role.ADMIN ? (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl transition shadow-sm cursor-pointer"
            >
              Create New Session
            </button>
          ) : null}
        </div>
        {/* Loading / Empty / List */}
        <SessionsListComponent
          loading={loading}
          sessions={sessions}
          handleOpenEditModal={handleOpenEditModal}
          getStatusStyles={getStatusStyles}
        />
        {/* Modal (Used for both Create and Edit operations) */}
        <CreateAndUpdateSessionModal
          isModalOpen={isModalOpen}
          editingSessionId={editingSessionId}
          setIsModalOpen={setIsModalOpen}
          handleFormSubmit={handleFormSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          subjects={subjects}
          teachers={teachers}
          students={students}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SessionsPage;
