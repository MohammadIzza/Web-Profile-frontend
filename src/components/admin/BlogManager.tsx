import { useEffect, useState } from 'react';
import { blogApi } from '../../services/api';
import type { Blog } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({ 
    tags: [], 
    published: false,
    content: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await blogApi.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate slug from title if not exists
      const blogData = {
        ...currentBlog,
        slug: currentBlog.slug || currentBlog.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (currentBlog.id) {
        await blogApi.update(currentBlog.id, blogData);
      } else {
        await blogApi.create(blogData);
      }
      loadBlogs();
      setIsEditing(false);
      setCurrentBlog({ tags: [], published: false, content: '' });
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogApi.delete(id);
        loadBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
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
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-black">Manage Blog Posts</h2>
        <Button size="sm" onClick={() => { setIsEditing(true); setCurrentBlog({ tags: [], published: false, content: '' }); }}>
          <Plus className="w-3 h-3 mr-1.5" />
          Add Blog Post
        </Button>
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
                <div className="flex gap-2 mb-2">
                  <Input
                    className="h-8 text-sm"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" size="sm" onClick={addTag}>Add Tag</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentBlog.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeTag(i)}>
                      {tag} ×
                    </Badge>
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
                <Button type="submit" size="sm">Save</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setIsEditing(false); setCurrentBlog({ tags: [], published: false, content: '' }); }}>
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
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(blog)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleDelete(blog.id)}>
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {blog.excerpt && (
                <p className="text-xs text-gray-700 mb-2">{blog.excerpt}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {blog.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs h-5">{tag}</Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Created: {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}