import React from "react";
import Link from "next/link";

interface SidebarProps {
  role: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const commonLinks = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
  ];

  const roleSpecificLinks = {
    admin: [{ label: "Manage Users", path: "/admin/users" }],
    instructor: [{ label: "Courses", path: "/courses" }],
    student: [{ label: "Courses", path: "/courses" }],
  };

  const links = [
    ...commonLinks,
    ...(role && roleSpecificLinks[role as keyof typeof roleSpecificLinks]
      ? roleSpecificLinks[role as keyof typeof roleSpecificLinks]
      : []),
  ];
  

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
