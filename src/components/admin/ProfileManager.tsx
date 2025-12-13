import { useEffect, useState } from 'react';
import { profileApi } from '../../services/api';
import type { Profile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash } from 'lucide-react';

export default function ProfileManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Partial<Profile>>({});

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await profileApi.getAll();
      setProfiles(response.data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProfile.id) {
        await profileApi.update(currentProfile.id, currentProfile);
      } else {
        await profileApi.create(currentProfile);
      }
      loadProfiles();
      setIsEditing(false);
      setCurrentProfile({});
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await profileApi.delete(id);
        loadProfiles();
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  const handleEdit = (profile: Profile) => {
    setCurrentProfile(profile);
    setIsEditing(true);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Manage Profile</h2>
        <Button onClick={() => { setIsEditing(true); setCurrentProfile({}); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {isEditing && (
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle>{currentProfile.id ? 'Edit' : 'Add'} Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={currentProfile.name || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                required
              />
              <Input
                placeholder="Title"
                value={currentProfile.title || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Bio"
                value={currentProfile.bio || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, bio: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={currentProfile.email || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, email: e.target.value })}
                required
              />
              <Input
                placeholder="Phone"
                value={currentProfile.phone || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, phone: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={currentProfile.location || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, location: e.target.value })}
              />
              <Input
                placeholder="GitHub URL"
                value={currentProfile.github || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, github: e.target.value })}
              />
              <Input
                placeholder="LinkedIn URL"
                value={currentProfile.linkedin || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, linkedin: e.target.value })}
              />
              <Input
                placeholder="Twitter URL"
                value={currentProfile.twitter || ''}
                onChange={(e) => setCurrentProfile({ ...currentProfile, twitter: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setCurrentProfile({}); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {profiles.map((profile) => (
          <Card key={profile.id} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-black">{profile.name}</h3>
                  <p className="text-gray-600">{profile.title}</p>
                  <p className="text-gray-700 mt-2">{profile.bio}</p>
                  <p className="text-gray-600 mt-2">{profile.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(profile)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(profile.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}