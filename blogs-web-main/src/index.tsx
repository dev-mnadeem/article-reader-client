import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/literata/400.css';
import '@fontsource/literata/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const App = React.lazy(() => import('./App'));

root.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </React.StrictMode>
);
