import { useEffect, useState } from 'react';
import { portfolioApi } from '../../services/api';
import type { Portfolio } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Edit, Trash, ExternalLink, Github, Calendar, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState<Partial<Portfolio>>({ tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; portfolio: Portfolio | null }>({ open: false, portfolio: null });

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoading(true);
    try {
      const response = await portfolioApi.getAll();
      setPortfolios(response.data);
    } catch (error: any) {
      console.error('Error loading portfolios:', error);
      toast.error('Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentPortfolio.id) {
        await portfolioApi.update(currentPortfolio.id, currentPortfolio);
        toast.success('Portfolio updated successfully!');
      } else {
        await portfolioApi.create(currentPortfolio);
        toast.success('Portfolio created successfully!');
      }
      loadPortfolios();
      setIsEditing(false);
      setCurrentPortfolio({ tags: [] });
    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save portfolio';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.portfolio) {
      setLoading(true);
      try {
        await portfolioApi.delete(deleteDialog.portfolio.id);
        toast.success('Portfolio deleted successfully!');
        loadPortfolios();
        setDeleteDialog({ open: false, portfolio: null });
      } catch (error: any) {
        console.error('Error deleting portfolio:', error);
        toast.error('Failed to delete portfolio');
      } finally {
        setLoading(false);
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
    <TooltipProvider>
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-semibold text-black">Manage Portfolio</h2>
              <p className="text-xs text-gray-500">Showcase your projects and work</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" onClick={() => { setIsEditing(true); setCurrentPortfolio({ tags: [] }); }}>
                  <Plus className="w-3 h-3 mr-1.5" />
                  Add Portfolio
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new portfolio item</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(portfolio)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit portfolio</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 hover:bg-destructive hover:text-white" onClick={() => setDeleteDialog({ open: true, portfolio })}>
                        <Trash className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete portfolio</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p className="text-xs text-gray-700 mb-2">{portfolio.description}</p>
              <Separator className="my-2" />
              <div className="flex gap-2 mb-2">
                {portfolio.link && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                        <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Demo
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View live demo</TooltipContent>
                  </Tooltip>
                )}
                {portfolio.github && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                        <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View source code</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs h-5">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, portfolio: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.portfolio?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialog({ open: false, portfolio: null })}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash className="w-3 h-3 mr-1.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}