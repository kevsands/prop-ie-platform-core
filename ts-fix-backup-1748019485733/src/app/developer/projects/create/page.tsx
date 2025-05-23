'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHome, FiMapPin, FiCalendar, FiDollarSign, FiArrowLeft, FiArrowRight, FiZap, FiCpu, FiSave } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import ProjectBasicInfo from '@/components/developer/projects/create/ProjectBasicInfo';
import LocationSelection from '@/components/developer/projects/create/LocationSelection';
import ProjectFinancials from '@/components/developer/projects/create/ProjectFinancials';
import AIProjectAssistant from '@/components/developer/projects/create/AIProjectAssistant';
import ProjectReview from '@/components/developer/projects/create/ProjectReview';

const steps = [
  { id: 1, title: 'Basic Information', icon: FiHome },
  { id: 2, title: 'Location & Site', icon: FiMapPin },
  { id: 3, title: 'Financials', icon: FiDollarSign },
  { id: 4, title: 'AI Assistant', icon: FiCpu },
  { id: 5, title: 'Review & Submit', icon: FiSave }];

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStepsetCurrentStep] = useState(1);
  const [projectDatasetProjectData] = useState({
    basicInfo: {},
    location: {},
    financials: {},
    aiSuggestions: {});
  const [isSubmittingsetIsSubmitting] = useState(false);

  const handleNext = (data: any) => {
    const stepKey = Object.keys(projectData)[currentStep - 1];
    setProjectData(prev => ({
      ...prev,
      [stepKey]: data}));

    if (currentStep <steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep> 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve3000));

      toast.success('Project created successfully!');
      router.push('/developer/projects');
    } catch (error) {
      toast.error('Failed to create project');
      setIsSubmitting(false);
    }
  };

  const progressValue = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/developer/projects')}
            className="mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Projects
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
              <p className="text-gray-600 mt-2">
                AI-powered project creation wizard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FiZap className="text-yellow-500" />
              <span className="text-sm text-gray-600">AI-Assisted</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  step.id <currentStep
                    ? 'text-green-600'
                    : step.id === currentStep
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id <currentStep
                      ? 'bg-green-100'
                      : step.id === currentStep
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="ml-3 font-medium hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={ opacity: 0, x: 20 }
          animate={ opacity: 1, x: 0 }
          exit={ opacity: 0, x: -20 }
          transition={ duration: 0.3 }
        >
          <Card className="p-8">
            {currentStep === 1 && (
              <ProjectBasicInfo
                data={projectData.basicInfo}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <LocationSelection
                data={projectData.location}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ProjectFinancials
                data={projectData.financials}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <AIProjectAssistant
                projectData={projectData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <ProjectReview
                projectData={projectData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}