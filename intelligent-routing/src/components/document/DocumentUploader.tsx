'use client';

import React, { useState, ChangeEvent } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, FileText, Image, FileArchive } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentCategory as DocumentCategoryEnum } from '@/hooks/useDocuments';

// Document category interface for UI
interface DocumentCategoryItem {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  documentCount: number;
  completionStatus: string;
}

interface DocumentUploaderProps {
  onUpload: (file: File, metadata: any) => Promise<void>;
  onCancel: () => void;
  categories: DocumentCategoryItem[];
  isUploading?: boolean;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
}

const formSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  description: z.string().optional(),
  category: z.string({
    required_error: 'Please select a category',
  }),
  tags: z.string().optional(),
  expiryDate: z.string().optional(),
  signatureRequired: z.boolean().default(false),
});

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  onCancel,
  categories,
  isUploading = false,
  maxSizeMB = 10,
  allowedFileTypes = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.jpg', '.jpeg', '.png'],
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      tags: '',
      expiryDate: '',
      signatureRequired: false,
    },
  });
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File | undefined) => {
    if (!file) {
      setFileError('No file selected');
      setSelectedFile(null);
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      setSelectedFile(null);
      return;
    }
    
    // Validate file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedFileTypes.includes(fileExtension) && !allowedFileTypes.includes('*')) {
      setFileError(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
      setSelectedFile(null);
      return;
    }
    
    // Set form name to file name by default if empty
    if (!form.getValues('name')) {
      form.setValue('name', file.name.split('.')[0]);
    }
    
    setFileError(null);
    setSelectedFile(file);
  };
  
  const getFileIcon = (file: File) => {
    const fileType = file.type.toLowerCase();
    if (fileType.includes('pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <Image className="h-12 w-12 text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-12 w-12 text-blue-700" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-12 w-12 text-green-600" />;
    } else {
      return <FileArchive className="h-12 w-12 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFile) {
      setFileError('Please select a file to upload');
      return;
    }
    
    const metadata = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
    };
    
    await onUpload(selectedFile, metadata);
  };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* File Upload Area */}
            <div 
              className={`
                border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
                ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
                ${selectedFile ? 'bg-gray-50' : ''}
              `}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={allowedFileTypes.join(',')}
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div className="flex-grow text-left">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop a file or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: {allowedFileTypes.join(', ')} (Max {maxSizeMB}MB)
                  </p>
                </div>
              )}
            </div>
            
            {fileError && (
              <p className="text-sm text-red-500">{fileError}</p>
            )}
            
            {/* Document Metadata */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter document description" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter tags separated by commas" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="signatureRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Requires Signature</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable if this document needs to be signed
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedFile || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploader;