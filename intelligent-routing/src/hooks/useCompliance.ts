import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ComplianceData {
  overallScore: number;
  categories: Array<{
    name: string;
    value: number;
  }>;
  regulations: Array<{
    name: string;
    status: 'compliant' | 'warning' | 'non-compliant';
    details: string;
  }>;
  audits: Array<{
    id: string;
    date: Date;
    auditor: string;
    score: number;
    findings: string[];
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    validUntil: Date;
    status: 'active' | 'expiring' | 'expired';
  }>;
}

export function useCompliance() {
  const [complianceData, setComplianceData] = useState<ComplianceData>({
    overallScore: 85,
    categories: [
      { name: 'Data Protection', value: 92 },
      { name: 'AML/KYC', value: 88 },
      { name: 'Consumer Rights', value: 86 },
      { name: 'Environmental', value: 78 },
      { name: 'Fair Trading', value: 84 },
    ],
    regulations: [
      {
        name: 'GDPR',
        status: 'compliant',
        details: 'All data protection requirements met',
      },
      {
        name: 'AML Directive',
        status: 'compliant',
        details: 'Customer due diligence procedures in place',
      },
      {
        name: 'Consumer Protection Act',
        status: 'warning',
        details: 'Terms and conditions need updating',
      },
      {
        name: 'Building Control Act',
        status: 'compliant',
        details: 'All necessary certifications obtained',
      },
    ],
    audits: [],
    certificates: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching compliance data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateComplianceScore = async (category: string, newScore: number) => {
    try {
      // Update local state
      setComplianceData(prev => ({
        ...prev,
        categories: prev.categories.map(cat =>
          cat.name === category ? { ...cat, value: newScore } : cat
        ),
      }));
      
      toast.success(`Updated ${category} compliance score to ${newScore}%`);
    } catch (error) {
      toast.error('Failed to update compliance score');
    }
  };

  const scheduleAudit = async (audit: { date: Date; auditor: string }) => {
    try {
      const newAudit = {
        id: Math.random().toString(36).substr(2, 9),
        ...audit,
        score: 0,
        findings: [],
      };
      
      setComplianceData(prev => ({
        ...prev,
        audits: [...prev.audits, newAudit],
      }));
      
      toast.success('Audit scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule audit');
    }
  };

  const refreshCompliance = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Compliance data refreshed');
    } catch (error) {
      toast.error('Failed to refresh compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    complianceData,
    isLoading,
    updateComplianceScore,
    scheduleAudit,
    refreshCompliance,
  };
}