'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Zap, 
  FileText,
  Building2,
  Droplets,
  Home,
  Wifi,
  Truck,
  Plus,
  Save,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Hash,
  Edit3,
  Copy,
  RefreshCw,
  Settings,
  Info,
  Shield,
  Star,
  Award,
  Database,
  Globe,
  ArrowLeft
} from 'lucide-react';

// Irish utility providers and government bodies
const IRISH_SERVICE_PROVIDERS = {
  homebond: {
    name: 'Homebond',
    description: 'Structural defects insurance and warranty provider',
    icon: <Home className="w-5 h-5" />,
    color: 'blue',
    website: 'https://www.homebond.ie',
    applications: [
      {
        type: 'new_home_warranty',
        name: 'New Home Warranty Application',
        forms: ['HB-001', 'HB-002', 'HB-003'],
        estimatedTime: '30-45 minutes',
        cost: '€1,200 - €2,500 per unit'
      },
      {
        type: 'structural_warranty',
        name: 'Structural Warranty Application',
        forms: ['HB-SW-001'],
        estimatedTime: '20-30 minutes',
        cost: '€800 - €1,500 per unit'
      }
    ]
  },
  irish_water: {
    name: 'Irish Water (Uisce Éireann)',
    description: 'National water and wastewater utility provider',
    icon: <Droplets className="w-5 h-5" />,
    color: 'cyan',
    website: 'https://www.water.ie',
    applications: [
      {
        type: 'new_connection',
        name: 'New Water Connection Application',
        forms: ['IW-NC-001', 'IW-NC-002'],
        estimatedTime: '45-60 minutes',
        cost: '€1,500 - €5,000 depending on connection type'
      },
      {
        type: 'wastewater_connection',
        name: 'Wastewater Connection Application',
        forms: ['IW-WW-001'],
        estimatedTime: '30-45 minutes',
        cost: '€2,000 - €8,000 depending on capacity'
      }
    ]
  },
  esb: {
    name: 'ESB Networks',
    description: 'Electricity supply and distribution network operator',
    icon: <Zap className="w-5 h-5" />,
    color: 'yellow',
    website: 'https://www.esbnetworks.ie',
    applications: [
      {
        type: 'new_electricity_connection',
        name: 'New Electricity Connection Application',
        forms: ['ESB-NEC-001', 'ESB-NEC-002'],
        estimatedTime: '30-45 minutes',
        cost: '€1,000 - €15,000 depending on capacity and distance'
      },
      {
        type: 'temporary_supply',
        name: 'Temporary Electricity Supply',
        forms: ['ESB-TS-001'],
        estimatedTime: '15-20 minutes',
        cost: '€500 - €2,000'
      }
    ]
  },
  gas_networks: {
    name: 'Gas Networks Ireland',
    description: 'Natural gas transmission and distribution system operator',
    icon: <Building2 className="w-5 h-5" />,
    color: 'orange',
    website: 'https://www.gasnetworks.ie',
    applications: [
      {
        type: 'new_gas_connection',
        name: 'New Gas Connection Application',
        forms: ['GNI-NGC-001', 'GNI-NGC-002'],
        estimatedTime: '40-55 minutes',
        cost: '€1,200 - €8,000 depending on location and capacity'
      }
    ]
  },
  broadband: {
    name: 'National Broadband Ireland',
    description: 'National broadband infrastructure provider',
    icon: <Wifi className="w-5 h-5" />,
    color: 'purple',
    website: 'https://nbi.ie',
    applications: [
      {
        type: 'fibre_connection',
        name: 'Fibre Broadband Connection',
        forms: ['NBI-FC-001'],
        estimatedTime: '20-30 minutes',
        cost: '€500 - €2,000 per connection'
      }
    ]
  },
  waste_management: {
    name: 'Local Authority Waste Management',
    description: 'Municipal waste collection and management services',
    icon: <Truck className="w-5 h-5" />,
    color: 'green',
    website: 'varies by local authority',
    applications: [
      {
        type: 'waste_collection_permit',
        name: 'Waste Collection Permit Application',
        forms: ['LA-WCP-001'],
        estimatedTime: '25-35 minutes',
        cost: '€200 - €800 annually per unit'
      }
    ]
  }
};

// Pre-filled project data templates
const PROJECT_DATA_TEMPLATES = {
  'fitzgerald-gardens': {
    developerName: 'Prop.ie Development Ltd',
    developerAddress: '123 Development Street, Cork, Ireland',
    developerContact: 'John O\'Sullivan',
    developerPhone: '+353 21 123 4567',
    developerEmail: 'john.osullivan@propie.ie',
    siteAddress: 'Fitzgerald Gardens, Ballincollig, Cork',
    projectDescription: 'Premium residential development featuring 15 luxury units with modern amenities',
    totalUnits: 15,
    projectValue: '€5,200,000',
    planningRef: 'CK24/12345',
    architect: 'Cork Architecture Partners',
    engineer: 'Murphy & Associates Engineers'
  },
  'ballymakenny-view': {
    developerName: 'Prop.ie Development Ltd',
    developerAddress: '123 Development Street, Cork, Ireland',
    developerContact: 'Mary Murphy',
    developerPhone: '+353 41 987 6543',
    developerEmail: 'mary.murphy@propie.ie',
    siteAddress: 'Ballymakenny View, Drogheda, Co. Louth',
    projectDescription: 'High-quality residential development with 20 family homes',
    totalUnits: 20,
    projectValue: '€7,600,000',
    planningRef: 'LH23/67890',
    architect: 'Louth Architects',
    engineer: 'Northeast Engineers'
  },
  'ellwood': {
    developerName: 'Prop.ie Development Ltd',
    developerAddress: '123 Development Street, Cork, Ireland',
    developerContact: 'David Kelly',
    developerPhone: '+353 1 456 7890',
    developerEmail: 'david.kelly@propie.ie',
    siteAddress: 'Ellwood Development, Dublin 15',
    projectDescription: 'Completed luxury residential development with 46 units',
    totalUnits: 46,
    projectValue: '€18,500,000',
    planningRef: 'DU22/45678',
    architect: 'Dublin Architecture Firm',
    engineer: 'Structural Engineers Ltd'
  }
};

interface AutomaticDocumentFillersProps {
  onSave?: (applicationData: any) => void;
  onCancel?: () => void;
  projectId?: string;
}

export default function AutomaticDocumentFillers({
  onSave,
  onCancel,
  projectId
}: AutomaticDocumentFillersProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('homebond');
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [applicationData, setApplicationData] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'generate' | 'review'>('select');
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [statusChecking, setStatusChecking] = useState(false);

  // Load provider statistics on component mount
  useEffect(() => {
    loadProviderStatistics();
  }, []);

  // Load applications when provider or project changes
  useEffect(() => {
    if (selectedProvider) {
      loadApplications();
    }
  }, [selectedProvider, projectId]);

  const loadProviderStatistics = async () => {
    try {
      const response = await axios.get('/api/documents/automation', {
        params: { action: 'statistics' }
      });
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Error loading provider statistics:', error);
    }
  };

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/documents/automation', {
        params: {
          providerName: selectedProvider,
          projectId: projectId || undefined
        }
      });
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-populate with project data if available
  const projectData = projectId ? PROJECT_DATA_TEMPLATES[projectId] : null;

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedApplication('');
    setApplicationData({});
    setCurrentStep('select');
  };

  const handleApplicationSelect = (applicationType: string) => {
    setSelectedApplication(applicationType);
    
    // Pre-populate with project data
    if (projectData) {
      setApplicationData({
        ...projectData,
        applicationType,
        applicationDate: new Date().toISOString().split('T')[0]
      });
    }
    
    setCurrentStep('configure');
  };

  const handleDataChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateApplication = async () => {
    try {
      setIsGenerating(true);
      setCurrentStep('generate');
      
      // Validate required fields before generating
      const validationResult = validateApplicationData(selectedProvider, selectedApplication, applicationData);
      if (!validationResult.isValid) {
        alert(`⚠️ Validation Error\n\n${validationResult.errors.join('\n')}\n\nPlease complete all required fields.`);
        setCurrentStep('configure');
        return;
      }
      
      // Create application using document automation API
      const response = await axios.post('/api/documents/automation', {
        providerName: selectedProvider,
        applicationType: selectedApplication,
        projectId: projectId || undefined,
        formData: applicationData,
        estimatedCost: IRISH_SERVICE_PROVIDERS[selectedProvider].applications.find(
          app => app.type === selectedApplication
        )?.cost,
        estimatedTime: IRISH_SERVICE_PROVIDERS[selectedProvider].applications.find(
          app => app.type === selectedApplication
        )?.estimatedTime
      });
      
      setApplicationData(prev => ({
        ...prev,
        ...response.data.data,
        generatedAt: new Date().toISOString(),
        documentId: response.data.data.id,
        formFields: response.data.data.formFields || prev
      }));
      
      setCurrentStep('review');
    } catch (error: any) {
      console.error('Error generating application:', error);
      const errorMessage = error.response?.data?.message || 'Failed to generate application. Please try again.';
      alert(`❌ Generation Failed\n\n${errorMessage}`);
      setCurrentStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to validate application data
  const validateApplicationData = (provider: string, applicationType: string, data: any) => {
    const errors: string[] = [];
    
    // Common required fields
    if (!data.siteAddress && !data.projectAddress) {
      errors.push('• Site/Project address is required');
    }
    if (!data.planningRef && !data.planningReference) {
      errors.push('• Planning reference number is required');
    }
    
    // Provider-specific validation
    switch (provider) {
      case 'homebond':
        if (!data.projectName && !data.projectDescription) {
          errors.push('• Project name is required for Homebond applications');
        }
        if (!data.totalUnits || parseInt(data.totalUnits) < 1) {
          errors.push('• Total units must be specified and greater than 0');
        }
        if (!data.expectedCompletionDate) {
          errors.push('• Expected completion date is required');
        }
        break;
        
      case 'irish_water':
        if (!data.applicantName && !data.developerName && !data.contactName) {
          errors.push('• Applicant name is required for Irish Water applications');
        }
        if (!data.applicantEmail && !data.developerEmail && !data.contactEmail) {
          errors.push('• Contact email is required for Irish Water applications');
        }
        if (!data.unitsCount && !data.totalUnits) {
          errors.push('• Number of units is required');
        }
        break;
        
      case 'esb':
        if (!data.applicantName && !data.developerName && !data.contactName) {
          errors.push('• Applicant name is required for ESB applications');
        }
        if (!data.applicantEmail && !data.developerEmail && !data.contactEmail) {
          errors.push('• Contact email is required for ESB applications');
        }
        if (applicationType === 'temporary_supply') {
          if (!data.startDate) {
            errors.push('• Start date is required for temporary supply');
          }
          if (!data.endDate) {
            errors.push('• End date is required for temporary supply');
          }
        } else {
          if (!data.loadRequirement) {
            errors.push('• Load requirement is required for electricity connections');
          }
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSaveApplication = async () => {
    try {
      setIsGenerating(true);
      
      // Map application data to provider-specific format
      const mappedApplicationData = mapApplicationDataForProvider(
        selectedProvider,
        selectedApplication,
        applicationData
      );
      
      // Submit to real utility provider API
      const response = await axios.post('/api/utilities/submit', {
        provider: selectedProvider,
        applicationType: selectedApplication,
        applicationData: mappedApplicationData
      });
      
      const submissionResult = response.data.data;
      
      const completeApplicationData = {
        ...applicationData,
        provider: selectedProvider,
        applicationType: selectedApplication,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        // Include real submission details
        realSubmission: {
          applicationId: submissionResult.applicationId,
          referenceNumber: submissionResult.referenceNumber,
          status: submissionResult.status,
          estimatedProcessingTime: submissionResult.estimatedProcessingTime,
          nextSteps: submissionResult.nextSteps,
          documents: submissionResult.documents
        }
      };

      if (onSave) {
        onSave(completeApplicationData);
      }
      
      // Show detailed success message
      const nextStepsText = submissionResult.nextSteps?.join('\n• ') || 'Contact provider for next steps';
      alert(`✅ Application submitted successfully to ${provider.name}!\n\n` +
            `📋 Reference: ${submissionResult.referenceNumber}\n` +
            `⏱️ Processing Time: ${submissionResult.estimatedProcessingTime}\n\n` +
            `🔄 Next Steps:\n• ${nextStepsText}`);
      
      // Refresh applications list
      await loadApplications();
      
      // Reset to initial state
      setCurrentStep('select');
      setSelectedApplication('');
      setApplicationData({});
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      const errorCode = error.response?.data?.code;
      const providerName = error.response?.data?.provider;
      
      if (error.response?.status === 429) {
        alert(`⚠️ Rate Limit Exceeded\n\n${errorMessage}\n\nPlease wait ${error.response.data.retryAfter || 60} seconds before trying again.`);
      } else if (error.response?.status === 502) {
        alert(`🔌 ${providerName?.toUpperCase() || 'Provider'} Service Error\n\n${errorMessage}\n\nCode: ${errorCode}\n\nPlease try again later or contact support.`);
      } else if (error.response?.status === 501) {
        alert(`🚧 Feature Not Available\n\n${errorMessage}\n\nThis feature is under development.`);
      } else {
        alert(`❌ Submission Failed\n\n${errorMessage}\n\nPlease check your data and try again.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to map application data to provider-specific format
  const mapApplicationDataForProvider = (
    provider: string, 
    applicationType: string, 
    data: any
  ) => {
    const baseMapping = {
      applicantName: data.developerName || data.contactName || data.applicantName,
      applicantEmail: data.developerEmail || data.contactEmail || data.applicantEmail,
      siteAddress: data.siteAddress || data.projectAddress,
      planningReference: data.planningRef || data.planningReference
    };

    switch (provider) {
      case 'homebond':
        return {
          developerId: data.developerId || 'PROP-DEV-001',
          projectName: data.projectName || data.projectDescription,
          projectAddress: baseMapping.siteAddress,
          totalUnits: parseInt(data.totalUnits) || 1,
          unitTypes: data.unitTypes || [{
            type: 'Standard Residential',
            count: parseInt(data.totalUnits) || 1,
            floorArea: parseFloat(data.averageFloorArea) || 100
          }],
          expectedCompletionDate: data.expectedCompletionDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          planningReference: baseMapping.planningReference,
          buildingControlReference: data.buildingControlReference
        };

      case 'irish_water':
        return {
          applicantName: baseMapping.applicantName,
          applicantEmail: baseMapping.applicantEmail,
          siteAddress: baseMapping.siteAddress,
          propertyType: data.propertyType || 'residential',
          unitsCount: parseInt(data.totalUnits) || parseInt(data.unitsCount) || 1,
          estimatedDemand: parseFloat(data.estimatedDemand) || (parseInt(data.totalUnits) || 1) * 200,
          estimatedDischarge: parseFloat(data.estimatedDischarge) || (parseInt(data.totalUnits) || 1) * 150,
          connectionType: data.connectionType || 'new',
          plannedConnectionDate: data.plannedConnectionDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          planningReference: baseMapping.planningReference
        };

      case 'esb':
        if (applicationType === 'temporary_supply') {
          return {
            applicantName: baseMapping.applicantName,
            applicantEmail: baseMapping.applicantEmail,
            siteAddress: baseMapping.siteAddress,
            supplyDuration: data.supplyDuration || '12 months',
            loadRequirement: parseFloat(data.loadRequirement) || 50,
            startDate: data.startDate || new Date().toISOString().split('T')[0],
            endDate: data.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
        } else {
          return {
            applicantName: baseMapping.applicantName,
            applicantEmail: baseMapping.applicantEmail,
            siteAddress: baseMapping.siteAddress,
            connectionType: data.connectionType || 'domestic',
            loadRequirement: parseFloat(data.loadRequirement) || (parseInt(data.totalUnits) || 1) * 10,
            unitsCount: parseInt(data.totalUnits) || parseInt(data.unitsCount) || 1,
            plannedConnectionDate: data.plannedConnectionDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            planningReference: baseMapping.planningReference,
            buildingType: data.buildingType || 'Residential Development'
          };
        }

      default:
        return baseMapping;
    }
  };

  // Function to check application status
  const checkApplicationStatus = async (applicationId: string, provider: string) => {
    try {
      setStatusChecking(true);
      
      const response = await axios.get('/api/utilities/status', {
        params: {
          provider,
          applicationId
        }
      });
      
      const statusData = response.data.data;
      setApplicationStatus(statusData);
      
      // Show status in a more user-friendly format
      const statusMessage = `📋 Application Status: ${statusData.status}\n` +
                          `🔄 Last Updated: ${new Date(statusData.lastUpdated).toLocaleString()}\n` +
                          `📝 Notes: ${statusData.notes || 'No additional notes'}`;
      
      alert(statusMessage);
      
    } catch (error: any) {
      console.error('Error checking application status:', error);
      
      if (error.response?.status === 501) {
        alert('🚧 Status checking is not yet available for this provider.\n\nPlease contact the provider directly or check their website.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to check application status.';
        alert(`❌ Status Check Failed\n\n${errorMessage}`);
      }
    } finally {
      setStatusChecking(false);
    }
  };

  // Function to handle quick actions
  const handleQuickAction = async (action: string, data?: any) => {
    switch (action) {
      case 'refresh_applications':
        await loadApplications();
        break;
      case 'check_status':
        if (data?.applicationId && data?.provider) {
          await checkApplicationStatus(data.applicationId, data.provider);
        }
        break;
      case 'download_documents':
        // Placeholder for document download functionality
        alert('📄 Document download functionality will be available soon.');
        break;
      case 'copy_reference':
        if (data?.referenceNumber) {
          navigator.clipboard.writeText(data.referenceNumber);
          alert(`📋 Reference number copied: ${data.referenceNumber}`);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const provider = IRISH_SERVICE_PROVIDERS[selectedProvider];
  const application = provider?.applications.find(app => app.type === selectedApplication);

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Automatic Document Fillers</h1>
                <p className="text-gray-600">Pre-filled applications for Irish utility providers and government bodies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Settings className="w-4 h-4" />
                Configure Templates
              </button>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { id: 'select', label: 'Select Provider', icon: <Building2 className="w-4 h-4" /> },
              { id: 'configure', label: 'Configure Details', icon: <Edit3 className="w-4 h-4" /> },
              { id: 'generate', label: 'Generate Application', icon: <RefreshCw className="w-4 h-4" /> },
              { id: 'review', label: 'Review & Submit', icon: <CheckCircle className="w-4 h-4" /> }
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  currentStep === step.id 
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : index < ['select', 'configure', 'generate', 'review'].indexOf(currentStep)
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  {step.icon}
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < ['select', 'configure', 'generate', 'review'].indexOf(currentStep)
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Provider Selection */}
        {currentStep === 'select' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service Provider</h3>
              <p className="text-gray-600 mb-6">Choose the Irish utility provider or government body for your application.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(IRISH_SERVICE_PROVIDERS).map(([id, serviceProvider]) => (
                <div
                  key={id}
                  onClick={() => handleProviderSelect(id)}
                  className={`border rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedProvider === id 
                      ? `border-${serviceProvider.color}-300 bg-${serviceProvider.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-${serviceProvider.color}-100 rounded-lg flex items-center justify-center`}>
                      {serviceProvider.icon}
                    </div>
                    {selectedProvider === id && (
                      <CheckCircle className={`w-6 h-6 text-${serviceProvider.color}-600`} />
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{serviceProvider.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{serviceProvider.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Available Applications:</div>
                    {serviceProvider.applications.map(app => (
                      <div key={app.type} className="text-xs text-gray-700">
                        • {app.name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a 
                      href={serviceProvider.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-3 h-3" />
                      Visit Website
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedProvider && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Application Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.applications.map(app => (
                    <div
                      key={app.type}
                      onClick={() => handleApplicationSelect(app.type)}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{app.name}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{app.estimatedTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Forms: {app.forms.join(', ')}</p>
                      <p className="text-xs text-green-600 font-medium">{app.cost}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Configure Details */}
        {currentStep === 'configure' && provider && application && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configure Application Details</h3>
                <p className="text-gray-600">{provider.name} - {application.name}</p>
              </div>
              <button
                onClick={() => setCurrentStep('select')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Selection
              </button>
            </div>
            
            {projectData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Project Data Pre-loaded</h4>
                </div>
                <p className="text-blue-800 text-sm">
                  Information for {projectData.developerName} project has been automatically populated.
                  You can modify any details below.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Developer Information */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Developer Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        value={applicationData.developerName || ''}
                        onChange={(e) => handleDataChange('developerName', e.target.value)}
                        placeholder="Prop.ie Development Ltd"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Address *</label>
                      <textarea
                        value={applicationData.developerAddress || ''}
                        onChange={(e) => handleDataChange('developerAddress', e.target.value)}
                        placeholder="123 Development Street, Cork, Ireland"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                        <input
                          type="text"
                          value={applicationData.developerContact || ''}
                          onChange={(e) => handleDataChange('developerContact', e.target.value)}
                          placeholder="John O'Sullivan"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          value={applicationData.developerPhone || ''}
                          onChange={(e) => handleDataChange('developerPhone', e.target.value)}
                          placeholder="+353 21 123 4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={applicationData.developerEmail || ''}
                        onChange={(e) => handleDataChange('developerEmail', e.target.value)}
                        placeholder="john.osullivan@propie.ie"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Project Information */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Project Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Address *</label>
                      <textarea
                        value={applicationData.siteAddress || ''}
                        onChange={(e) => handleDataChange('siteAddress', e.target.value)}
                        placeholder="Fitzgerald Gardens, Ballincollig, Cork"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                      <textarea
                        value={applicationData.projectDescription || ''}
                        onChange={(e) => handleDataChange('projectDescription', e.target.value)}
                        placeholder="Premium residential development featuring 15 luxury units..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                        <input
                          type="number"
                          value={applicationData.totalUnits || ''}
                          onChange={(e) => handleDataChange('totalUnits', e.target.value)}
                          placeholder="15"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Value</label>
                        <input
                          type="text"
                          value={applicationData.projectValue || ''}
                          onChange={(e) => handleDataChange('projectValue', e.target.value)}
                          placeholder="€5,200,000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Planning Reference</label>
                      <input
                        type="text"
                        value={applicationData.planningRef || ''}
                        onChange={(e) => handleDataChange('planningRef', e.target.value)}
                        placeholder="CK24/12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Architect</label>
                        <input
                          type="text"
                          value={applicationData.architect || ''}
                          onChange={(e) => handleDataChange('architect', e.target.value)}
                          placeholder="Cork Architecture Partners"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engineer</label>
                        <input
                          type="text"
                          value={applicationData.engineer || ''}
                          onChange={(e) => handleDataChange('engineer', e.target.value)}
                          placeholder="Murphy & Associates Engineers"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Application Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Application Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{provider.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Application Type:</span>
                      <span className="font-medium">{application.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Forms Required:</span>
                      <span className="font-medium">{application.forms.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-medium text-green-600">{application.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{application.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <button
                onClick={generateApplication}
                disabled={!applicationData.developerName || !applicationData.siteAddress}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                Generate Application Documents
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generate Application */}
        {currentStep === 'generate' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <RefreshCw className={`w-8 h-8 text-green-600 ${isGenerating ? 'animate-spin' : ''}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isGenerating ? 'Generating Application Documents...' : 'Generation Complete!'}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {isGenerating 
                ? 'We\'re automatically filling out your application forms with the provided information. This may take a few moments.'
                : 'Your application documents have been successfully generated and are ready for review.'
              }
            </p>
            
            {isGenerating && (
              <div className="mt-8 w-full max-w-md">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">Processing forms and documents...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 'review' && provider && application && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Generated Application</h3>
                <p className="text-gray-600">{provider.name} - {application.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep('configure')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Details
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={handleSaveApplication}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Application
                </button>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-green-900">Application Successfully Generated</h4>
              </div>
              <p className="text-green-800 mb-4">
                Your {application.name} has been automatically completed with the provided information.
                All required forms have been filled out according to {provider.name} specifications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h5 className="font-medium text-gray-900">Generated Forms</h5>
                  </div>
                  <div className="space-y-1">
                    {application.forms.map(form => (
                      <div key={form} className="text-sm text-gray-700">• {form}.pdf</div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h5 className="font-medium text-gray-900">Next Steps</h5>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>• Review all documents</div>
                    <div>• Submit to {provider.name}</div>
                    <div>• Track application status</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <h5 className="font-medium text-gray-900">Estimated Cost</h5>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium text-lg text-purple-600">{application.cost}</div>
                    <div className="text-xs">Processing time: {application.estimatedTime}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Application Summary */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900">Application Summary</h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Developer Information</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Company:</span> {applicationData.developerName}</div>
                      <div><span className="text-gray-600">Contact:</span> {applicationData.developerContact}</div>
                      <div><span className="text-gray-600">Phone:</span> {applicationData.developerPhone}</div>
                      <div><span className="text-gray-600">Email:</span> {applicationData.developerEmail}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Project Information</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Site:</span> {applicationData.siteAddress}</div>
                      <div><span className="text-gray-600">Units:</span> {applicationData.totalUnits}</div>
                      <div><span className="text-gray-600">Value:</span> {applicationData.projectValue}</div>
                      <div><span className="text-gray-600">Planning Ref:</span> {applicationData.planningRef}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}