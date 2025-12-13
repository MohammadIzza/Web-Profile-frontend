import { useEffect, useState } from 'react';
import { techStackApi } from '../../services/api';
import type { TechStack } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash } from 'lucide-react';

export default function TechStackManager() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTechStack, setCurrentTechStack] = useState<Partial<TechStack>>({ level: 'intermediate' });

  useEffect(() => {
    loadTechStacks();
  }, []);

  const loadTechStacks = async () => {
    try {
      const response = await techStackApi.getAll();
      setTechStacks(response.data);
    } catch (error) {
      console.error('Error loading tech stacks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTechStack.id) {
        await techStackApi.update(currentTechStack.id, currentTechStack);
      } else {
        await techStackApi.create(currentTechStack);
      }
      loadTechStacks();
      setIsEditing(false);
      setCurrentTechStack({ level: 'intermediate' });
    } catch (error) {
      console.error('Error saving tech stack:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await techStackApi.delete(id);
        loadTechStacks();
      } catch (error) {
        console.error('Error deleting tech stack:', error);
      }
    }
  };

  const handleEdit = (techStack: TechStack) => {
    setCurrentTechStack(techStack);
    setIsEditing(true);
  };

  const groupedTechStacks = techStacks.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechStack[]>);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Manage Tech Stack</h2>
        <Button onClick={() => { setIsEditing(true); setCurrentTechStack({ level: 'intermediate' }); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tech Stack
        </Button>
      </div>

      {isEditing && (
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle>{currentTechStack.id ? 'Edit' : 'Add'} Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Technology Name"
                value={currentTechStack.name || ''}
                onChange={(e) => setCurrentTechStack({ ...currentTechStack, name: e.target.value })}
                required
              />
              <Input
                placeholder="Category (e.g., Frontend, Backend, Database)"
                value={currentTechStack.category || ''}
                onChange={(e) => setCurrentTechStack({ ...currentTechStack, category: e.target.value })}
                required
              />
              <Input
                placeholder="Icon URL or Emoji"
                value={currentTechStack.icon || ''}
                onChange={(e) => setCurrentTechStack({ ...currentTechStack, icon: e.target.value })}
              />
              
              <Select
                value={currentTechStack.level || 'intermediate'}
                onValueChange={(value) => setCurrentTechStack({ ...currentTechStack, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setCurrentTechStack({ level: 'intermediate' }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(groupedTechStacks).map(([category, techs]) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-black mb-4">{category}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {techs.map((tech) => (
                <Card key={tech.id} className="bg-white">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {tech.icon && <span className="text-2xl">{tech.icon}</span>}
                        <h4 className="font-bold text-black">{tech.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(tech)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(tech.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="secondary">{tech.level}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}