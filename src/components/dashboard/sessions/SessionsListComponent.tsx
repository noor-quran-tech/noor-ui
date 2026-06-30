import { useSelector } from "react-redux";

import type { RootState } from "@store/store";
import type { SessionData } from "@utils/types/session";

import { Role } from "@utils/types/user";

interface SessionsListComponentProps {
  loading: boolean;
  sessions: SessionData[];
  handleOpenEditModal: (session: SessionData) => void;
  getStatusStyles: (status: string) => void;
}

const SessionsListComponent = ({
  loading,
  sessions,
  handleOpenEditModal,
  getStatusStyles,
}: SessionsListComponentProps) => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const loggedInUserRole = loggedInUser.role;
  return (
    <div>
      {" "}
      {/* Loading / Empty / List */}
      {loading ? (
        <div className="text-center py-20 text-sm font-medium text-neutral-400 animate-pulse">
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-300 bg-white rounded-2xl text-neutral-400 text-sm font-medium">
          No sessions found.
          {loggedInUserRole === Role.ADMIN
            ? "Click the button above to add one."
            : ""}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700">
                    {session.subject?.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {loggedInUserRole !== Role.STUDENT ? (
                      <button
                        onClick={() => handleOpenEditModal(session)}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 transition mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                    ) : null}
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusStyles(session.status)}`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
                <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  {session.title}
                </h2>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {session.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Teacher
                  </span>
                  <span className="font-bold text-neutral-800">
                    {session.teacher?.user
                      ? `${session.teacher.user.firstName} ${session.teacher.user.lastName}`
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Student
                  </span>
                  <span className="font-bold text-neutral-800">
                    {session.student?.user
                      ? `${session.student.user.firstName} ${session.student.user.lastName}`
                      : "N/A"}
                  </span>
                </div>
                <div className="col-span-2 pt-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Time
                  </span>
                  <span className="font-mono font-medium text-neutral-600">
                    {new Date(session.startTime).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(session.endTime).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <a
                href={session.externalLink}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-2 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-teal-300 rounded-xl transition tracking-wide shadow-inner block"
              >
                Join Class
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsListComponent;
