import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ProfileManager from '../components/admin/ProfileManager';
import PortfolioManager from '../components/admin/PortfolioManager';
import BlogManager from '../components/admin/BlogManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import TechStackManager from '../components/admin/TechStackManager';

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white border mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="techstack">Tech Stack</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileManager />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>
          
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>
          
          <TabsContent value="experience">
            <ExperienceManager />
          </TabsContent>
          
          <TabsContent value="techstack">
            <TechStackManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}