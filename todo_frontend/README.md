# Todo Frontend

Frontend application for Todo List built with React, TypeScript, Vite and Tailwind CSS.

## Features

- Display todo list
- Create todo
- Update todo
- Delete todo with confirmation modal
- Mark todo as completed or pending
- Search todo by keyword
- Filter todo by status
- Pagination
- Go to specific page
- First / Previous / Next / Last pagination buttons
- Toast notifications
- Character limit for title and description
- Responsive layout
- Clean dashboard-style UI

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Hot Toast

## Project Structure
```text
src
├── api
│   └── todoApi.ts
├── components
│   ├── DeleteConfirmModal.tsx
│   ├── Pagination.tsx
│   ├── TodoEmptyState.tsx
│   ├── TodoFilter.tsx
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   └── TodoLoadingState.tsx
├── pages
│   └── TodoPage.tsx
├── types
│   └── todo.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Setup

Install dependencies:

```bash
npm install
```
Run development server:

```bash
npm run dev
```
Frontend will run at:
```bash
  http://localhost:5173
```

## Environment Variables

Create .env file:
```bash
  VITE_API_BASE_URL=/api/v1
```

The frontend uses Vite proxy to call backend API.
