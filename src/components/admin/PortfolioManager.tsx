import { useEffect, useState } from 'react';
import { portfolioApi } from '../../services/api';
import type { Portfolio } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash } from 'lucide-react';

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState<Partial<Portfolio>>({ tags: [] });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const response = await portfolioApi.getAll();
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPortfolio.id) {
        await portfolioApi.update(currentPortfolio.id, currentPortfolio);
      } else {
        await portfolioApi.create(currentPortfolio);
      }
      loadPortfolios();
      setIsEditing(false);
      setCurrentPortfolio({ tags: [] });
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await portfolioApi.delete(id);
        loadPortfolios();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  const handleEdit = (portfolio: Portfolio) => {
    setCurrentPortfolio(portfolio);
    setIsEditing(true);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setCurrentPortfolio({
        ...currentPortfolio,
        tags: [...(currentPortfolio.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setCurrentPortfolio({
      ...currentPortfolio,
      tags: currentPortfolio.tags?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-black">Manage Portfolio</h2>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentPortfolio({ tags: [] }); }}>
          <Plus className="w-3 h-3 mr-1.5" />
          Add Portfolio
        </Button>
      </div>

      {isEditing && (
        <Card className="mb-4 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{currentPortfolio.id ? 'Edit' : 'Add'} Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                className="h-8 text-sm"
                placeholder="Title"
                value={currentPortfolio.title || ''}
                onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, title: e.target.value })}
                required
              />
              <Textarea
                className="text-sm"
                placeholder="Description"
                value={currentPortfolio.description || ''}
                onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, description: e.target.value })}
                required
              />
              <Input
                className="h-8 text-sm"
                placeholder="Image URL"
                value={currentPortfolio.image || ''}
                onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, image: e.target.value })}
              />
              <Input
                className="h-8 text-sm"
                placeholder="Project Link"
                value={currentPortfolio.link || ''}
                onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, link: e.target.value })}
              />
              <Input
                className="h-8 text-sm"
                placeholder="GitHub URL"
                value={currentPortfolio.github || ''}
                onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, github: e.target.value })}
              />
              
              <div>
                <div className="flex gap-2 mb-2">
                  <Input
                    className="h-8 text-sm"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" size="sm" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentPortfolio.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer text-xs h-5" onClick={() => removeTag(i)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="sm">Save</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setIsEditing(false); setCurrentPortfolio({ tags: [] }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="bg-white">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-black">{portfolio.title}</h3>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(portfolio)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleDelete(portfolio.id)}>
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-700 mb-2">{portfolio.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs h-5">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}