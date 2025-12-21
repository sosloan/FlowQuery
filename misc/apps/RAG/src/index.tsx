import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializePlugins } from './plugins';

// Initialize FlowQuery plugins before rendering
initializePlugins();

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
