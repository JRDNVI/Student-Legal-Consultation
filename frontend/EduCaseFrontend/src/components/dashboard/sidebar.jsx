import { useLocation, Link } from "react-router-dom";
import { FaHome, FaUserGraduate, FaTasks, FaCalendarAlt, FaBriefcase, FaGavel, FaSignOutAlt, FaMale, FaPersonBooth } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";


// The sidebar is displayed on the left side of every page. Depending on the role of the user, different links are displayed.
export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = {
    student: [
      { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
      { icon: <FaUserGraduate />, label: "Assignments", path: "/assignments" },
      { icon: <FaTasks />, label: "Tasks", path: "/tasks" },
      { icon: <FaCalendarAlt />, label: "Meetings", path: "/meetings" },
      { icon: <FaPersonBooth />, label: "Mentor", path: "/mentot" },
    ],
    mentor: [
      { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
      { icon: <FaTasks />, label: "Student Tasks", path: "/tasks" },
      { icon: <FaCalendarAlt />, label: "Mentor Meetings", path: "/meetings" },
    ],
    client: [
      { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
      { icon: <FaBriefcase />, label: "My Cases", path: "/cases" },
      { icon: <FaCalendarAlt />, label: "Appointments", path: "/appointments" },
    ],
    solicitor: [
      { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
      { icon: <FaBriefcase />, label: "All Cases", path: "/cases" },
      { icon: <FaGavel />, label: "Court Schedule", path: "/court-schedule" },
      { icon: <FaCalendarAlt />, label: "Calendar", path: "/calendar" },
    ],
  };

  const items = navItems[role] || [];

  return (
    <aside className="w-48 bg-white shadow-md h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10 capitalize">{role} Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200 ${
                  isActive ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:text-purple-600"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 mt-10 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
      >
        <FaSignOutAlt />
        Sign Out
      </button>
    </aside>
  );
}
