'use client';

import React from 'react';
import { DocumentFilter, DocumentStatus, DocumentType, DocumentCategory } from '@/types/document';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface DocumentFilterPanelProps {
  filter: DocumentFilter;
  onFilterChange: (filter: Partial<DocumentFilter>) => void;
  showCategories?: boolean;
}

const DocumentFilterPanel: React.FC<DocumentFilterPanelProps> = ({
  filter,
  onFilterChange,
  showCategories = true
}) => {
  // Toggle a value in an array filter
  const toggleArrayFilter = <T extends any>(
    filterName: keyof DocumentFilter,
    value: T
  ) => {
    const currentValues = (filter[filterName] as T[]) || [];
    const valueExists = currentValues.includes(value);
    
    let newValues: T[];
    if (valueExists) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    onFilterChange({ [filterName]: newValues.length ? newValues : undefined });
  };

  // Clear all filters
  const clearFilters = () => {
    onFilterChange({
      types: undefined,
      statuses: undefined,
      categories: undefined,
      uploadedBy: undefined,
      dateRange: undefined,
      search: undefined,
      tags: undefined
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-xs h-7 px-2"
        >
          Clear All
        </Button>
      </div>
      
      <Separator />
      
      {/* Document Types */}
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="text-sm font-medium">Document Type</h4>
          {open => open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {Object.values(DocumentType).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={(filter.types || []).includes(type)}
                onCheckedChange={() => toggleArrayFilter('types', type)}
              />
              <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Document Status */}
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="text-sm font-medium">Status</h4>
          {open => open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {Object.values(DocumentStatus).map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={(filter.statuses || []).includes(status)}
                onCheckedChange={() => toggleArrayFilter('statuses', status)}
              />
              <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      
      {showCategories && (
        <>
          <Separator />
          
          {/* Document Categories */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h4 className="text-sm font-medium">Category</h4>
              {open => open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {Object.values(DocumentCategory).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={(filter.categories || []).includes(category)}
                    onCheckedChange={() => toggleArrayFilter('categories', category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                    {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  );
};

export default DocumentFilterPanel;