import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attributes: ImageAttributes) => void;
  currentAttributes: ImageAttributes;
}

export interface ImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
  align?: 'left' | 'center' | 'right';
  caption?: string;
}

export default function ImageEditDialog({
  isOpen,
  onClose,
  onSave,
  currentAttributes,
}: ImageEditDialogProps) {
  const [attributes, setAttributes] = useState<ImageAttributes>(currentAttributes);

  useEffect(() => {
    setAttributes(currentAttributes);
  }, [currentAttributes]);

  const handleSave = () => {
    onSave(attributes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Preview */}
          <div className="flex justify-center p-4 bg-gray-50 rounded">
            <img 
              src={attributes.src} 
              alt={attributes.alt || ''} 
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                width: attributes.width ? `${attributes.width}px` : 'auto',
              }}
            />
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={attributes.alt || ''}
              onChange={(e) => setAttributes({ ...attributes, alt: e.target.value })}
              placeholder="Describe the image"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={attributes.caption || ''}
              onChange={(e) => setAttributes({ ...attributes, caption: e.target.value })}
              placeholder="Image caption"
            />
          </div>

          {/* Width */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={attributes.width || ''}
                onChange={(e) => setAttributes({ ...attributes, width: e.target.value })}
                placeholder="Auto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={attributes.height || ''}
                onChange={(e) => setAttributes({ ...attributes, height: e.target.value })}
                placeholder="Auto"
              />
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-2">
            <Label htmlFor="align">Alignment</Label>
            <Select
              value={attributes.align || 'left'}
              onValueChange={(value) => setAttributes({ ...attributes, align: value as 'left' | 'center' | 'right' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
