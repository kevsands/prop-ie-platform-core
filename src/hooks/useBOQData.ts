import { useQuery } from '@tanstack/react-query';

export interface BOQItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  status: 'approved' | 'pending' | 'in_progress' | 'rejected';
  variance: number;
  phaseId?: string;
  contractorId?: string;
  lastUpdated: Date;
}

export interface BOQData {
  items: BOQItem[];
  totalValue: number;
  totalVariance: number;
  completionPercentage: number;
  lastUpdated: Date;
}

export function useBOQData(projectId?: string) {
  return useQuery({
    queryKey: ['boq', projectId],
    queryFn: async (): Promise<BOQData> => {
      if (!projectId) {
        // Return mock data for demonstration
        return {
          items: [
            {
              id: '1',
              category: 'Foundations',
              description: 'Concrete Foundation',
              quantity: 150,
              unit: 'm³',
              rate: 120,
              amount: 18000,
              status: 'approved',
              variance: 5.2,
              phaseId: 'phase-1',
              lastUpdated: new Date()
            },
            {
              id: '2',
              category: 'Structural',
              description: 'Steel Frame',
              quantity: 50,
              unit: 'tonnes',
              rate: 2500,
              amount: 125000,
              status: 'pending',
              variance: -2.1,
              phaseId: 'phase-2',
              lastUpdated: new Date()
            }
          ],
          totalValue: 143000,
          totalVariance: 1.55,
          completionPercentage: 75,
          lastUpdated: new Date()
        };
      }

      // In a real implementation, this would fetch from your API
      const response = await fetch(`/api/projects/${projectId}/boq`);
      if (!response.ok) {
        throw new Error('Failed to fetch BOQ data');
      }
      return response.json();
    },
    enabled: true, // Always enabled for demo, in real app you'd check if projectId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}