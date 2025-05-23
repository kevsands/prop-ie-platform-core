"use client";

import React, { useState } from 'react';
import { FiX, FiMaximize2, FiDownload, FiImage, FiFile, FiFileText } from 'react-icons/fi';
import type { MediaFile } from './MediaUpload';

export interface MediaGalleryProps {
  files: MediaFile[];
  onRemove?: (fileId: string) => void;
  viewOnly?: boolean;
  imageSize?: 'sm' | 'md' | 'lg';
  layout?: 'grid' | 'list';
  className?: string;
  title?: string;
  emptyMessage?: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  files,
  onRemove,
  viewOnly = false,
  imageSize = 'md',
  layout = 'grid',
  className = '',
  title = 'Media Gallery',
  emptyMessage = 'No media files available'}) => {
  const [selectedFilesetSelectedFile] = useState<MediaFile | null>(null);

  // Generate human-readable size string
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes <1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes <1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Get file type icon
  const getFileIcon = (file: MediaFile) => {
    if (file.type === 'application/pdf') {
      return <FiFileText className="text-red-500" size={20} />\n  );
    } else if (file.type.startsWith('image/')) {
      return <FiImage className="text-blue-500" size={20} />\n  );
    } else {
      return <FiFile className="text-gray-500" size={20} />\n  );
    }
  };

  // Determine image size classes
  const getImageSizeClass = () => {
    switch (imageSize) {
      case 'sm': return 'h-24 w-24';
      case 'lg': return 'h-48 w-48';
      case 'md':
      default: return 'h-32 w-32';
    }
  };

  // Handle file removal
  const handleRemove = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && file.id) {
      onRemove(file.id);
    }
  };

  // Handle download
  const handleDownload = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();

    // Create a download link
    const url = file.preview || URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up URL object if we created one
    if (!file.preview) {
      URL.revokeObjectURL(url);
    }
  };

  // Open file preview
  const openPreview = (file: MediaFile) => {
    setSelectedFile(file);
  };

  // Close file preview
  const closePreview = () => {
    setSelectedFile(null);
  };

  return (
    <div className={`media-gallery ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      )}

      {files.length === 0 ? (
        <div className="p-4 border border-gray-200 rounded-md text-center text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <>
          {/* Grid Layout */}
          {layout === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file: any) => (
                <div 
                  key={file.id} 
                  className="relative border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => openPreview(file)}
                >
                  {file.type.startsWith('image/') && file.preview ? (
                    <div className="flex flex-col items-center">
                      <div className={`relative ${getImageSizeClass()} overflow-hidden rounded-md mb-2`}>
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="w-full truncate text-xs text-center">{file.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className={`relative ${getImageSizeClass()} flex items-center justify-center bg-gray-100 rounded-md mb-2`}>
                        {getFileIcon(file)}
                      </div>
                      <div className="w-full truncate text-xs text-center">{file.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</div>
                    </div>
                  )}

                  {!viewOnly && (
                    <button
                      type="button"
                      onClick={(e: any) => handleRemove(filee)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 text-red-500"
                      aria-label="Remove file"
                    >
                      <FiX size={16} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e: any) => handleDownload(filee)}
                    className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 text-blue-500"
                    aria-label="Download file"
                  >
                    <FiDownload size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* List Layout */}
          {layout === 'list' && (
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
              {files.map((file: any) => (
                <li 
                  key={file.id} 
                  className="pl-3 pr-4 py-3 flex items-center justify-between text-sm hover:bg-gray-50 cursor-pointer"
                  onClick={() => openPreview(file)}
                >
                  <div className="flex items-center">
                    {getFileIcon(file)}
                    <span className="ml-2 truncate">{file.name}</span>
                    <span className="ml-2 text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-500"
                      onClick={(e: any) => handleDownload(filee)}
                      aria-label="Download file"
                    >
                      <FiDownload size={18} />
                    </button>
                    {!viewOnly && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-500"
                        onClick={(e: any) => handleRemove(filee)}
                        aria-label="Remove file"
                      >
                        <FiX size={18} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closePreview}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {selectedFile.name}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={closePreview}
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="mt-2 flex justify-center">
                      {selectedFile.type.startsWith('image/') && selectedFile.preview ? (
                        <div className="max-h-[70vh] overflow-auto">
                          <img 
                            src={selectedFile.preview} 
                            alt={selectedFile.name} 
                            className="max-w-full h-auto object-contain"
                          />
                        </div>
                      ) : selectedFile.type === 'application/pdf' ? (
                        <div className="h-[70vh] w-full">
                          <object
                            data={URL.createObjectURL(selectedFile)}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                          >
                            <p>Your browser does not support PDFs. <a href={URL.createObjectURL(selectedFile)} download={selectedFile.name}>Download the PDF</a> instead.</p>
                          </object>
                        </div>
                      ) : (
                        <div className="p-10 flex flex-col items-center justify-center text-gray-500">
                          {getFileIcon(selectedFile)}
                          <p className="mt-4">This file type cannot be previewed</p>
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={(e: any) => handleDownload(selectedFilee)}
                          >
                            <FiDownload className="mr-2" />
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closePreview}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2B5273] text-base font-medium text-white hover:bg-[#1E3142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273] sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={(e: any) => handleDownload(selectedFilee)}
                >
                  <FiDownload className="mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;