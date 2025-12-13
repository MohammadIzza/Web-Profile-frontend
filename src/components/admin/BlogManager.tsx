import { useEffect, useState } from 'react';
import { blogApi } from '../../services/api';
import type { Blog } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Edit, Trash, Calendar, Tag } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import { toast } from 'sonner';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({ 
    tags: [], 
    published: false,
    content: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; blog: Blog | null }>({ open: false, blog: null });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getAll();
      setBlogs(response.data);
    } catch (error: any) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Generate slug from title if not exists
      const blogData = {
        ...currentBlog,
        slug: currentBlog.slug || currentBlog.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (currentBlog.id) {
        await blogApi.update(currentBlog.id, blogData);
        toast.success('Blog updated successfully!');
      } else {
        await blogApi.create(blogData);
        toast.success('Blog created successfully!');
      }
      loadBlogs();
      setIsEditing(false);
      setCurrentBlog({ tags: [], published: false, content: '' });
    } catch (error: any) {
      console.error('Error saving blog:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save blog';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.blog) {
      setLoading(true);
      try {
        await blogApi.delete(deleteDialog.blog.id);
        toast.success('Blog deleted successfully!');
        loadBlogs();
        setDeleteDialog({ open: false, blog: null });
      } catch (error: any) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setCurrentBlog({
        ...currentBlog,
        tags: [...(currentBlog.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setCurrentBlog({
      ...currentBlog,
      tags: currentBlog.tags?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <TooltipProvider>
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-semibold text-black">Manage Blog Posts</h2>
              <p className="text-xs text-gray-500">Create and manage your blog content</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" onClick={() => { setIsEditing(true); setCurrentBlog({ tags: [], published: false, content: '' }); }}>
                  <Plus className="w-3 h-3 mr-1.5" />
                  Add Blog Post
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create a new blog post</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
        </div>

      {isEditing && (
        <Card className="mb-4 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{currentBlog.id ? 'Edit' : 'Add'} Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                className="h-8 text-sm"
                placeholder="Title"
                value={currentBlog.title || ''}
                onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                required
              />
              <Input
                className="h-8 text-sm"
                placeholder="Slug (auto-generated from title if empty)"
                value={currentBlog.slug || ''}
                onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
              />
              <Textarea
                className="text-sm"
                placeholder="Excerpt (short description)"
                value={currentBlog.excerpt || ''}
                onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                rows={2}
              />
              <Input
                className="h-8 text-sm"
                placeholder="Featured Image URL"
                value={currentBlog.image || ''}
                onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
              />
              
              <div>
                <label className="block text-xs font-medium mb-1.5">Content</label>
                <RichTextEditor
                  content={currentBlog.content || ''}
                  onChange={(content) => setCurrentBlog({ ...currentBlog, content })}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1.5">
                  <Tag className="w-3 h-3" />
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    className="h-8 text-sm"
                    placeholder="Add tag (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="sm" onClick={addTag}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add tag to blog post</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentBlog.tags?.map((tag, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-white transition" onClick={() => removeTag(i)}>
                          {tag} ×
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>Click to remove</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={currentBlog.published || false}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, published: e.target.checked })}
                  className="w-3.5 h-3.5"
                />
                <label htmlFor="published" className="text-xs font-medium">
                  Publish this post
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setIsEditing(false); setCurrentBlog({ tags: [], published: false, content: '' }); }} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {blogs.map((blog) => (
          <Card key={blog.id} className="bg-white">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-black">{blog.title}</h3>
                    {blog.published && (
                      <Badge variant="default" className="text-xs h-5">Published</Badge>
                    )}
                    {!blog.published && (
                      <Badge variant="secondary" className="text-xs h-5">Draft</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">/{blog.slug}</p>
                </div>
                <div className="flex gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(blog)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit blog post</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 hover:bg-destructive hover:text-white" onClick={() => setDeleteDialog({ open: true, blog })}>
                        <Trash className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete blog post</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {blog.excerpt && (
                <p className="text-xs text-gray-700 mb-2">{blog.excerpt}</p>
              )}
              <Separator className="my-2" />
              <div className="flex flex-wrap gap-1.5 mb-2">
                {blog.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs h-5">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, blog: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.blog?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialog({ open: false, blog: null })}>
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