# LOLO Frontend 🎶

A modern, feature-rich frontend application for the **LOLO platform** (Living Out Loud Originals), built with **React**, **TypeScript**, **Vite**, and **React Router v7**. This application connects to a Laravel backend to manage events, users, and credits for the SRKR Engineering College music community.

---

## 🚀 Tech Stack

- **[React 19](https://react.dev/)** – UI library with modern hooks and features
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe development
- **[Vite](https://vitejs.dev/)** – Lightning-fast build tool and dev server
- **[React Router v7](https://reactrouter.com/)** – Client-side routing
- **[Tailwind CSS v4](https://tailwindcss.com/)** – Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** – Re-usable component library
- **[Framer Motion](https://www.framer.com/motion/)** – Animation library
- **[React Hook Form](https://react-hook-form.com/)** – Performant form validation
- **[Zod](https://zod.dev/)** – TypeScript-first schema validation
- **[Axios](https://axios-http.com/)** – HTTP client for API requests

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Steps

1. **Clone the repository:**
```bash
   git clone <repository-url>
   cd lolo-frontend
```

2. **Install dependencies:**
```bash
   npm install
   # or
   yarn install
```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
```env
   VITE_API_URL=http://localhost:8000/api
```

4. **Start the development server:**
```bash
   npm run dev
   # or
   yarn dev
```

   The app will be available at `http://localhost:5173`

---

## 🏗️ Project Structure
```
src/
├── assets/          # Static assets (images, fonts, logos)
├── components/      # Reusable UI components
│   ├── common/      # Common components (ScrollToTop, ThemeToggle, etc.)
│   ├── forms/       # Form components (SignUp forms)
│   ├── header/      # Header components (UserDropdown, Notifications)
│   ├── metrics/     # Dashboard metrics components
│   └── ui/          # Base UI components (Button, Input, Table, etc.)
├── context/         # React Context providers (Auth, Theme, Sidebar)
├── icons/           # SVG icons and icon components
├── layouts/         # Layout components (MainLayout, AppLayout, AppSidebar)
├── lib/             # Utility functions and configurations
├── pages/           # Page components
│   ├── Dashboards/  # Dashboard pages for different user roles
│   └── OtherPages/  # Additional pages (NotFound, etc.)
└── main.tsx         # Application entry point
```

---

## 🎨 Features

### 🔐 Authentication
- User login with form validation
- Protected routes with authentication guards
- Session management with local storage
- Role-based access control

### 📊 Dashboard
- User-specific dashboards
- Event registration management
- Credits tracking system
- Responsive data tables with pagination

### 🎵 Event Management
- Browse and register for events
- View registration status
- Payment tracking
- Digital ticket generation

### 💳 Credits System
- Track earned credits
- View credit history
- Filter and search functionality

### 🌗 Theme Support
- Light and dark mode toggle
- Persistent theme preference
- Smooth theme transitions

### 📱 Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🎨 Styling

The project uses **Tailwind CSS v4** with custom configurations:

- **Custom colors**: Brand colors (lolo-red, lolo-pink, lolo-cyan)
- **Custom fonts**: "Astro" for branding, "Outfit" for body text
- **Custom animations**: Pulse and bounce effects
- **Theme variables**: CSS custom properties for dark mode

---

## 🔌 API Integration

The frontend connects to a Laravel backend API. Configure the base URL in your `.env` file:
```typescript
// Example API usage with Axios
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (recommended)
- **Conventional Commits** for commit messages

---

## 🐛 Known Issues

- Browser storage (localStorage, sessionStorage) is not supported in Claude.ai artifacts
- Some form validations require backend confirmation

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**SRKR Engineering College - LOLO Platform Team**

- Music Management System
- Event Coordination
- Student Activities

---

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team
- Visit [https://srkrec.edu.in](https://srkrec.edu.in)

---

## 🎉 Acknowledgments

- SRKR Engineering College
- All contributors and maintainers
- Open source community

---

**Built with ❤️ by the LOLO Team**

*Makes You Say "YoYo"* 🎵
