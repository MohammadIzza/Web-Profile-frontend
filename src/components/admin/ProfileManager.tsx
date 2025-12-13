import { useEffect, useState } from 'react';
import { profileApi } from '../../services/api';
import type { Profile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash } from 'lucide-react';

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getAll();
      if (response.data.length > 0) {
        setProfile(response.data[0]);
        setFormData(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (profile?.id) {
        await profileApi.update(profile.id, formData);
      } else {
        await profileApi.create(formData);
      }
      loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleEdit = () => {
    setFormData(profile || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-black">Profile</h2>
        {!isEditing && profile && (
          <Button size="sm" onClick={handleEdit}>
            <Edit className="w-3 h-3 mr-1.5" />
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="mb-4 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Name</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Title</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Bio</label>
                <Textarea
                  className="text-sm"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <Input
                  className="h-8 text-sm"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Phone</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">GitHub URL</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.github || ''}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">LinkedIn URL</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Twitter URL</label>
                <Input
                  className="h-8 text-sm"
                  value={formData.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm">Save Changes</Button>
                <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          {profile ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Name</label>
                <p className="text-sm text-black mt-0.5">{profile.name}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Title</label>
                <p className="text-sm text-black mt-0.5">{profile.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Bio</label>
                <p className="text-sm text-black mt-0.5">{profile.bio}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <p className="text-sm text-black mt-0.5">{profile.email}</p>
              </div>
              {profile.phone && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-black mt-0.5">{profile.phone}</p>
                </div>
              )}
              {profile.location && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Location</label>
                  <p className="text-sm text-black mt-0.5">{profile.location}</p>
                </div>
              )}
              {profile.github && (
                <div>
                  <label className="text-xs font-medium text-gray-500">GitHub</label>
                  <p className="text-sm text-black mt-0.5">{profile.github}</p>
                </div>
              )}
              {profile.linkedin && (
                <div>
                  <label className="text-xs font-medium text-gray-500">LinkedIn</label>
                  <p className="text-sm text-black mt-0.5">{profile.linkedin}</p>
                </div>
              )}
              {profile.twitter && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Twitter</label>
                  <p className="text-sm text-black mt-0.5">{profile.twitter}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 mb-3">No profile found</p>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Plus className="w-3 h-3 mr-1.5" />
                Create Profile
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}