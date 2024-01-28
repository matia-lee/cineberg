import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Or any global CSS file you have
import App from './App'; // Assuming your main component is App.tsx
import reportWebVitals from './reportWebVitals'; // Optional, for performance measuring

// Find the root element in your HTML
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root
const root = createRoot(rootElement);

// Initial render: Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The following is optional; used for measuring performance
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
