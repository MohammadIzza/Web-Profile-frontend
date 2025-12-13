import { useEffect, useState } from 'react';
import { experienceApi } from '../../services/api';
import type { Experience } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash } from 'lucide-react';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Partial<Experience>>({ current: false });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await experienceApi.getAll();
      setExperiences(response.data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expData = {
        ...currentExperience,
        startDate: new Date(currentExperience.startDate!).toISOString(),
        endDate: currentExperience.endDate ? new Date(currentExperience.endDate).toISOString() : null
      };

      if (currentExperience.id) {
        await experienceApi.update(currentExperience.id, expData);
      } else {
        await experienceApi.create(expData);
      }
      loadExperiences();
      setIsEditing(false);
      setCurrentExperience({ current: false });
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await experienceApi.delete(id);
        loadExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  const handleEdit = (experience: Experience) => {
    setCurrentExperience({
      ...experience,
      startDate: experience.startDate.split('T')[0],
      endDate: experience.endDate ? experience.endDate.split('T')[0] : ''
    });
    setIsEditing(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Manage Experience</h2>
        <Button onClick={() => { setIsEditing(true); setCurrentExperience({ current: false }); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {isEditing && (
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle>{currentExperience.id ? 'Edit' : 'Add'} Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Company"
                value={currentExperience.company || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                required
              />
              <Input
                placeholder="Position"
                value={currentExperience.position || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={currentExperience.description || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                required
              />
              <Input
                placeholder="Location"
                value={currentExperience.location || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Start Date"
                value={currentExperience.startDate || ''}
                onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                required
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={currentExperience.current || false}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, current: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="current" className="text-sm font-medium">Currently working here</label>
              </div>

              {!currentExperience.current && (
                <Input
                  type="date"
                  placeholder="End Date"
                  value={currentExperience.endDate || ''}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                />
              )}

              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setCurrentExperience({ current: false }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-black">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                  </p>
                  {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                </div>
                <div className="flex gap-2">
                  {exp.current && <Badge>Current</Badge>}
                  <Button variant="outline" size="icon" onClick={() => handleEdit(exp)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(exp.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}