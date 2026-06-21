import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import type { Role } from "@utils/types/user";
import type { NavItem } from "@pages/dashboard/Dashboard";

import { logout } from "@store/slices/authSlice";

interface SideNavProps {
  currentRole: Role;
  filteredNavItems: NavItem[];
  isUserActive: boolean;
  user: {
    firstName: string;
    email: string;
  };
}

const SideNav = ({
  currentRole,
  filteredNavItems,
  isUserActive,
  user,
}: SideNavProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black">
            Ω
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 tracking-tight">
              EduPortal
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md">
              {currentRole} Panel
            </span>
          </div>
        </div>

        {/* Sidebar Links - Block interactions if deactivated */}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={isUserActive ? item.path : "#"} // ✅ Block navigate paths if deactivated
              end={item.path === "/dashboard"}
              onClick={(e) => {
                if (!isUserActive) {
                  e.preventDefault();
                  toast.error("Access Denied", {
                    description: "Reactivate account to open tabs.",
                  });
                }
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 ${
                  isActive && isUserActive
                    ? "bg-teal-50 text-teal-600"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                } ${!isUserActive ? "opacity-50 cursor-not-allowed" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Area with clear Logout action access */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden w-full justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="h-8 w-8 rounded-full bg-neutral-200 shrink-0 flex items-center justify-center font-bold text-xs uppercase text-neutral-600">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {user?.firstName}
              </p>
              <p className="text-[10px] text-neutral-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Added an escape sign-out hook right here for security compliance */}
          <button
            onClick={() => {
              dispatch(logout());
              // Trigger your custom red-dispatch auth logout slice handler here
              toast.success("Logged out successfully");
              navigate("/login");
            }}
            className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md cursor-pointer transition"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
