"use client";

import React, { useState, useEffect } from 'react';
import { MediaManager, MediaFile, MediaCategory } from '@/components/media';
import { FiSave, FiRefreshCw, FiUpload } from 'react-icons/fi';

// Mock data for initial categories and files
const initialCategories: MediaCategory[] = [
  { id: 'development-images', name: 'Development Images', files: [] },
  { id: 'floor-plans', name: 'Floor Plans', files: [] },
  { id: 'brochures', name: 'Brochures', files: [] },
  { id: 'site-photos', name: 'Site Photos', files: [] }
];

export default function DeveloperMediaPage() {
  const [categoriessetCategories] = useState<MediaCategory[]>(initialCategories);
  const [isLoadingsetIsLoading] = useState(false);
  const [isSavingsetIsSaving] = useState(false);
  const [projectIdsetProjectId] = useState<string>("fitzgerald-gardens"); // For demo purposes
  const [saveMessagesetSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load media from API
  useEffect(() => {
    const loadProjectMedia = async () => {
      setIsLoading(true);
      try {
        // Fetch media from API
        const response = await fetch(`/api/projects/${projectId}/media`);

        if (!response.ok) {
          throw new Error(`Failed to load media: ${response.status}`);
        }

        const data = await response.json();

        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {

        // Fallback to mock data for demonstration
        const mockImageUrls = [
          '/images/developments/fitzgerald-gardens.jpg',
          '/images/developments/ballymakenny-view.jpg',
          '/images/developments/riverside-manor.jpg'];

        // Create mock media files
        const mockDevelopmentImages = mockImageUrls.map((urlindex) => ({
          name: `development-image-${index + 1}.jpg`,
          size: 1024 * 1024 * (1 + Math.random()),
          type: 'image/jpeg',
          preview: url,
          id: `dev-img-${index + 1}`} as MediaFile));

        // Update categories with mock files
        setCategories(prev => prev.map(category => {
          if (category.id === 'development-images') {
            return { ...category, files: mockDevelopmentImages };
          }
          return category;
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectMedia();
  }, [projectId]);

  // Handle adding media files to a category
  const handleAddMedia = (files: MediaFile[], categoryId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, files: [...category.files, ...files] }
          : category
      )
    );

    // Show success message
    setSaveMessage({ type: 'success', text: `${files.length} files added to ${categoryId}` });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Handle removing media files
  const handleRemoveMedia = (fileId: string, categoryId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, files: category.files.filter(file => file.id !== fileId) }
          : category
      )
    );
  };

  // Handle adding a new category
  const handleAddCategory = (category: MediaCategory) => {
    setCategories(prev => [...prevcategory]);
  };

  // Handle saving all changes
  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      // Send data to the API
      const response = await fetch(`/api/projects/${projectId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories })
      });

      if (!response.ok) {
        throw new Error(`Failed to save media: ${response.status}`);
      }

      const result = await response.json();

      // Show success message
      setSaveMessage({ type: 'success', text: 'All media saved successfully' });
    } catch (error) {

      setSaveMessage({ type: 'error', text: 'Failed to save media' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Development Media Management</h1>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B5273] hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <FiRefreshCw className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="-ml-0.5 mr-2 h-4 w-4" />
                Save All Media
              </>
            )}
          </button>
        </div>
      </div>

      {/* Project selection would go here in a real app */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Project: Fitzgerald Gardens</h2>
        <p className="text-sm text-gray-600">
          Manage all media assets for this development, including marketing images, floor plans, and brochures.
        </p>
      </div>

      {/* Notification message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-md ${
          saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center">
            <FiRefreshCw className="animate-spin h-8 w-8 text-[#2B5273] mb-2" />
            <p className="text-gray-600">Loading media files...</p>
          </div>
        </div>
      ) : (
        <MediaManager
          categories={categories}
          onAddMedia={handleAddMedia}
          onRemoveMedia={handleRemoveMedia}
          onAddCategory={handleAddCategory}
          maxFiles={50}
          maxSizeInMB={20}
          allowedTypes={[
            'image/jpeg', 
            'image/png', 
            'image/jpg', 
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
          ]}
          title="Development Media"
          className="mb-8"
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-8">
        <h3 className="text-md font-medium text-blue-800 mb-2">Media Management Guidelines</h3>
        <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
          <li>Upload high-quality images (minimum 1920x1080 pixels) for best presentation</li>
          <li>Floor plans should be uploaded as PDF files for best quality</li>
          <li>Ensure all property images are properly staged and professionally photographed</li>
          <li>Brochures should include all relevant property information and specifications</li>
          <li>Site photos should show the development progress and surrounding area</li>
        </ul>
      </div>
    </div>
  );
}