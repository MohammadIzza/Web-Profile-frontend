# Web Profile Frontend

A modern React application for portfolio management with an admin panel.

## Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + Shadcn/ui
- **Rich Text Editor**: TipTap 3.13.0
- **HTTP Client**: Axios
- **Routing**: React Router

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── admin/        # Admin-specific components
│   │   │   ├── BlogManager.tsx
│   │   │   ├── ExperienceManager.tsx
│   │   │   ├── PortfolioManager.tsx
│   │   │   ├── ProfileManager.tsx
│   │   │   └── TechStackManager.tsx
│   │   ├── ui/           # Shadcn/ui components
│   │   ├── CustomImage.ts # TipTap custom image extension
│   │   ├── ImageEditDialog.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RichTextEditor.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useFetch.ts   # Data fetching hook
│   ├── pages/            # Page components
│   │   ├── Admin.tsx
│   │   ├── Home.tsx
│   │   └── Login.tsx
│   ├── services/         # API services
│   │   └── api.ts        # Axios instance and API functions
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── helpers.ts    # Common helper functions
│   ├── constants/        # Constants and configuration
│   │   └── index.ts      # API endpoints, routes, etc.
│   ├── lib/              # Third-party integrations
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
└── package.json
```

## Features

- ✅ Admin panel with sidebar navigation
- ✅ Full CRUD operations for all resources
- ✅ Rich text editor with 25+ features
- ✅ Image upload with drag-drop and editing
- ✅ Authentication context
- ✅ Protected routes
- ✅ Custom hooks for data fetching
- ✅ Utility functions for common tasks
- ✅ Constants management
- ✅ Minimalist UI design (black/white theme)

## Components Organization

### Admin Components
Each resource has its own manager component:
- **ProfileManager**: Single profile view with edit mode
- **PortfolioManager**: List view with CRUD operations
- **BlogManager**: Blog posts with rich text editor
- **ExperienceManager**: Work experience management
- **TechStackManager**: Technology stack management

### Shared Components
- **RichTextEditor**: Full-featured editor with TipTap
- **ImageEditDialog**: Image editing modal
- **ProtectedRoute**: Route guard for authentication
- **UI Components**: Reusable Shadcn/ui components

## Custom Hooks

### useFetch
```typescript
const { data, loading, error, refetch } = useFetch(fetchFunction);
```
Handles data fetching with loading and error states.

## Utilities

### helpers.ts
- `formatDate()`: Format dates to readable strings
- `truncateText()`: Truncate text with ellipsis
- `stripHtml()`: Remove HTML tags from string
- `getFileExtension()`: Extract file extension
- `isValidEmail()`: Validate email format
- `debounce()`: Debounce function calls

## Constants

Centralized configuration in `constants/index.ts`:
- API base URL
- Route paths
- API endpoints
- Authentication credentials

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Best Practices Implemented

1. **Component Organization**: Components grouped by feature
2. **Custom Hooks**: Reusable logic extracted into hooks
3. **Type Safety**: Full TypeScript support
4. **Code Reusability**: Shared components and utilities
5. **Separation of Concerns**: Services, contexts, and components separated
6. **Constants Management**: Centralized configuration
7. **Error Handling**: Proper error states in components
8. **Loading States**: Loading indicators for async operations
9. **Accessibility**: Using Radix UI for accessible components
10. **Performance**: Proper use of React hooks and memoization

## UI/UX Features

- Minimalist black/white color scheme
- Compact and clean layouts
- Sticky navigation
- Hover effects and transitions
- Responsive design
- Inline popovers instead of alerts
- Small text and compact spacing
