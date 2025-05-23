
// worker.ts
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'HEAVY_COMPUTATION':
      const result = performHeavyComputation(data);
      self.postMessage({ type: 'COMPUTATION_RESULT', result });
      break;
  }
});

function performHeavyComputation(data: any) {
  // Heavy computation logic
  return data;
}

// useWorker.ts
import { useRef, useEffect } from 'react';

export const useWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url));
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runComputation = (data: any) => {
    workerRef.current?.postMessage({ type: 'HEAVY_COMPUTATION', data });
  };

  return { runComputation };
};
