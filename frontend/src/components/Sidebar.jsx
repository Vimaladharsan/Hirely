import { LayoutDashboard, FileText, Upload, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Job", icon: FileText, path: "/job" },
    { name: "Upload", icon: Upload, path: "/upload" },
    { name: "Candidate", icon: User, path: "/candidate/1" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-10">
        Hirely
      </h1>

      <div className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;