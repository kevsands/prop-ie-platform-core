// Service Worker for Prop.ie with Task Management PWA Support
const CACHE_NAME = 'prop-ie-v1';
const STATIC_CACHE = 'prop-ie-static-v1';
const IMAGE_CACHE = 'prop-ie-images-v1';
const API_CACHE = 'prop-ie-api-v1';
const TASK_CACHE = 'prop-ie-tasks-v1';
const DATA_CACHE_NAME = 'propie-tasks-data-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('prop-ie-') && 
                   cacheName !== CACHE_NAME &&
                   cacheName !== STATIC_CACHE &&
                   cacheName !== IMAGE_CACHE &&
                   cacheName !== API_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API calls - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Images - Cache first, fallback to network
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseToCache = response.clone();
          caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  // Static assets - Cache first, fallback to network
  if (url.pathname.match(/\.(js|css|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  // HTML pages - Network first, fallback to cache, then offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Background sync for offline form submissions and task management
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncOfflineForms());
  } else if (event.tag === 'task-sync') {
    event.waitUntil(syncTasks());
  } else if (event.tag === 'offline-actions') {
    event.waitUntil(syncOfflineActions());
  }
});

async function syncOfflineForms() {
  const cache = await caches.open('offline-forms');
  const requests = await cache.keys();
  
  return Promise.all(
    requests.map(async (request) => {
      const response = await cache.match(request);
      const data = await response.json();
      
      try {
        await fetch(request, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await cache.delete(request);
      } catch (error) {
        console.error('Failed to sync form:', error);
      }
    })
  );
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    clients.openWindow(event.notification.data.primaryKey);
  }
});

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-properties') {
    event.waitUntil(updateProperties());
  }
});

async function updateProperties() {
  try {
    const response = await fetch('/api/properties/updates');
    const data = await response.json();
    
    // Update cache with new data
    const cache = await caches.open(API_CACHE);
    await cache.put('/api/properties', new Response(JSON.stringify(data)));
    
    // Send notification if there are new properties
    if (data.newProperties > 0) {
      self.registration.showNotification('New Properties Available', {
        body: `${data.newProperties} new properties match your search criteria`,
        icon: '/images/icon-192.png',
        badge: '/images/badge-72.png'
      });
    }
  } catch (error) {
    console.error('Failed to update properties:', error);
  }
}

/**
 * Enhanced API request handling for task management
 */
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const cacheStrategy = getAPICacheStrategy(url.pathname);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses for specific API routes
    if (response.ok && shouldCacheAPIRoute(request.url)) {
      const cache = await caches.open(cacheStrategy === 'tasks' ? TASK_CACHE : API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cacheName = cacheStrategy === 'tasks' ? TASK_CACHE : API_CACHE;
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Add offline indicator to response headers
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Served-From', 'cache');
      headers.set('X-Offline-Mode', 'true');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers
      });
    }
    
    // Return offline fallback for API requests
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This data is not available offline',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getAPICacheStrategy(pathname) {
  if (pathname.includes('/tasks') || pathname.includes('/ai/') || pathname.includes('/priority')) {
    return 'tasks';
  }
  return 'default';
}

function shouldCacheAPIRoute(url) {
  const taskRoutes = ['/api/tasks', '/api/ai/suggestions', '/api/priorities', '/api/workload'];
  const propertyRoutes = ['/api/properties', '/api/developments'];
  
  return taskRoutes.some(route => url.includes(route)) || 
         propertyRoutes.some(route => url.includes(route));
}

/**
 * Sync tasks with server
 */
async function syncTasks() {
  try {
    console.log('[ServiceWorker] Syncing tasks');
    
    // Get pending tasks from IndexedDB
    const pendingTasks = await getPendingTasks();
    
    // Sync each pending task
    for (const task of pendingTasks) {
      try {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
        
        // Remove from pending queue
        await removePendingTask(task.id);
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync task:', error);
      }
    }
    
    // Notify clients of successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        payload: { synced: pendingTasks.length }
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed:', error);
  }
}

/**
 * Sync offline actions
 */
async function syncOfflineActions() {
  try {
    console.log('[ServiceWorker] Syncing offline actions');
    
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: action.body ? JSON.stringify(action.body) : undefined
        });
        
        await removePendingAction(action.id);
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync action:', error);
      }
    }
    
    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        payload: { actionsSync: pendingActions.length }
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Offline actions sync failed:', error);
  }
}

/**
 * Message event handler for client communication
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_TASK_DATA':
      cacheTaskData(payload);
      break;
    case 'QUEUE_OFFLINE_ACTION':
      queueOfflineAction(payload);
      break;
  }
});

/**
 * Cache task data for offline use
 */
async function cacheTaskData(data) {
  try {
    const cache = await caches.open(TASK_CACHE);
    await cache.put('/api/tasks/offline', new Response(JSON.stringify({
      tasks: data.tasks,
      timestamp: new Date().toISOString()
    })));
    
    console.log('[ServiceWorker] Task data cached');
  } catch (error) {
    console.error('[ServiceWorker] Failed to cache task data:', error);
  }
}

/**
 * Queue offline action for later sync
 */
async function queueOfflineAction(action) {
  try {
    await addPendingAction(action);
    
    // Register background sync
    if ('sync' in self.registration) {
      await self.registration.sync.register('offline-actions');
    }
    
    console.log('[ServiceWorker] Offline action queued');
  } catch (error) {
    console.error('[ServiceWorker] Failed to queue offline action:', error);
  }
}

/**
 * IndexedDB helper functions for offline storage
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PropIE-PWA', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingTasks')) {
        db.createObjectStore('pendingTasks', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pendingActions')) {
        db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getPendingTasks() {
  const db = await openDB();
  const transaction = db.transaction(['pendingTasks'], 'readonly');
  const store = transaction.objectStore('pendingTasks');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingActions() {
  const db = await openDB();
  const transaction = db.transaction(['pendingActions'], 'readonly');
  const store = transaction.objectStore('pendingActions');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addPendingAction(action) {
  const db = await openDB();
  const transaction = db.transaction(['pendingActions'], 'readwrite');
  const store = transaction.objectStore('pendingActions');
  
  return new Promise((resolve, reject) => {
    const request = store.add(action);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingTask(taskId) {
  const db = await openDB();
  const transaction = db.transaction(['pendingTasks'], 'readwrite');
  const store = transaction.objectStore('pendingTasks');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(taskId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingAction(actionId) {
  const db = await openDB();
  const transaction = db.transaction(['pendingActions'], 'readwrite');
  const store = transaction.objectStore('pendingActions');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(actionId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}