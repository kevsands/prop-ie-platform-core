'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Clock,
  Users,
  Lock,
  Unlock,
  Eye,
  Edit3,
  Download,
  Share2,
  History,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
  Key,
  UserCheck,
  UserX,
  Archive,
  RotateCcw,
  Tag,
  MessageSquare,
  Bell,
  Zap,
  GitBranch,
  Activity
} from 'lucide-react';

// Access control roles for Irish property development teams
const ACCESS_ROLES = {
  owner: {
    name: 'Owner',
    description: 'Full access including deletion and permission management',
    color: 'purple',
    permissions: ['read', 'write', 'delete', 'share', 'manage_permissions']
  },
  editor: {
    name: 'Editor',
    description: 'Can read, edit, and share files',
    color: 'blue',
    permissions: ['read', 'write', 'share']
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access with download permissions',
    color: 'green',
    permissions: ['read', 'download']
  },
  reviewer: {
    name: 'Reviewer',
    description: 'Can view and comment on files',
    color: 'amber',
    permissions: ['read', 'comment']
  },
  restricted: {
    name: 'Restricted',
    description: 'Limited access for external stakeholders',
    color: 'red',
    permissions: ['read']
  }
};

// Team members for demonstration
const TEAM_MEMBERS = [
  {
    id: 'user-1',
    name: 'Planning Team',
    email: 'planning@propie.ie',
    role: 'editor',
    department: 'Planning',
    lastActive: '2025-07-02T09:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Legal Team',
    email: 'legal@propie.ie',
    role: 'editor',
    department: 'Legal',
    lastActive: '2025-07-01T14:15:00Z'
  },
  {
    id: 'user-3',
    name: 'Quantity Surveyor',
    email: 'qs@propie.ie',
    role: 'editor',
    department: 'Commercial',
    lastActive: '2025-07-02T11:45:00Z'
  },
  {
    id: 'user-4',
    name: 'Client Representative',
    email: 'client@external.ie',
    role: 'viewer',
    department: 'External',
    lastActive: '2025-06-30T16:20:00Z'
  }
];

// Sample file audit trail
const SAMPLE_AUDIT_TRAIL = [
  {
    id: 'audit-1',
    action: 'file_uploaded',
    description: 'File uploaded to Planning Documents',
    user: 'Planning Team',
    timestamp: '2025-07-02T09:30:00Z',
    details: {
      fileName: 'Planning_Application_FitzgeraldGardens.pdf',
      fileSize: '2.5 MB',
      category: 'planning'
    }
  },
  {
    id: 'audit-2',
    action: 'permission_changed',
    description: 'Shared file with Client Representative',
    user: 'Planning Team',
    timestamp: '2025-07-02T09:35:00Z',
    details: {
      grantedTo: 'Client Representative',
      permission: 'viewer'
    }
  },
  {
    id: 'audit-3',
    action: 'file_viewed',
    description: 'File downloaded',
    user: 'Legal Team',
    timestamp: '2025-07-02T10:15:00Z',
    details: {
      action: 'download'
    }
  },
  {
    id: 'audit-4',
    action: 'comment_added',
    description: 'Comment added to file',
    user: 'Quantity Surveyor',
    timestamp: '2025-07-02T11:20:00Z',
    details: {
      comment: 'BOQ figures need updating for current market rates'
    }
  },
  {
    id: 'audit-5',
    action: 'version_created',
    description: 'New version uploaded',
    user: 'Planning Team',
    timestamp: '2025-07-02T11:45:00Z',
    details: {
      versionFrom: '1.0',
      versionTo: '1.1',
      changes: 'Updated floor plans based on structural review'
    }
  }
];

// Sample file versions
const SAMPLE_FILE_VERSIONS = [
  {
    id: 'version-3',
    version: '1.2',
    uploadedBy: 'Planning Team',
    uploadedAt: '2025-07-02T11:45:00Z',
    size: 2800000,
    changes: 'Final revisions incorporating all stakeholder feedback',
    status: 'current',
    downloadCount: 0
  },
  {
    id: 'version-2',
    version: '1.1',
    uploadedBy: 'Planning Team',
    uploadedAt: '2025-07-01T14:30:00Z',
    size: 2650000,
    changes: 'Updated floor plans based on structural review',
    status: 'archived',
    downloadCount: 5
  },
  {
    id: 'version-1',
    version: '1.0',
    uploadedBy: 'Planning Team',
    uploadedAt: '2025-06-30T09:15:00Z',
    size: 2500000,
    changes: 'Initial planning application submission',
    status: 'archived',
    downloadCount: 12
  }
];

interface FileManagementIntegrationProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
}

export default function FileManagementIntegration({
  fileId,
  fileName,
  onClose
}: FileManagementIntegrationProps) {
  const [activeTab, setActiveTab] = useState<'permissions' | 'versions' | 'audit' | 'settings'>('permissions');
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  const [fileVersions, setFileVersions] = useState(SAMPLE_FILE_VERSIONS);
  const [auditTrail, setAuditTrail] = useState(SAMPLE_AUDIT_TRAIL);
  const [isSharing, setIsSharing] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');

  const handleRoleChange = (userId: string, newRole: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === userId ? { ...member, role: newRole } : member
    ));
    
    // Add audit entry
    const auditEntry = {
      id: `audit-${Date.now()}`,
      action: 'permission_changed',
      description: `Permission changed to ${ACCESS_ROLES[newRole].name}`,
      user: 'Current User',
      timestamp: new Date().toISOString(),
      details: {
        targetUser: teamMembers.find(m => m.id === userId)?.name,
        newPermission: newRole
      }
    };
    setAuditTrail(prev => [auditEntry, ...prev]);
  };

  const handleShareFile = () => {
    if (!newUserEmail) return;
    
    const newUser = {
      id: `user-${Date.now()}`,
      name: newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      department: 'External',
      lastActive: new Date().toISOString()
    };
    
    setTeamMembers(prev => [...prev, newUser]);
    
    // Add audit entry
    const auditEntry = {
      id: `audit-${Date.now()}`,
      action: 'file_shared',
      description: `File shared with ${newUserEmail}`,
      user: 'Current User',
      timestamp: new Date().toISOString(),
      details: {
        sharedWith: newUserEmail,
        permission: newUserRole
      }
    };
    setAuditTrail(prev => [auditEntry, ...prev]);
    
    setNewUserEmail('');
    setIsSharing(false);
  };

  const removeAccess = (userId: string) => {
    const user = teamMembers.find(m => m.id === userId);
    setTeamMembers(prev => prev.filter(member => member.id !== userId));
    
    // Add audit entry
    if (user) {
      const auditEntry = {
        id: `audit-${Date.now()}`,
        action: 'access_removed',
        description: `Access removed for ${user.name}`,
        user: 'Current User',
        timestamp: new Date().toISOString(),
        details: {
          removedUser: user.name,
          previousRole: user.role
        }
      };
      setAuditTrail(prev => [auditEntry, ...prev]);
    }
  };

  const restoreVersion = (versionId: string) => {
    const version = fileVersions.find(v => v.id === versionId);
    if (version) {
      // Create new current version based on restored version
      const newVersion = {
        id: `version-${Date.now()}`,
        version: `${parseFloat(fileVersions[0].version) + 0.1}`,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        size: version.size,
        changes: `Restored from version ${version.version}`,
        status: 'current' as const,
        downloadCount: 0
      };
      
      setFileVersions(prev => [
        newVersion,
        ...prev.map(v => ({ ...v, status: 'archived' as const }))
      ]);
      
      // Add audit entry
      const auditEntry = {
        id: `audit-${Date.now()}`,
        action: 'version_restored',
        description: `Version ${version.version} restored`,
        user: 'Current User',
        timestamp: new Date().toISOString(),
        details: {
          restoredVersion: version.version,
          newVersion: newVersion.version
        }
      };
      setAuditTrail(prev => [auditEntry, ...prev]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'file_uploaded': return <Upload className="w-4 h-4 text-blue-600" />;
      case 'file_shared': return <Share2 className="w-4 h-4 text-green-600" />;
      case 'permission_changed': return <Key className="w-4 h-4 text-amber-600" />;
      case 'file_viewed': return <Eye className="w-4 h-4 text-gray-600" />;
      case 'comment_added': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'version_created': return <GitBranch className="w-4 h-4 text-indigo-600" />;
      case 'version_restored': return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case 'access_removed': return <UserX className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">File Management</h2>
              <p className="text-gray-600 truncate max-w-md">{fileName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { id: 'permissions', label: 'Access Control', icon: <Shield className="w-4 h-4" /> },
              { id: 'versions', label: 'Version History', icon: <History className="w-4 h-4" /> },
              { id: 'audit', label: 'Audit Trail', icon: <Activity className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Access Control</h3>
                <button
                  onClick={() => setIsSharing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share File
                </button>
              </div>

              {/* Share Modal */}
              {isSharing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Share with new user</h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(ACCESS_ROLES).map(([key, role]) => (
                        <option key={key} value={key}>{role.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleShareFile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => setIsSharing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Current Access List */}
              <div className="space-y-3">
                {teamMembers.map(member => {
                  const role = ACCESS_ROLES[member.role];
                  return (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-gray-500">
                              {member.department} • Last active: {new Date(member.lastActive).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            className={`px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 border-${role.color}-300 bg-${role.color}-50 text-${role.color}-800`}
                          >
                            {Object.entries(ACCESS_ROLES).map(([key, accessRole]) => (
                              <option key={key} value={key}>{accessRole.name}</option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => removeAccess(member.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove access"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {role.permissions.map(permission => (
                          <span
                            key={permission}
                            className={`text-xs px-2 py-1 rounded-full bg-${role.color}-100 text-${role.color}-700`}
                          >
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === 'versions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              
              <div className="space-y-3">
                {fileVersions.map(version => (
                  <div key={version.id} className={`border rounded-lg p-4 ${
                    version.status === 'current' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <GitBranch className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">Version {version.version}</h4>
                            {version.status === 'current' && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(version.size)} • Uploaded by {version.uploadedBy}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(version.uploadedAt).toLocaleString()} • Downloaded {version.downloadCount} times
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        {version.status !== 'current' && (
                          <button
                            onClick={() => restoreVersion(version.id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Restore
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-700">{version.changes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
              
              <div className="space-y-3">
                {auditTrail.map(entry => (
                  <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getActionIcon(entry.action)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{entry.description}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">by {entry.user}</p>
                        
                        {entry.details && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            {Object.entries(entry.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key.replace('_', ' ')}:</span> {value}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">File Settings</h3>
              
              <div className="space-y-6">
                {/* Security Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Require authentication for downloads</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Enable watermarking for PDFs</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Track all file access</span>
                    </label>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                      <span className="text-sm text-gray-700">Notify on new comments</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                      <span className="text-sm text-gray-700">Notify on version updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Notify on access changes</span>
                    </label>
                  </div>
                </div>

                {/* Archive Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Archive & Retention</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Automatic archiving
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="never">Never archive automatically</option>
                        <option value="1year">Archive after 1 year</option>
                        <option value="2years">Archive after 2 years</option>
                        <option value="5years">Archive after 5 years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Version retention
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">Keep all versions</option>
                        <option value="10">Keep last 10 versions</option>
                        <option value="5">Keep last 5 versions</option>
                        <option value="3">Keep last 3 versions</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">Danger Zone</h4>
                  <div className="space-y-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                      <Archive className="w-4 h-4" />
                      Archive File
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete File Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}