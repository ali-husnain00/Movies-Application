import Link from "next/link";
import { Home, Settings, Tv2, EyeIcon, Star, X } from "lucide-react";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Watch Movies", url: "/movies", icon: EyeIcon },
  { title: "Tv Shows", url: "/tvshows", icon: Tv2 },
  { title: "Top Rated", url: "/top-rated", icon: Star },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function CustomSidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0f0f0f] text-white z-50 transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button (only on small screens) */}
          <button
            className="lg:hidden self-end mb-4 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>

          {/* Menu */}
          <nav className="flex-1 mt-20">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                    onClick={() => setIsOpen(false)} // close sidebar after navigation
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto text-xs text-gray-400">
            © {new Date(Date.now()).getFullYear()} Movies App
          </div>
        </div>
      </aside>
    </>
  );
}
