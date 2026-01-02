import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Fetch runtime config from server before mounting so components can read
// window.__RUNTIME_CONFIG__ synchronously from `app/config.ts` if available.
async function bootstrap() {
  try {
    const resp = await fetch('/api/runtime-config');
    if (resp.ok) {
      (window as any).__RUNTIME_CONFIG__ = await resp.json();
    } else {
      (window as any).__RUNTIME_CONFIG__ = {};
    }
  } catch (e) {
    // network error -> fallback to empty
    (window as any).__RUNTIME_CONFIG__ = {};
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();