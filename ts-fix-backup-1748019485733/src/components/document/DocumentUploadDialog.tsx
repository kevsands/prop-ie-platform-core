'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DocumentCategory, DocumentStatus } from './DocumentComplianceTracker';
import { Calendar as CalendarIcon, Upload, File, Loader2, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  documentId?: string; // If provided, we're editing an existing document
  projectId?: string;
  initialData?: {
    name?: string;
    category?: DocumentCategory;
    description?: string;
    deadline?: Date;
    required?: boolean;
  };
  onUploadCompleteAction: (success: boolean) => void;
}

export default function DocumentUploadDialog({
  open,
  onOpenChangeAction,
  documentId,
  projectId,
  initialData,
  onUploadCompleteAction
}: DocumentUploadDialogProps) {
  // Form state
  const [documentNamesetDocumentName] = useState(initialData?.name || '');
  const [categorysetCategory] = useState<DocumentCategory | ''>(initialData?.category || '');
  const [descriptionsetDescription] = useState(initialData?.description || '');
  const [deadlinesetDeadline] = useState<Date | undefined>(initialData?.deadline);
  const [requiredsetRequired] = useState(initialData?.required !== undefined ? initialData.required : true);

  // File upload state
  const [filesetFile] = useState<File | null>(null);
  const [dragActivesetDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [isUploadingsetIsUploading] = useState(false);
  const [uploadProgresssetUploadProgress] = useState(0);
  const [uploadErrorsetUploadError] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  const resetForm = useCallback(() => {
    setDocumentName(initialData?.name || '');
    setCategory(initialData?.category || '');
    setDescription(initialData?.description || '');
    setDeadline(initialData?.deadline);
    setRequired(initialData?.required !== undefined ? initialData.required : true);
    setFile(null);
    setUploadProgress(0);
    setUploadError(null);
  }, [initialData]);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle button click to open file selector
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate form
      if (!documentName || !category || !deadline || !file) {
        throw new Error('Please fill in all required fields and upload a file');
      }

      // In a real implementation, you would upload the file and save the document data
      // For this example, we'll simulate a delay and progress
      const intervalId = setInterval(() => {
        setUploadProgress(prev => {
          if (prev>= 95) {
            clearInterval(intervalId);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve2000));
      clearInterval(intervalId);
      setUploadProgress(100);

      // Simulate successful upload
      setTimeout(() => {
        setIsUploading(false);
        onUploadCompleteAction(true);
        onOpenChangeAction(false);
      }, 500);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'An error occurred during upload');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChangeAction(newOpen);
    }>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{documentId ? 'Update Document' : 'Upload New Document'}</DialogTitle>
            <DialogDescription>
              {documentId 
                ? 'Update document details and upload a new version if needed' 
                : 'Upload a new document for this project'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Document name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as DocumentCategory)}
                required
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="LEGAL">Legal</SelectItem>
                    <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>

            {/* Deadline */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, 'PPP') : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Required */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="required" className="text-right">
                Required
              </Label>
              <RadioGroup 
                defaultValue={required ? "yes" : "no" 
                onValueChange={(value) => setRequired(value === "yes")}
                className="col-span-3 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="required-yes" />
                  <Label htmlFor="required-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="required-no" />
                  <Label htmlFor="required-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* File upload */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                File <span className="text-destructive">*</span>
              </Label>
              <div 
                className={cn(
                  "col-span-3 border-2 border-dashed rounded-md p-6 transition-colors",
                  dragActive ? "border-primary bg-primary/5" : "border-muted",
                  file && "border-green-500 bg-green-50 dark:bg-green-950"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                />

                {!file ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drag & drop your file here</p>
                      <p className="text-sm text-muted-foreground">
                        or <span 
                               className="text-primary cursor-pointer hover:underline" 
                               onClick={onButtonClick}
                             >
                               browse
                            </span>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, DOCX, XLSX, JPG, PNG
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                      style={ width: `${uploadProgress}%` }
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {uploadProgress}% Uploaded
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <p className="text-sm text-destructive">{uploadError}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {documentId ? 'Update Document' : 'Upload Document'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}