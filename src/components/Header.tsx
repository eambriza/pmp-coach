import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PlayIcon, BarChart2Icon, TrophyIcon } from 'lucide-react';
const Header: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <header className="glass sticky top-0 z-10 px-6 py-4 mb-8 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-2xl font-bold neon-text mr-8">PMP Drill Coach</div>
        <nav className="hidden md:flex space-x-2">
          <NavLink to="/" active={isActive('/')}>
            <HomeIcon size={18} className="mr-2" />
            Home
          </NavLink>
          <NavLink to="/practice" active={isActive('/practice')}>
            <PlayIcon size={18} className="mr-2" />
            Practice
          </NavLink>
          <NavLink to="/results" active={isActive('/results')}>
            <TrophyIcon size={18} className="mr-2" />
            Results
          </NavLink>
          <NavLink to="/progress" active={isActive('/progress')}>
            <BarChart2Icon size={18} className="mr-2" />
            Progress
          </NavLink>
        </nav>
      </div>
      <div className="md:hidden">
        <button className="glass-button p-2">
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>;
};
interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}
const NavLink: React.FC<NavLinkProps> = ({
  to,
  active,
  children
}) => {
  return <Link to={to} className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${active ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/10 text-white/80'}`}>
      {children}
    </Link>;
};
export default Header;