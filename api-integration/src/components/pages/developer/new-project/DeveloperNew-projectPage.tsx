'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Fixed: using next/navigation instead of next/router

interface ProjectFormData {
  name: string;
  location: string;
  description: string;
  totalUnits: number;
  startDate: string;
  completionDate: string;
  constructionCost: number;
  financingCost: number;
  developerMargin: number;
  vatRate: number;
}

const NewProjectPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    location: '',
    description: '',
    totalUnits: 0,
    startDate: '',
    completionDate: '',
    constructionCost: 0,
    financingCost: 0,
    developerMargin: 15,
    vatRate: 13.5,
  });
  const [files, setFiles] = useState<{
    sitePlan: File | null;
    floorPlans: File[] | null;
    images: File[] | null;
    documents: File[] | null;
  }>({
    sitePlan: null,
    floorPlans: null,
    images: null,
    documents: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalUnits' || name === 'constructionCost' || name === 'financingCost' || name === 'developerMargin' || name === 'vatRate'
        ? parseFloat(value) || 0
        : value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'sitePlan' | 'floorPlans' | 'images' | 'documents') => {
    if (!e.target.files) return;
    
    if (type === 'sitePlan') {
      setFiles(prev => ({
        ...prev,
        sitePlan: e.target.files?.[0] || null
      }));
    } else {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => ({
        ...prev,
        [type]: fileArray
      }));
    }
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Here you would implement the API call to save the project
      // For now, we'll just simulate a successful submission
      console.log('Form Data:', formData);
      console.log('Files:', files);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to project dashboard or success page
      alert('Project created successfully!');
      router.push('/developer/projects');
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate project financials
  const calculateFinancials = () => {
    const totalConstructionCost = formData.constructionCost;
    const totalFinancingCost = formData.financingCost;
    const developerMargin = (formData.constructionCost + formData.financingCost) * (formData.developerMargin / 100);
    const vatAmount = (formData.constructionCost + developerMargin) * (formData.vatRate / 100);
    const totalProjectCost = totalConstructionCost + totalFinancingCost + developerMargin + vatAmount;
    const costPerUnit = formData.totalUnits > 0 ? totalProjectCost / formData.totalUnits : 0;
    
    return {
      totalConstructionCost,
      totalFinancingCost,
      developerMargin,
      vatAmount,
      totalProjectCost,
      costPerUnit
    };
  };
  
  const financials = calculateFinancials();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#2B5273] mb-2">Create New Development Project</h1>
        <p className="text-gray-600 mb-8">Complete the form below to set up a new property development project.</p>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#2B5273]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-[#2B5273] bg-[#2B5273] text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="text-sm mt-1">Basic Info</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-[#2B5273]' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#2B5273]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-[#2B5273] bg-[#2B5273] text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="text-sm mt-1">Files</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-[#2B5273]' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#2B5273]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-[#2B5273] bg-[#2B5273] text-white' : 'border-gray-300'}`}>
                3
              </div>
              <span className="text-sm mt-1">Financials</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 4 ? 'bg-[#2B5273]' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-[#2B5273]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 4 ? 'border-[#2B5273] bg-[#2B5273] text-white' : 'border-gray-300'}`}>
                4
              </div>
              <span className="text-sm mt-1">Review</span>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#2B5273] mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Development Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="e.g., Fitzgerald Gardens"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="e.g., Drogheda, Co. Louth"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  placeholder="Provide a detailed description of the development..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Units *
                  </label>
                  <input
                    type="number"
                    id="totalUnits"
                    name="totalUnits"
                    value={formData.totalUnits}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
                
                <div>
                  <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Completion *
                  </label>
                  <input
                    type="date"
                    id="completionDate"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-6 rounded-md transition duration-300"
                >
                  Next: Upload Files
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: File Uploads */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#2B5273] mb-4">Upload Files</h2>
              
              <div className="mb-6">
                <label htmlFor="sitePlan" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Plan *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                  <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your site plan here, or click to browse</p>
                  <p className="text-xs text-gray-400 mb-4">Accepted formats: PDF, PNG, JPG (max 10MB)</p>
                  <input
                    type="file"
                    id="sitePlan"
                    name="sitePlan"
                    onChange={(e) => handleFileChange(e, 'sitePlan')}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('sitePlan')?.click()}
                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Browse Files
                  </button>
                  {files.sitePlan && (
                    <div className="mt-4 text-sm text-green-600">
                      File selected: {files.sitePlan.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="floorPlans" className="block text-sm font-medium text-gray-700 mb-1">
                  Floor Plans
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                  <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop floor plans here, or click to browse</p>
                  <p className="text-xs text-gray-400 mb-4">Accepted formats: PDF, PNG, JPG (max 10MB each)</p>
                  <input
                    type="file"
                    id="floorPlans"
                    name="floorPlans"
                    onChange={(e) => handleFileChange(e, 'floorPlans')}
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('floorPlans')?.click()}
                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Browse Files
                  </button>
                  {files.floorPlans && files.floorPlans.length > 0 && (
                    <div className="mt-4 text-sm text-green-600">
                      {files.floorPlans.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                  Development Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                  <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop images here, or click to browse</p>
                  <p className="text-xs text-gray-400 mb-4">Accepted formats: PNG, JPG (max 5MB each)</p>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={(e) => handleFileChange(e, 'images')}
                    accept=".png,.jpg,.jpeg"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('images')?.click()}
                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Browse Files
                  </button>
                  {files.images && files.images.length > 0 && (
                    <div className="mt-4 text-sm text-green-600">
                      {files.images.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                  <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop documents here, or click to browse</p>
                  <p className="text-xs text-gray-400 mb-4">Accepted formats: PDF, DOC, DOCX (max 20MB each)</p>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    onChange={(e) => handleFileChange(e, 'documents')}
                    accept=".pdf,.doc,.docx"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('documents')?.click()}
                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Browse Files
                  </button>
                  {files.documents && files.documents.length > 0 && (
                    <div className="mt-4 text-sm text-green-600">
                      {files.documents.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  Back: Basic Info
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!files.sitePlan}
                  className={`${!files.sitePlan ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B5273] hover:bg-[#1E3142]'} text-white font-medium py-2 px-6 rounded-md transition duration-300`}
                >
                  Next: Financials
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Financials */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#2B5273] mb-4">Financial Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="constructionCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Construction Cost (€) *
                  </label>
                  <input
                    type="number"
                    id="constructionCost"
                    name="constructionCost"
                    value={formData.constructionCost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
                
                <div>
                  <label htmlFor="financingCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Financing Cost (€) *
                  </label>
                  <input
                    type="number"
                    id="financingCost"
                    name="financingCost"
                    value={formData.financingCost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="developerMargin" className="block text-sm font-medium text-gray-700 mb-1">
                    Developer Margin (%) *
                  </label>
                  <input
                    type="number"
                    id="developerMargin"
                    name="developerMargin"
                    value={formData.developerMargin}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
                
                <div>
                  <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Rate (%) *
                  </label>
                  <input
                    type="number"
                    id="vatRate"
                    name="vatRate"
                    value={formData.vatRate}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Construction Cost:</p>
                    <p className="text-lg font-medium">€{financials.totalConstructionCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Financing Cost:</p>
                    <p className="text-lg font-medium">€{financials.totalFinancingCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Developer Margin:</p>
                    <p className="text-lg font-medium">€{financials.developerMargin.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">VAT Amount:</p>
                    <p className="text-lg font-medium">€{financials.vatAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Project Cost:</p>
                    <p className="text-lg font-medium text-[#2B5273]">€{financials.totalProjectCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cost Per Unit:</p>
                    <p className="text-lg font-medium text-[#2B5273]">€{financials.costPerUnit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  Back: Upload Files
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-6 rounded-md transition duration-300"
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#2B5273] mb-4">Review Project Details</h2>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Basic Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.location}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.description}</dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Total Units</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.totalUnits}</dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'N/A'} to {formData.completionDate ? new Date(formData.completionDate).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Uploaded Files</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Site Plan</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {files.sitePlan ? files.sitePlan.name : 'No file uploaded'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Floor Plans</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {files.floorPlans && files.floorPlans.length > 0
                          ? `${files.floorPlans.length} file(s) uploaded`
                          : 'No files uploaded'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Development Images</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {files.images && files.images.length > 0
                          ? `${files.images.length} file(s) uploaded`
                          : 'No files uploaded'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Additional Documents</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {files.documents && files.documents.length > 0
                          ? `${files.documents.length} file(s) uploaded`
                          : 'No files uploaded'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Financial Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Construction Cost</dt>
                      <dd className="mt-1 text-sm text-gray-900">€{formData.constructionCost.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Financing Cost</dt>
                      <dd className="mt-1 text-sm text-gray-900">€{formData.financingCost.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Developer Margin</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.developerMargin}% (€{financials.developerMargin.toLocaleString()})</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">VAT</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.vatRate}% (€{financials.vatAmount.toLocaleString()})</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Project Cost</dt>
                      <dd className="mt-1 text-sm font-semibold text-[#2B5273]">€{financials.totalProjectCost.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cost Per Unit</dt>
                      <dd className="mt-1 text-sm font-semibold text-[#2B5273]">€{financials.costPerUnit.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  Back: Financials
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B5273] hover:bg-[#1E3142]'} text-white font-medium py-2 px-6 rounded-md transition duration-300 flex items-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewProjectPage;