"use client";

import React, { useState, useEffect } from 'react';
import { FiSave, FiTrash2, FiPlus, FiHelpCircle, FiLoader } from 'react-icons/fi';
import type { IconBaseProps } from 'react-icons';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

// Mock implementations for missing dependencies
// MOCK: useToast hook
const useToast = () => {
  const toast = ({ title, description, variant }: { title: string; description: string; variant: 'success' | 'destructive' | 'default' }) => {
    console.log(`Toast: ${title} - ${description} (${variant})`);
    // In a real implementation, this would show a toast notification
  };
  
  return { toast };
};

// MOCK: useAuth hook
const useAuth = () => {
  return {
    accessToken: 'mock-token',
    isAuthenticated: true,
    user: { id: '1', name: 'Test User', email: 'test@example.com' }
  };
};

// MOCK: useOrganisation hook
const useOrganisation = () => {
  return {
    organisation: { id: '1', name: 'Test Organisation', slug: 'test-org' }
  };
};

// MOCK: getConfig function
const getConfig = (key: string) => {
  const config = {
    apiUrl: 'https://api.example.com'
  };
  return config[key as keyof typeof config] || '';
};

// MOCK: VariablesPanel component
interface VariablesPanelProps {
  fields: Field[];
  onInsert: (variable: string) => void;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ fields, onInsert }) => {
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <h3 className="font-medium text-gray-900 mb-3">Available Variables</h3>
      
      {fields.length === 0 ? (
        <p className="text-sm text-gray-500">No fields defined yet. Add fields to use them as variables.</p>
      ) : (
        <div className="space-y-2">
          {fields.map(field => (
            <div key={field.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                  <p className="font-medium text-sm">{field.label}</p>
                  <p className="text-xs text-gray-500">{`{{${field.name}}}`}</p>
                </div>
              <button
                onClick={() => onInsert(field.name)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-sm mb-2">Standard Variables</h4>
        <div className="space-y-2">
          {['currentDate', 'organisationName', 'userName'].map(variable => (
            <div key={variable} className="flex justify-between items-center py-2 border-b border-gray-100">
              <p className="text-sm">{variable}</p>
              <button
                onClick={() => onInsert(variable)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Define TypeScript interfaces
interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

interface Template {
  id?: string;
  name: string;
  description: string;
  category: string;
  contentHtml: string;
  fields: Field[];
}

interface DocumentGeneratorProps {
  template?: Template;
  mode: 'create' | 'edit';
  onSave?: (template: Template) => void;
}

export default function DocumentGenerator({ template: initialTemplate, mode, onSave }: DocumentGeneratorProps) {
  const router = useRouter();
  const params = useParams() as { orgSlug: string };
  const { orgSlug } = params;
  const { toast } = useToast();
  const { accessToken, isAuthenticated } = useAuth();
  const { organisation } = useOrganisation();
  
  // Default template structure with validation
  const defaultTemplate: Template = {
    name: '',
    description: '',
    category: 'sales',
    contentHtml: '',
    fields: []
  };
  
  const [template, setTemplate] = useState<Template>(initialTemplate || defaultTemplate);
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
      router.push('/login');
    }
  }, [isAuthenticated, accessToken, router]);

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!template.name.trim()) {
      newErrors.name = 'Document name is required';
    }
    
    if (!template.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Validate fields have unique names
    const fieldNames = new Set<string>();
    template.fields.forEach(field => {
      if (!field.name.trim()) {
        newErrors[`field-${field.id}-name`] = 'Field name is required';
      } else if (fieldNames.has(field.name)) {
        newErrors[`field-${field.id}-name`] = 'Field names must be unique';
      } else {
        fieldNames.add(field.name);
      }
      
      if (!field.label.trim()) {
        newErrors[`field-${field.id}-label`] = 'Field label is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContentChange = (content: string) => {
    setTemplate(prev => ({
      ...prev,
      contentHtml: content
    }));
  };
  
  const handleFieldChange = (fieldId: string, key: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, [key]: value } : field
      )
    }));
    
    // Clear any errors for this field
    if (errors[`field-${fieldId}-${key}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`field-${fieldId}-${key}`];
        return newErrors;
      });
    }
  };
  
  const handleAddField = () => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: `field${template.fields.length + 1}`,
      label: `Field ${template.fields.length + 1}`,
      type: 'text',
      required: false
    };
    
    setTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };
  
  const handleRemoveField = (fieldId: string) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    
    // Remove any errors for this field
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`field-${fieldId}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  
  const handleSave = async () => {
    // Validate the form before submitting
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      // API call to save template
      const apiUrl = getConfig('apiUrl');
      const response = await fetch(`${apiUrl}/api/${orgSlug}/templates${mode === 'edit' && initialTemplate?.id ? `/${initialTemplate.id}` : ''}`, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(template),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save template' }));
        throw new Error(typeof errorData === 'object' && errorData !== null && 'message' in errorData 
          ? String(errorData.message) 
          : 'Failed to save template');
      }
      
      // Fix for TypeScript error by explicitly typing the API response
      const responseData = await response.json();
      const data = responseData as Template;
      
      if (onSave) {
        onSave(data);
      }
      
      toast({
        title: 'Success',
        description: `Template ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        variant: 'success'
      });
      
      if (mode === 'create' && data.id) {
        router.push(`/${orgSlug}/templates/${data.id}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${mode === 'edit' ? 'update' : 'create'} template`,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' }
  ];
  
  const categories = [
    { value: 'sales', label: 'Sales Documents' },
    { value: 'legal', label: 'Legal Documents' },
    { value: 'marketing', label: 'Marketing Materials' },
    { value: 'construction', label: 'Construction Documents' },
    { value: 'handover', label: 'Handover Documents' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        {FiLoader({ className: "animate-spin text-[#2B5273] mr-2" })}
        <span>Authentication required...</span>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'edit' ? 'Edit Document Template' : 'Create Document Template'}
        </h2>
        {organisation && (
          <p className="text-sm text-gray-500">
            Organisation: {organisation.name}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={template.name}
                onChange={(e) => {
                  setTemplate(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.name;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                placeholder="Enter document name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={template.description}
                onChange={(e) => {
                  setTemplate(prev => ({ ...prev, description: e.target.value }));
                  if (errors.description) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.description;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                placeholder="Enter document description"
                rows={3}
              ></textarea>
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={template.category}
                onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Document Fields</h3>
          
          <div className="space-y-6">
            {template.fields.map(field => (
              <div key={field.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">{field.label}</h4>
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="text-red-600 hover:text-red-800"
                    type="button"
                    aria-label="Remove field"
                  >
                    {FiTrash2({ className: "text-red-500" })}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors[`field-${field.id}-name`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                    />
                    {errors[`field-${field.id}-name`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`field-${field.id}-name`]}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Use this name in your template: {`{{${field.name}}}`}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                      className={`w-full px-3 py-2 border ${errors[`field-${field.id}-label`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                    />
                    {errors[`field-${field.id}-label`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`field-${field.id}-label`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {(field.type === 'select' || field.type === 'radio') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options (comma separated) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.options?.join(',') || ''}
                        onChange={(e) => handleFieldChange(field.id, 'options', e.target.value.split(',').map(o => o.trim()))}
                        className={`w-full px-3 py-2 border ${errors[`field-${field.id}-options`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                      />
                      {errors[`field-${field.id}-options`] && (
                        <p className="mt-1 text-xs text-red-500">{errors[`field-${field.id}-options`]}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${field.id}`}
                      checked={field.required}
                      onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                      className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                    />
                    <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-700">
                      Required field
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Help Text (optional)
                    </label>
                    <input
                      type="text"
                      value={field.helpText || ''}
                      onChange={(e) => handleFieldChange(field.id, 'helpText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleAddField}
              className="w-full px-4 py-2 flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              type="button"
            >
              {FiPlus({ className: "mr-2" })} Add Field
            </button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Document Content</h3>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowVariablesPanel(!showVariablesPanel)}
                className="px-4 py-2 flex items-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                type="button"
              >
                {FiHelpCircle({ className: "text-gray-400" })} 
                {showVariablesPanel ? 'Hide Variables' : 'Show Variables'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 flex items-center ${
                  isSaving ? 'bg-gray-400' : 'bg-[#2B5273] hover:bg-[#1E3142]'
                } text-white rounded-md transition-colors`}
                type="button"
              >
                {isSaving ? FiLoader({ className: "animate-spin mr-2" }) : FiSave({ className: "mr-2" })}
                {isSaving ? 'Saving...' : 'Save Document'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={showVariablesPanel ? 'md:col-span-2' : 'md:col-span-3'}>
              <div className="border border-gray-300 rounded-md min-h-[500px] relative">
                {/* Rich Text Editor would go here */}
                <textarea
                  value={template.contentHtml}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full min-h-[500px] p-4 focus:outline-none focus:ring-2 focus:ring-[#2B5273] rounded-md"
                  placeholder="Enter your document content here..."
                ></textarea>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Use variables in your content by inserting them with curly braces, for example: {`{{variableName}}`}
              </p>
            </div>
            
            {showVariablesPanel && (
              <div className="md:col-span-1">
                <VariablesPanel 
                  fields={template.fields}
                  onInsert={(variable: string) => {
                    const insertion = `{{${variable}}}`;
                    setTemplate(prev => ({
                      ...prev,
                      contentHtml: prev.contentHtml + insertion
                    }));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}