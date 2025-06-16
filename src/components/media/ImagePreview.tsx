'use client';

import React from 'react';

interface ImagePreviewProps {
  file: any;
  onSave: (editedFile: any) => void;
  onCancel: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onSave, onCancel }) => {
  return (
    <div className="image-preview flex flex-col p-4">
      <div className="text-center py-8">
        <p className="text-gray-500">Image preview component is being rebuilt...</p>
        <div className="mt-4 space-x-2">
          <button 
            onClick={() => onSave(file)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;