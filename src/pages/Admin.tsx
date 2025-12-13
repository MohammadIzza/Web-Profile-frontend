import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ProfileManager from '../components/admin/ProfileManager';
import PortfolioManager from '../components/admin/PortfolioManager';
import BlogManager from '../components/admin/BlogManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import TechStackManager from '../components/admin/TechStackManager';
import ChangePasswordDialog from '../components/admin/ChangePasswordDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Briefcase,
  FileText,
  Award,
  Code,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  KeyRound,
  ChevronDown,
  UserCircle,
} from 'lucide-react';

export default function Admin() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Award },
    { id: 'techstack', label: 'Tech Stack', icon: Code },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total Portfolio</p>
                    <p className="text-2xl font-semibold text-black mt-1">0</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-black" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-semibold text-black mt-1">0</p>
                  </div>
                  <FileText className="h-8 w-8 text-black" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Technologies</p>
                    <p className="text-2xl font-semibold text-black mt-1">0</p>
                  </div>
                  <Code className="h-8 w-8 text-black" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h2 className="text-sm font-semibold mb-2 text-black">Welcome to Admin Dashboard</h2>
              <p className="text-xs text-gray-600">
                Use the sidebar to navigate between different sections and manage your portfolio content.
              </p>
            </div>
          </div>
        );
      case 'profile':
        return <ProfileManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'blog':
        return <BlogManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'techstack':
        return <TechStackManager />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-56' : 'w-16'
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <h2 className="text-sm font-semibold text-black">Admin Panel</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-7 w-7 p-0"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-7 w-7 p-0 mx-auto"
            >
              <Menu className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                  activeTab === item.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-xs">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-black">
                {menuItems.find((item) => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Manage your {activeTab === 'dashboard' ? 'content' : activeTab}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span className="font-medium">{user?.username}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setChangePasswordOpen(true)}
                    className="cursor-pointer"
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">{renderContent()}</div>
      </main>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </div>
  );
}