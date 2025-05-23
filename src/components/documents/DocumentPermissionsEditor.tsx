'use client';

import React, { useState, useEffect } from 'react';
import { Document as DocumentType, DocumentPermissions } from '@/types/document';
import { documentService } from '@/services/documentService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  AlertCircle, 
  Save, 
  X,
  UserPlus,
  Users,
  User,
  Check,
  Eye,
  Pencil,
  Share2,
  Trash2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DocumentPermissionsEditorProps {
  document: DocumentType;
  onSave: () => void;
}

const DocumentPermissionsEditor: React.FC<DocumentPermissionsEditorProps> = ({
  document,
  onSave
}) => {
  const [isLoadingsetIsLoading] = useState(false);
  const [errorsetError] = useState<string | null>(null);
  const [successsetSuccess] = useState<string | null>(null);

  // Initialize permissions from document
  const [isPublicsetIsPublic] = useState(document.permissions?.isPublic || false);
  const [sensitivitysetSensitivity] = useState(document.metadata?.sensitivity || 'standard');
  const [canViewsetCanView] = useState<string[]>(document.permissions?.canView || []);
  const [canEditsetCanEdit] = useState<string[]>(document.permissions?.canEdit || []);
  const [canDeletesetCanDelete] = useState<string[]>(document.permissions?.canDelete || []);
  const [canSharesetCanShare] = useState<string[]>(document.permissions?.canShare || []);

  // Form state for adding users
  const [newUserIdsetNewUserId] = useState('');
  const [newUserNamesetNewUserName] = useState('');
  const [newUserPermissionsetNewUserPermission] = useState<'view' | 'edit' | 'delete' | 'share'>('view');

  // Update form when document changes
  useEffect(() => {
    if (document?.permissions) {
      setIsPublic(document.permissions.isPublic || false);
      setSensitivity(document.metadata?.sensitivity || 'standard');
      setCanView(document.permissions.canView || []);
      setCanEdit(document.permissions.canEdit || []);
      setCanDelete(document.permissions.canDelete || []);
      setCanShare(document.permissions.canShare || []);
    }
  }, [document]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update permissions
      const updatedPermissions: DocumentPermissions = {
        isPublic,
        canView,
        canEdit,
        canDelete,
        canShare,
        canSign: document.permissions?.canSign || []
      };

      const permissionsResult = await documentService.updatePermissions(document.idupdatedPermissions);

      if (!permissionsResult.success) {
        throw new Error(permissionsResult.message || 'Failed to update permissions');
      }

      // Update metadata with sensitivity
      const metadataResult = await documentService.updateDocument(document.id, {
        metadata: {
          ...document.metadata,
          sensitivity
        }
      });

      setSuccess('Permissions updated successfully');
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUserId.trim()) {
      setError('User ID is required');
      return;
    }

    // Add user to selected permission list
    switch (newUserPermission) {
      case 'view':
        if (!canView.includes(newUserId)) {
          setCanView([...canViewnewUserId]);
        }
        break;
      case 'edit':
        if (!canEdit.includes(newUserId)) {
          setCanEdit([...canEditnewUserId]);
          // Also add to view permissions if not already there
          if (!canView.includes(newUserId)) {
            setCanView([...canViewnewUserId]);
          }
        }
        break;
      case 'delete':
        if (!canDelete.includes(newUserId)) {
          setCanDelete([...canDeletenewUserId]);
          // Also add to view permissions if not already there
          if (!canView.includes(newUserId)) {
            setCanView([...canViewnewUserId]);
          }
        }
        break;
      case 'share':
        if (!canShare.includes(newUserId)) {
          setCanShare([...canSharenewUserId]);
          // Also add to view permissions if not already there
          if (!canView.includes(newUserId)) {
            setCanView([...canViewnewUserId]);
          }
        }
        break;
    }

    // Reset form
    setNewUserId('');
    setNewUserName('');
    setNewUserPermission('view');
    setError(null);
  };

  // Handle removing a user from a permission
  const removeUserPermission = (userId: string, permissionType: 'view' | 'edit' | 'delete' | 'share') => {
    switch (permissionType) {
      case 'view':
        setCanView(canView.filter(id => id !== userId));
        // When view permission is removed, also remove other permissions
        setCanEdit(canEdit.filter(id => id !== userId));
        setCanDelete(canDelete.filter(id => id !== userId));
        setCanShare(canShare.filter(id => id !== userId));
        break;
      case 'edit':
        setCanEdit(canEdit.filter(id => id !== userId));
        break;
      case 'delete':
        setCanDelete(canDelete.filter(id => id !== userId));
        break;
      case 'share':
        setCanShare(canShare.filter(id => id !== userId));
        break;
    }
  };

  // Get all unique users
  const allUsers = Array.from(new Set([...canView, ...canEdit, ...canDelete, ...canShare]));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Visibility Section */}
      <div>
        <h3 className="text-sm font-medium mb-3">Document Visibility</h3>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is-public" className="text-base">Public Document</Label>
                <p className="text-sm text-muted-foreground">
                  Make this document visible to all users in the system
                </p>
              </div>
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-base mb-2 block">Sensitivity Level</Label>
              <RadioGroup value={sensitivity} onValueChange={setSensitivity} className="space-y-2">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="low" id="sensitivity-low" className="mt-1" />
                  <div>
                    <Label htmlFor="sensitivity-low" className="text-sm font-medium">Low Sensitivity</Label>
                    <p className="text-xs text-muted-foreground">
                      General information that can be freely shared
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="standard" id="sensitivity-standard" className="mt-1" />
                  <div>
                    <Label htmlFor="sensitivity-standard" className="text-sm font-medium">Standard Sensitivity</Label>
                    <p className="text-xs text-muted-foreground">
                      Business information with controlled distribution
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="confidential" id="sensitivity-confidential" className="mt-1" />
                  <div>
                    <Label htmlFor="sensitivity-confidential" className="text-sm font-medium">Confidential</Label>
                    <p className="text-xs text-muted-foreground">
                      Sensitive information with restricted access
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Permissions Section */}
      <div>
        <h3 className="text-sm font-medium mb-3">User Permissions</h3>
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Add User Form */}
            <div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <Label htmlFor="new-user-id" className="sr-only">User ID</Label>
                  <Input
                    id="new-user-id"
                    placeholder="Enter user ID or email"
                    value={newUserId}
                    onChange={(e: any) => setNewUserId(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="new-user-name" className="sr-only">Display Name (optional)</Label>
                  <Input
                    id="new-user-name"
                    placeholder="Display name (optional)"
                    value={newUserName}
                    onChange={(e: any) => setNewUserName(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-40">
                  <Label htmlFor="new-user-permission" className="sr-only">Permission</Label>
                  <select
                    id="new-user-permission"
                    className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={newUserPermission}
                    onChange={(e: any) => setNewUserPermission(e.target.value as any)}
                  >
                    <option value="view">Can View</option>
                    <option value="edit">Can Edit</option>
                    <option value="share">Can Share</option>
                    <option value="delete">Can Delete</option>
                  </select>
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddUser}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              {error && (
                <p className="text-sm text-destructive mt-2">
                  <AlertCircle className="h-4 w-4 inline-block mr-1" />
                  {error}
                </p>
              )}
            </div>

            <Separator />

            {/* User Permissions List */}
            {allUsers.length === 0 ? (
              <div className="text-center py-4">
                <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">
                  No specific users have been assigned permissions
                </p>
                {isPublic && (
                  <p className="text-xs text-muted-foreground mt-1">
                    This document is public and accessible to all users
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {allUsers.map(userId => (
                  <div key={userId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 border rounded-md">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm font-medium">{userId}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      {canView.includes(userId) && (
                        <Badge 
                          variant="outline" 
                          className="bg-blue-50 flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-4 w-4 ml-1 hover:bg-blue-100" 
                            onClick={() => removeUserPermission(userId, 'view')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}

                      {canEdit.includes(userId) && (
                        <Badge 
                          variant="outline" 
                          className="bg-green-50 flex items-center gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-4 w-4 ml-1 hover:bg-green-100" 
                            onClick={() => removeUserPermission(userId, 'edit')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}

                      {canShare.includes(userId) && (
                        <Badge 
                          variant="outline" 
                          className="bg-purple-50 flex items-center gap-1"
                        >
                          <Share2 className="h-3 w-3" />
                          Share
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-4 w-4 ml-1 hover:bg-purple-100" 
                            onClick={() => removeUserPermission(userId, 'share')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}

                      {canDelete.includes(userId) && (
                        <Badge 
                          variant="outline" 
                          className="bg-red-50 flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-4 w-4 ml-1 hover:bg-red-100" 
                            onClick={() => removeUserPermission(userId, 'delete')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSave}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-b-transparent border-white rounded-full mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Permissions
            </>
          )}
        </Button>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-600" />
          {success}
        </div>
      )}
    </form>
  );
};

export default DocumentPermissionsEditor;