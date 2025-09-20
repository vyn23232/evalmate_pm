# EvalMate - Online Peer Evaluation Tool

EvalMate is a comprehensive web-based platform designed to facilitate structured, fair, and anonymous peer evaluations during group projects. The system serves both students and faculty members with tailored interfaces and functionality.

## 🚀 Project Overview

This is the frontend implementation of EvalMate, built with React 19 and Vite. The application focuses on creating an intuitive, responsive user interface that will later be connected to backend services and a database.

## 📋 Features

### For Students
- **Dashboard**: Overview of evaluation activities, statistics, and quick actions
- **Group Management**: View group memberships and project details
- **Evaluation Forms**: Submit anonymous peer evaluations with rating scales and comments
- **Profile Management**: Manage personal information and preferences
- **Activity Tracking**: Monitor evaluation history and upcoming deadlines

### For Faculty
- **Administrative Dashboard**: Overview of all evaluation activities and analytics
- **Form Builder**: Create custom evaluation forms with various question types
- **Group Management**: Create, assign, and manage student groups
- **Reports & Analytics**: View detailed evaluation results and export data
- **Progress Monitoring**: Track evaluation completion and participation

## 🛠️ Technology Stack

- **React 19**: Modern React with hooks and context API
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing and navigation
- **CSS Modules**: Modular CSS architecture with separate stylesheets
- **ES6+**: Modern JavaScript features

## 🚦 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🔐 Authentication & Demo

The application includes a mock authentication system for development purposes:

### Demo Credentials
- **Student Demo**: `student@demo.com` / `demo123`
- **Faculty Demo**: `faculty@demo.com` / `demo123`

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Adaptive grid layouts, touch-friendly interactions  
- **Mobile**: Collapsible sidebar, single-column layouts, optimized spacing

---

**Built with ❤️ for better peer evaluation experiences**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
