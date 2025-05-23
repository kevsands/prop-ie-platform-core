"use client";

import { useState } from 'react';
import { MediaUpload, MediaFile, ImagePreview, WatermarkImage } from '@/components/media';

export default function TestMediaPage() {
  const [filessetFiles] = useState<MediaFile[]>([]);
  const [editingFilesetEditingFile] = useState<MediaFile | null>(null);
  const [watermarkingFilesetWatermarkingFile] = useState<MediaFile | null>(null);
  const [editedFilesetEditedFile] = useState<MediaFile | null>(null);

  const handleFilesChange = (newFiles: MediaFile[]) => {
    setFiles(newFiles);
  };

  const handleEditFile = (file: MediaFile) => {
    setEditingFile(file);
    setWatermarkingFile(null);
  };

  const handleWatermarkFile = (file: MediaFile) => {
    setWatermarkingFile(file);
    setEditingFile(null);
  };

  const handleSaveEdit = (editedFile: MediaFile) => {
    setEditedFile(editedFile);
    setEditingFile(null);

    // Update the file in the files array
    const newFiles = files.map(file => 
      file.id === editedFile.id ? editedFile : file
    );
    setFiles(newFiles);
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setWatermarkingFile(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Media Component Test</h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Media Upload Component */}
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Media Upload</h2>
          <MediaUpload
            files={files}
            onFilesChange={handleFilesChange}
            maxFiles={10}
            maxSizeInMB={10}
            allowedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']}
            label="Upload Media Files"
            helpText="JPG, PNG, PDF up to 10MB each"
          />
        </div>

        {/* Simple file actions */}
        {files.length> 0 && !editingFile && !watermarkingFile && (
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 flex flex-col">
                  <p className="font-medium text-gray-900 mb-2 truncate">{file.name}</p>

                  {file.type.startsWith('image/') && (
                    <div className="h-40 overflow-hidden rounded-md mb-3 bg-gray-100 flex items-center justify-center">
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="object-contain h-full w-full" 
                        />
                      ) : (
                        <div className="text-gray-400">No preview</div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-2 flex space-x-2">
                    {file.type.startsWith('image/') && (
                      <>
                        <button
                          onClick={() => handleEditFile(file)}
                          className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleWatermarkFile(file)}
                          className="flex-1 bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                        >
                          Watermark
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Editor */}
        {editingFile && (
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Image Editor</h2>
            <ImagePreview
              file={editingFile}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              maxWidth={800}
              maxHeight={500}
            />
          </div>
        )}

        {/* Watermark Tool */}
        {watermarkingFile && (
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Watermark Tool</h2>
            <WatermarkImage
              file={watermarkingFile}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              watermarkText="Property Name"
              position="bottom-right"
            />
          </div>
        )}

        {/* Result */}
        {editedFile && (
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Edited Result</h2>
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
              {editedFile.type.startsWith('image/') && editedFile.preview ? (
                <img 
                  src={editedFile.preview} 
                  alt={editedFile.name} 
                  className="max-w-full max-h-96 object-contain" 
                />
              ) : (
                <div className="text-gray-400">No preview available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}