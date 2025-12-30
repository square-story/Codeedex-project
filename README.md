# Enterprise RBAC Management System

A robust, full-stack Role-Based Access Control (RBAC) management system built with the MERN stack and TypeScript. The system features granular permission logic, team-level scoping, and comprehensive audit logging.

## 🚀 Features

### Core RBAC & Security
- **Granular Permissions**: 11+ predefined permissions (e.g., `users:read`, `roles:create`).
- **Team-Level Scoping**: Data visibility automatically filtered by `Self`, `Team`, or `Global` scopes.
- **Audit Trail**: Every administrative action (User/Role changes) is immutably logged.
- **JWT Authentication**: Secure sessions with refresh tokens and cookie-based storage.

### Admin Dashboard
- **User Management**: Create and edit users, assign roles, and group by teams.
- **Role Management**: View existing roles and their permission sets.
- **System Logs**: View a complete history of all security-related changes.

### Professional UI/UX
- **Smooth Feedback**: Dedicated loading, error, and empty states for every view.
- **Design System**: Built with Tailwind CSS 4 and shadcn/ui.
- **Security Interceptors**: Global handling of 401 (Unauthorized) and 403 (Forbidden) states.

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, Axios.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB).
- **Validation**: Zod (Backend) & Custom Frontend Validators.

## ⚙️ Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v10+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 2. Backend Installation
```bash
cd backend
pnpm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codeedex-project
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Frontend Installation
```bash
cd frontend
pnpm install
```

### 4. Database Seeding
Initialize the database with default admin, managers, and employees:
```bash
cd backend
pnpm seed
```

## 🏃 Running the Project

### Start Backend
```bash
cd backend
pnpm dev
```

### Start Frontend
```bash
cd frontend
pnpm dev
```

## 🧪 Default Test Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Manager** | `manager@example.com` | `password123` |
| **Employee** | `dev1@example.com` | `password123` |
| **Employee (Other Team)** | `marketer1@example.com` | `password123` |

## 📐 Architecture
The project follows a **Layered Architecture**:
- **Controller**: Handles HTTP requests and responses.
- **Service**: Contains business and permission logic.
- **Repository/Model**: Interacts with the data layer.

Access decisions are enforced at the **Service Layer** on the backend and reflected in the UI via higher-order components (`PermissionRoute`, `Navigation`) on the frontend.
