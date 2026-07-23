// frontend/components/layout/Navbar.tsx

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="top-navbar">
      <div className="flex items-center">
        {onMenuClick && (
          <button className="hamburger-btn mr-4" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <h2 className="font-medium text-lg">Admin Panel</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for user profile/logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>
          <span className="hidden sm:inline-block font-medium">Admin User</span>
        </div>
      </div>
    </header>
  );
}
