'use client';

// components/construction/SnagListItem.tsx
import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiFileText, FiImage, FiUser } from 'react-icons/fi';
// Import necessary type from react-icons
import { IconType } from 'react-icons';

interface SnagListItemProps {
  snag: {
    id: string;
    description: string;
    location: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    status: 'open' | 'assigned' | 'fixed' | 'verified';
    assignedToName?: string;
    createdAt: string;
    dueDate?: string;
    completedDate?: string;
    hasImages: boolean;
    hasNotes: boolean;
  };
  onView: () => void;
  onAssign?: () => void;
  onMarkFixed?: () => void;
  onVerify?: () => void;
}

const SnagListItem: React.FC<SnagListItemProps> = ({ 
  snag, 
  onView, 
  onAssign, 
  onMarkFixed, 
  onVerify 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'fixed':
        return 'bg-blue-100 text-blue-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    const renderIcon = (Icon: IconType, className: string) => (
      React.createElement(Icon, { className })
    );

    switch (status) {
      case 'open':
        return renderIcon(FiAlertCircle, "h-5 w-5 text-red-600");
      case 'assigned':
        return renderIcon(FiUser, "h-5 w-5 text-yellow-600");
      case 'fixed':
        return renderIcon(FiCheckCircle, "h-5 w-5 text-blue-600");
      case 'verified':
        return renderIcon(FiCheckCircle, "h-5 w-5 text-green-600");
      default:
        return null;
    }
  };

  const isOverdue = () => {
    if (!snag.dueDate || snag.status === 'verified' || snag.status === 'fixed') return false;

    const now = new Date();
    const dueDate = new Date(snag.dueDate);

    return dueDate <now;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="mr-4">
            {getStatusIcon(snag.status)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{snag.description}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(snag.priority)}`}>
                {snag.priority.charAt(0).toUpperCase() + snag.priority.slice(1)} Priority
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(snag.status)}`}>
                {snag.status.charAt(0).toUpperCase() + snag.status.slice(1)}
              </span>
              {snag.category && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {snag.category}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onView}
          className="text-[#2B5273] hover:text-[#1E3142] text-sm"
        >
          View Details
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <span className="block text-xs text-gray-500">Location</span>
          <span>{snag.location}</span>
        </div>

        {snag.assignedToName && (
          <div>
            <span className="block text-xs text-gray-500">Assigned To</span>
            <span className="flex items-center">
              {React.createElement(FiUser, { className: "mr-1" })}
              {snag.assignedToName}
            </span>
          </div>
        )}

        <div>
          <span className="block text-xs text-gray-500">Created</span>
          <span>{new Date(snag.createdAt).toLocaleDateString()}</span>
        </div>

        {snag.dueDate && (
          <div>
            <span className="block text-xs text-gray-500">Due Date</span>
            <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
              {isOverdue() && React.createElement(FiAlertCircle, { className: "inline mr-1" })}
              {new Date(snag.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {snag.completedDate && (
          <div>
            <span className="block text-xs text-gray-500">Completed</span>
            <span>{new Date(snag.completedDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        {snag.hasImages && (
          <div className="flex items-center">
            {React.createElement(FiImage, { className: "mr-1" })}
            <span>Has photos</span>
          </div>
        )}

        {snag.hasNotes && (
          <div className="flex items-center">
            {React.createElement(FiFileText, { className: "mr-1" })}
            <span>Has notes</span>
          </div>
        )}
      </div>

      {(onAssign || onMarkFixed || onVerify) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3 justify-end">
          {snag.status === 'open' && onAssign && (
            <button
              onClick={onAssign}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Assign
            </button>
          )}

          {snag.status === 'assigned' && onMarkFixed && (
            <button
              onClick={onMarkFixed}
              className="px-3 py-1 border border-[#2B5273] rounded-md text-sm text-[#2B5273] hover:bg-blue-50"
            >
              Mark as Fixed
            </button>
          )}

          {snag.status === 'fixed' && onVerify && (
            <button
              onClick={onVerify}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              Verify Fix
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SnagListItem;