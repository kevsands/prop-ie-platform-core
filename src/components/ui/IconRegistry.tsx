import React from 'react';
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import * as IoIcons from 'react-icons/io5';
import * as MdIcons from 'react-icons/md';
import type { IconType } from 'react-icons';

// Define icon categories
export type IconCategory = 'navigation' | 'action' | 'status' | 'file' | 'social' | 'media';

// Define icon metadata
export interface IconMetadata {
  name: string;
  category: IconCategory;
  tags: string[];
  description: string;
  deprecated?: boolean;
  replacement?: string;
}

// Create icon registry
export const iconRegistry: Record<string, { component: IconType; metadata: IconMetadata }> = {
  // Navigation icons
  'home': {
    component: FiIcons.FiHome,
    metadata: {
      name: 'Home',
      category: 'navigation',
      tags: ['house', 'main', 'dashboard'],
      description: 'Home navigation icon'
    }
  },
  'search': {
    component: FiIcons.FiSearch,
    metadata: {
      name: 'Search',
      category: 'action',
      tags: ['find', 'lookup', 'magnify'],
      description: 'Search action icon'
    }
  },
  'filter': {
    component: FiIcons.FiFilter,
    metadata: {
      name: 'Filter',
      category: 'action',
      tags: ['sort', 'organize', 'refine'],
      description: 'Filter action icon'
    }
  },
  'grid': {
    component: FiIcons.FiGrid,
    metadata: {
      name: 'Grid',
      category: 'navigation',
      tags: ['layout', 'view', 'display'],
      description: 'Grid view icon'
    }
  },
  'list': {
    component: FiIcons.FiList,
    metadata: {
      name: 'List',
      category: 'navigation',
      tags: ['layout', 'view', 'display'],
      description: 'List view icon'
    }
  },
  'map-pin': {
    component: FiIcons.FiMapPin,
    metadata: {
      name: 'Map Pin',
      category: 'navigation',
      tags: ['location', 'place', 'marker'],
      description: 'Location marker icon'
    }
  },
  'maximize': {
    component: FiIcons.FiMaximize2,
    metadata: {
      name: 'Maximize',
      category: 'action',
      tags: ['expand', 'fullscreen', 'enlarge'],
      description: 'Maximize action icon'
    }
  },
  'file': {
    component: FiIcons.FiFile,
    metadata: {
      name: 'File',
      category: 'file',
      tags: ['document', 'paper', 'file'],
      description: 'File icon'
    }
  },
  'file-text': {
    component: FiIcons.FiFileText,
    metadata: {
      name: 'File Text',
      category: 'file',
      tags: ['document', 'text', 'file'],
      description: 'Text file icon'
    }
  },
  'clipboard': {
    component: FiIcons.FiClipboard,
    metadata: {
      name: 'Clipboard',
      category: 'action',
      tags: ['copy', 'paste', 'clipboard'],
      description: 'Clipboard action icon'
    }
  },
  'mail': {
    component: FiIcons.FiMail,
    metadata: {
      name: 'Mail',
      category: 'action',
      tags: ['email', 'message', 'communication'],
      description: 'Mail icon'
    }
  },
  'download': {
    component: FiIcons.FiDownload,
    metadata: {
      name: 'Download',
      category: 'action',
      tags: ['save', 'export', 'download'],
      description: 'Download action icon'
    }
  }
};

// Type guard to check if an icon exists in the registry
export const isIconRegistered = (name: string): name is keyof typeof iconRegistry => {
  return name in iconRegistry;
};

// Hook to get icon metadata
export const useIconMetadata = (name: string) => {
  if (!isIconRegistered(name)) {
    console.warn(`Icon "${name}" is not registered in the icon registry`);
    return null;
  }
  return iconRegistry[name].metadata;
};

// Hook to get all icons by category
export const useIconsByCategory = (category: IconCategory) => {
  return Object.entries(iconRegistry)
    .filter(([_, { metadata }]) => metadata.category === category)
    .map(([name, { component, metadata }]) => ({
      name,
      component,
      metadata
    }));
};

// Hook to search icons by tag
export const useIconsByTag = (tag: string) => {
  return Object.entries(iconRegistry)
    .filter(([_, { metadata }]) => metadata.tags.includes(tag))
    .map(([name, { component, metadata }]) => ({
      name,
      component,
      metadata
    }));
};

// Component to display icon documentation
export const IconDocumentation: React.FC<{ name: string }> = ({ name }) => {
  const metadata = useIconMetadata(name);
  
  if (!metadata) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        Icon "{name}" not found in registry
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">{metadata.name}</h3>
      <p className="text-gray-600">{metadata.description}</p>
      <div className="mt-2">
        <span className="text-sm font-medium">Category:</span>
        <span className="ml-2 text-sm text-gray-600">{metadata.category}</span>
      </div>
      <div className="mt-2">
        <span className="text-sm font-medium">Tags:</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {metadata.tags.map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {metadata.deprecated && (
        <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded">
          <p className="text-sm">
            This icon is deprecated.
            {metadata.replacement && (
              <> Consider using {metadata.replacement} instead.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}; 