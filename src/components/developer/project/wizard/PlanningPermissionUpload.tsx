"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiFile, FiAlertCircle } from 'react-icons/fi';
import type { IconBaseProps } from 'react-icons';

interface PlanningPermissionUploadProps {
  onSubmit: (data: PlanningPermissionData) => void;
  initialData?: PlanningPermissionData;
}

export interface PlanningPermissionData {
  planningReferenceNumber: string;
  planningSubmissionDate: string;
  planningApprovalDate: string;
  planningPermissionFiles: File[];
}

const PlanningPermissionUpload: React.FC<PlanningPermissionUploadProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlanningPermissionData>({
    defaultValues: initialData || {
      planningReferenceNumber: '',
      planningSubmissionDate: '',
      planningApprovalDate: '',
      planningPermissionFiles: []
    }
  });

  const [filessetFiles] = useState<File[]>([]);
  const [uploadingsetUploading] = useState(false);
  const [uploadErrorsetUploadError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_i: any) => i !== index));
  };

  const handleFormSubmit = (data: PlanningPermissionData) => {
    if (files.length === 0) {
      setUploadError('Please upload at least one planning permission document');
      return;
    }

    setUploading(true);

    // In a real application, you would upload the files to your server here
    // For now, we'll simulate a delay and then call onSubmit
    setTimeout(() => {
      onSubmit({
        ...data,
        planningPermissionFiles: files
      });
      setUploading(false);
    }, 1000);
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    const props: IconBaseProps = {
      className: extension === 'pdf' ? 'text-red-500' : 
                 ['jpg', 'jpeg', 'png'].includes(extension || '') ? 'text-blue-500' :
                 ['dwg', 'dxf'].includes(extension || '') ? 'text-purple-500' : 
                 'text-gray-500'
    };

    switch (extension) {
      case 'pdf':
        return FiFile(props);
      case 'jpg':
      case 'jpeg':
      case 'png':
        return FiFile(props);
      case 'dwg':
      case 'dxf':
        return FiFile(props);
      default:
        return FiFile(props);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Planning Permission</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Planning Reference Number */}
          <div>
            <label htmlFor="planningReferenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Planning Reference Number*
            </label>
            <input
              id="planningReferenceNumber"
              type="text"
              className={`w-full py-2 px-3 border ${
                errors.planningReferenceNumber ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
              placeholder="e.g. PL123456"
              {...register('planningReferenceNumber', { required: 'Planning reference number is required' })}
            />
            {errors.planningReferenceNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.planningReferenceNumber.message}</p>
            )}
          </div>

          {/* Planning Submission Date */}
          <div>
            <label htmlFor="planningSubmissionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Planning Submission Date*
            </label>
            <input
              id="planningSubmissionDate"
              type="date"
              className={`w-full py-2 px-3 border ${
                errors.planningSubmissionDate ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
              {...register('planningSubmissionDate', { required: 'Planning submission date is required' })}
            />
            {errors.planningSubmissionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.planningSubmissionDate.message}</p>
            )}
          </div>

          {/* Planning Approval Date */}
          <div>
            <label htmlFor="planningApprovalDate" className="block text-sm font-medium text-gray-700 mb-1">
              Planning Approval Date*
            </label>
            <input
              id="planningApprovalDate"
              type="date"
              className={`w-full py-2 px-3 border ${
                errors.planningApprovalDate ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
              {...register('planningApprovalDate', { required: 'Planning approval date is required' })}
            />
            {errors.planningApprovalDate && (
              <p className="mt-1 text-sm text-red-600">{errors.planningApprovalDate.message}</p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planning Permission Documents*
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {FiUpload({ className: "mx-auto h-12 w-12 text-gray-400" })}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2B5273] hover:text-[#1E3142]">
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, XLS up to 10MB each
              </p>
            </div>
          </div>

          {uploadError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              {FiAlertCircle({ className: "mr-1" })}
              {uploadError}
            </div>
          )}
        </div>

        {/* File List */}
        {files.length> 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
              {files.map((fileindex: any) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    {getFileIcon(file)}
                    <span className="ml-2 truncate">{file.name}</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="font-medium text-red-600 hover:text-red-500"
                      onClick={() => removeFile(index)}
                    >
                      {FiX({})}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className={`px-4 py-2 ${
              uploading ? 'bg-gray-400' : 'bg-[#2B5273] hover:bg-[#1E3142]'
            } text-white rounded-md transition-colors flex items-center`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Save & Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanningPermissionUpload;