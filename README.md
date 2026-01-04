# PassAI Frontend - React Study Platform

Modern React + TypeScript frontend for the PassAI adaptive learning platform.

---

## 📋 Overview

Interactive web application for students to upload study materials, take AI-generated quizzes, and track learning progress with adaptive difficulty using Bayesian Knowledge Tracing.

## ✨ Features

- **🔐 Authentication**: Supabase Auth with email/password
- **📚 Material Upload**: Multi-format support (PDF, DOCX, PPTX, Images)
- **🧠 Adaptive Quizzes**: AI-powered question generation with BKT
- **📊 Progress Tracking**: Real-time mastery level monitoring
- **👨‍🏫 Teacher Dashboard**: Class management and analytics
- **🎨 Modern UI**: TailwindCSS + shadcn/ui components
- **⚡ Real-time Updates**: Supabase Realtime subscriptions

---

## 🛠️ Setup

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**
- **Supabase** account

### Installation

1. **Navigate to frontend**
```bash
cd passai-study
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**

Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8000
```

4. **Run database migrations**
```bash
npx supabase db push
```

5. **Start development server**
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   └── layout/         # Layout components
├── features/           # Feature modules
│   ├── auth/           # Authentication
│   ├── subjects/       # Subject management
│   ├── upload/         # Material upload
│   ├── quiz/           # Quiz generation & taking
│   ├── bkt/            # Bayesian Knowledge Tracing
│   └── dashboard/      # Teacher dashboard
├── pages/              # Route pages
├── lib/                # Utilities
│   ├── api/            # API clients
│   └── supabase/       # Supabase client config
├── types/              # TypeScript types
└── hooks/              # Custom React hooks
```

---

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel --prod
```

---

## 📦 Tech Stack

- **React** 18 - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Supabase** - Backend (Auth, DB, Storage, Realtime)
- **React Query** - Data fetching
- **React Router** - Navigation
- **Zustand** - State management

---

## 🗄️ Database Schema

See [supabase/migrations/](./supabase/migrations/) for complete schema.

Key tables:
- `profiles` - User profiles
- `subjects` - Study subjects
- `study_materials` - Uploaded materials
- `study_plans` - Learning plans
- `quiz_questions` - Generated questions
- `quiz_attempts` - Student responses
- `bkt_parameters` - Knowledge tracking

---

## 🔒 Security

- **Row Level Security (RLS)**: All tables protected
- **JWT Authentication**: Supabase token-based auth
- **Environment Variables**: Sensitive data excluded
- **Secure Storage**: Files stored in Supabase Storage with access controls

---

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run linter:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

---

## 📚 Related Documentation

- [Main Project README](../README.md)
- [Backend API](../passai-backend/README.md)
- [Database Migrations](./supabase/migrations/)

---

**Built with ⚡ Vite + React**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
