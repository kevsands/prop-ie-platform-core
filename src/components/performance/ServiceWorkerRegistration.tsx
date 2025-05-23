'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Register service worker
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration: any) => {

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;

              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available

                    // Optional: Show update notification to user
                    if (window.confirm('New version available! Would you like to update?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((error: any) => {

          });
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event: any) => {
        if (event.data.type === 'CACHE_UPDATED') {

        }
      });
    }
  }, []);

  return null;
}