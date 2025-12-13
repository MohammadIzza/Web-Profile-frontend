import { useEditor, EditorContent } from '@tiptap/react';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { CustomImage } from './CustomImage';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Strike } from '@tiptap/extension-strike';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import { Typography } from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Focus } from '@tiptap/extension-focus';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Youtube } from '@tiptap/extension-youtube';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { API_BASE_URL } from '../constants';
import { common, createLowlight } from 'lowlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageEditDialog, { type ImageAttributes } from './ImageEditDialog';
import EmojiPicker from 'emoji-picker-react';
import './editor.css';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubIcon,
  Superscript as SupIcon,
  List,
  ListOrdered,
  ListChecks,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Code2,
  Table as TableIcon,
  Quote,
  Minus,
  Youtube as YoutubeIcon,
  Palette,
  Highlighter,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
  Smile,
  Undo,
  Redo,
  Save,
  Download,
  Upload,
  Eye,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentImageAttrs, setCurrentImageAttrs] = useState<ImageAttributes>({
    src: '',
    alt: '',
    width: '',
    height: '',
    align: 'left',
    caption: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        hardBreak: false,
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      CustomImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Start writing your amazing content... (Type "/" for commands)',
      }),
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-auto border-collapse',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      HorizontalRule,
      Youtube.configure({
        width: 640,
        height: 360,
        controls: true,
        HTMLAttributes: {
          class: 'youtube-embed',
        },
      }),
      Gapcursor,
      Dropcursor.configure({
        color: '#3b82f6',
        width: 2,
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      HardBreak,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              const file = items[i].getAsFile();
              if (file) {
                event.preventDefault();
                handleImageUpload(file);
                return true;
              }
            }
          }
        }
        return false;
      },
      handleClickOn: (view, pos, node, nodePos, event) => {
        if (node.type.name === 'image') {
          const attrs = node.attrs;
          setCurrentImageAttrs({
            src: attrs.src,
            alt: attrs.alt || '',
            width: attrs.width || '',
            height: attrs.height || '',
            align: attrs.align || 'left',
            caption: attrs.caption || '',
          });
          setIsImageDialogOpen(true);
        }
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('admin_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        const fullUrl = `${API_BASE_URL}${data.url}`;
        editor?.chain().focus().setImage({ 
          src: fullUrl,
          alt: '',
          align: 'center',
        }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleImageSave = (attributes: ImageAttributes) => {
    if (editor) {
      editor.chain().focus().updateAttributes('image', attributes).run();
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
  };

  const exportAsHTML = () => {
    if (editor) {
      const html = editor.getHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blog-post.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportAsJSON = () => {
    if (editor) {
      const json = editor.getJSON();
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blog-post.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const addImage = () => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  const [linkUrl, setLinkUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [imageUrl, setImageUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fontSize, setFontSize] = useState('16');

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <>
      <div className={`border rounded-lg ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 max-h-40 overflow-y-auto">
        {/* Font Family Selector */}
        <Select
          value={editor?.getAttributes('textStyle').fontFamily || 'default'}
          onValueChange={(value) => {
            if (value === 'default') {
              editor?.chain().focus().unsetFontFamily().run();
            } else {
              editor?.chain().focus().setFontFamily(value).run();
            }
          }}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Text formatting */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('subscript') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          title="Subscript"
        >
          <SubIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('superscript') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          title="Superscript"
        >
          <SupIcon className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-16"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    editor?.chain().focus().setColor(textColor).run();
                  }}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {['#000000', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#ecf0f1', '#95a5a6'].map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setTextColor(color);
                      editor?.chain().focus().setColor(color).run();
                    }}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label>Highlight Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="h-8 w-16"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    editor?.chain().focus().setHighlight({ color: highlightColor }).run();
                  }}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {['#ffff00', '#90EE90', '#87CEEB', '#FFB6C1', '#FFA500', '#DDA0DD'].map(color => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setHighlightColor(color);
                      editor?.chain().focus().setHighlight({ color }).run();
                    }}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          H4
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 5 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        >
          H5
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 6 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        >
          H6
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('taskList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="Task List"
        >
          <ListChecks className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Text Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Text Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Text Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justify Text"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Image Alignment (when image selected) */}
        {editor.isActive('image') && (
          <>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left', float: 'none' }).run()}
              title="Image Left"
            >
              <span className="text-xs">◀ Left</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center', float: 'none' }).run()}
              title="Image Center"
            >
              <span className="text-xs">◆ Center</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right', float: 'none' }).run()}
              title="Image Right"
            >
              <span className="text-xs">Right ▶</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().updateAttributes('image', { float: 'left', align: 'left' }).run()}
              title="Wrap Text Right"
            >
              <span className="text-xs">📐 Wrap L</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().updateAttributes('image', { float: 'right', align: 'right' }).run()}
              title="Wrap Text Left"
            >
              <span className="text-xs">Wrap R 📐</span>
            </Button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Media */}
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          onClick={addImage}
          title="Upload Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              title="Add Image from URL"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-xs ml-1">URL</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (imageUrl) {
                      editor?.chain().focus().setImage({ src: imageUrl }).run();
                      setImageUrl('');
                    }
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (imageUrl) {
                    editor?.chain().focus().setImage({ src: imageUrl }).run();
                    setImageUrl('');
                  }
                }}
                className="w-full"
              >
                Insert Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" size="sm" variant="ghost" title="Add Link">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label>Insert Link</Label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (linkUrl) {
                      editor?.chain().focus().setLink({ href: linkUrl }).run();
                      setLinkUrl('');
                    }
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (linkUrl) {
                      editor?.chain().focus().setLink({ href: linkUrl }).run();
                      setLinkUrl('');
                    }
                  }}
                  className="flex-1"
                >
                  Insert
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editor?.chain().focus().unsetLink().run()}
                >
                  Remove Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" size="sm" variant="ghost" title="Embed YouTube">
              <YoutubeIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label>YouTube Video URL</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (youtubeUrl) {
                      editor?.commands.setYoutubeVideo({ src: youtubeUrl });
                      setYoutubeUrl('');
                    }
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (youtubeUrl) {
                    editor?.commands.setYoutubeVideo({ src: youtubeUrl });
                    setYoutubeUrl('');
                  }
                }}
                className="w-full"
              >
                Embed Video
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Block Elements */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={insertTable}
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        {/* Table Controls (only show when table is active) */}
        {editor.isActive('table') && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Add Column Before"
            >
              <span className="text-xs">Col ←</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add Column After"
            >
              <span className="text-xs">Col →</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Delete Column"
            >
              <span className="text-xs">❌ Col</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Add Row Before"
            >
              <span className="text-xs">Row ↑</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Row After"
            >
              <span className="text-xs">Row ↓</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete Row"
            >
              <span className="text-xs">❌ Row</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              <span className="text-xs">❌ Table</span>
            </Button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              title="Insert Emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} width={350} height={400} />
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Utility Actions */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={exportAsHTML}
          title="Export as HTML"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={exportAsJSON}
          title="Export as JSON"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Editor */}
      <div 
        className="relative"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-blue-50');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-blue-50');
        }}
        onDrop={(e) => {
          e.currentTarget.classList.remove('bg-blue-50');
        }}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
          Drop images here or paste from clipboard
        </div>
      </div>
      
      {/* Footer with character count */}
      <div className="p-2 border-t bg-gray-50 flex justify-between items-center text-xs text-gray-600">
        <div>
          {editor.storage.characterCount.characters()} characters • {editor.storage.characterCount.words()} words
        </div>
        <div className="flex gap-2">
          <span>💡 Use / for commands</span>
          <span>📝 Markdown supported</span>
        </div>
      </div>
      </div>

      <ImageEditDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onSave={handleImageSave}
        currentAttributes={currentImageAttrs}
      />
    </>
  );
}
