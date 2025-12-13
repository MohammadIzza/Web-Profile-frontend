import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => element.style.width || element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { 
            width: attributes.width,
            style: `width: ${attributes.width}${typeof attributes.width === 'number' ? 'px' : ''}`
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.style.height || element.getAttribute('height'),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return { 
            height: attributes.height,
            style: `height: ${attributes.height}${typeof attributes.height === 'number' ? 'px' : ''}`
          };
        },
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.parentElement?.getAttribute('data-align') || 'center',
        renderHTML: () => {
          return {};
        },
      },
      caption: {
        default: null,
        parseHTML: (element) => element.parentElement?.querySelector('.image-caption')?.textContent,
        renderHTML: () => {
          return {};
        },
      },
      float: {
        default: 'none',
        parseHTML: (element) => element.style.float || 'none',
        renderHTML: (attributes) => {
          if (attributes.float && attributes.float !== 'none') {
            return { style: `float: ${attributes.float}` };
          }
          return {};
        },
      },
    };
  },
  
  renderHTML({ HTMLAttributes }) {
    const { align, caption, width, height, float, ...rest } = HTMLAttributes;
    
    let style = '';
    if (width) style += `width: ${width}${typeof width === 'number' ? 'px' : ''}; `;
    if (height) style += `height: ${height}${typeof height === 'number' ? 'px' : ''}; `;
    if (float && float !== 'none') style += `float: ${float}; margin: 0 1rem 1rem ${float === 'left' ? '0' : '1rem'};`;
    
    return [
      'div',
      { 
        class: `image-container image-align-${align || 'center'} ${float !== 'none' ? 'image-float' : ''}`,
        'data-align': align,
        'data-float': float,
        contenteditable: 'false',
      },
      [
        'div',
        { class: 'image-wrapper' },
        [
          'img',
          mergeAttributes(this.options.HTMLAttributes, rest, { 
            style,
            draggable: false,
            class: 'resizable-image'
          }),
        ],
        ['div', { class: 'resize-handle resize-handle-nw' }],
        ['div', { class: 'resize-handle resize-handle-ne' }],
        ['div', { class: 'resize-handle resize-handle-sw' }],
        ['div', { class: 'resize-handle resize-handle-se' }],
      ],
      caption ? ['div', { class: 'image-caption', contenteditable: 'true' }, caption] : ['div', { class: 'image-caption', contenteditable: 'true', 'data-placeholder': 'Add caption...' }],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = `image-container image-align-${node.attrs.align || 'center'}`;
      container.setAttribute('data-align', node.attrs.align || 'center');
      container.contentEditable = 'false';

      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';
      
      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.className = 'resizable-image';
      img.draggable = false;
      
      if (node.attrs.width) img.style.width = `${node.attrs.width}${typeof node.attrs.width === 'number' ? 'px' : ''}`;
      if (node.attrs.height) img.style.height = `${node.attrs.height}${typeof node.attrs.height === 'number' ? 'px' : ''}`;

      // Create resize handles
      const handles = ['nw', 'ne', 'sw', 'se'].map(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-handle-${pos}`;
        return handle;
      });

      wrapper.appendChild(img);
      handles.forEach(handle => wrapper.appendChild(handle));
      
      const caption = document.createElement('div');
      caption.className = 'image-caption';
      caption.contentEditable = 'true';
      caption.textContent = node.attrs.caption || '';
      if (!node.attrs.caption) {
        caption.setAttribute('data-placeholder', 'Add caption...');
      }

      container.appendChild(wrapper);
      container.appendChild(caption);

      // Resize functionality
      let isResizing = false;
      let currentHandle: string | null = null;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;

      handles.forEach((handle, idx) => {
        const position = ['nw', 'ne', 'sw', 'se'][idx];
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          currentHandle = position;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        });
      });

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !currentHandle) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (currentHandle.includes('e')) {
          newWidth = startWidth + deltaX;
        } else if (currentHandle.includes('w')) {
          newWidth = startWidth - deltaX;
        }

        if (currentHandle.includes('s')) {
          newHeight = startHeight + deltaY;
        } else if (currentHandle.includes('n')) {
          newHeight = startHeight - deltaY;
        }

        // Maintain aspect ratio
        const aspectRatio = startWidth / startHeight;
        newHeight = newWidth / aspectRatio;

        if (newWidth > 50) {
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        }
      };

      const handleMouseUp = () => {
        if (isResizing && typeof getPos === 'function') {
          editor.commands.updateAttributes('image', {
            width: `${img.offsetWidth}px`,
            height: `${img.offsetHeight}px`,
          });
        }
        
        isResizing = false;
        currentHandle = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      // Caption update
      caption.addEventListener('blur', () => {
        if (typeof getPos === 'function') {
          editor.commands.updateAttributes('image', {
            caption: caption.textContent || '',
          });
        }
      });

      return {
        dom: container,
        contentDOM: null,
        ignoreMutation: (mutation) => {
          return !container.contains(mutation.target) || container === mutation.target;
        },
      };
    };
  },
});
