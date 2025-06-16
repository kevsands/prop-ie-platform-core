'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  MessageSquare, 
  FileText, 
  Download, 
  Upload,
  Euro,
  Home,
  Shield,
  Target,
  User,
  Link as LinkIcon,
  Plus,
  Check,
  X,
  Flag,
  Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  category: 'verification' | 'financial' | 'legal' | 'property' | 'documentation' | 'appointment';
  dueDate: Date | null;
  progress: number;
  estimatedTime: number;
  actualTime?: number;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dependencies: string[];
  tags: string[];
  notes: string;
  checklist: Array<{
    id: string;
    text: string;
    completed: boolean;
    completedAt?: Date;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  relatedTasks: string[];
  activity: Array<{
    id: string;
    type: 'status_change' | 'progress_update' | 'comment' | 'attachment' | 'checklist_update';
    message: string;
    timestamp: Date;
    user: string;
  }>;
}

interface Comment {
  id: string;
  message: string;
  author: string;
  timestamp: Date;
  type: 'comment' | 'system';
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Mock task data - in a real app, this would be fetched based on the ID
  const task: TaskDetail = {
    id: taskId,
    title: 'Complete Mortgage Application',
    description: 'Submit final mortgage application with all supporting documents including proof of income, bank statements, and employment verification. This is a critical step in the home buying process and requires attention to detail.',
    status: 'in_progress',
    priority: 'high',
    category: 'financial',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    progress: 85,
    estimatedTime: 120,
    actualTime: 95,
    assignedTo: 'You',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dependencies: ['kyc-verification', 'proof-of-funds'],
    tags: ['mortgage', 'urgent', 'bank', 'application'],
    notes: 'Waiting for final employment letter from HR department. Bank advisor meeting scheduled for tomorrow.',
    checklist: [
      { id: '1', text: 'Complete application form', completed: true, completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: '2', text: 'Upload proof of income (last 3 payslips)', completed: true, completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: '3', text: 'Upload bank statements (last 6 months)', completed: true, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { id: '4', text: 'Get employment verification letter', completed: false },
      { id: '5', text: 'Submit application to bank', completed: false },
      { id: '6', text: 'Schedule follow-up meeting', completed: false }
    ],
    attachments: [
      {
        id: '1',
        name: 'mortgage_application_form.pdf',
        size: 2456789,
        type: 'application/pdf',
        url: '/documents/mortgage_application_form.pdf',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'payslips_last_3_months.pdf',
        size: 1234567,
        type: 'application/pdf',
        url: '/documents/payslips_last_3_months.pdf',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'bank_statements.pdf',
        size: 3456789,
        type: 'application/pdf',
        url: '/documents/bank_statements.pdf',
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ],
    relatedTasks: ['kyc-verification', 'htb-application'],
    activity: [
      {
        id: '1',
        type: 'status_change',
        message: 'Task status changed from Pending to In Progress',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        user: 'You'
      },
      {
        id: '2',
        type: 'progress_update',
        message: 'Progress updated to 60%',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: 'You'
      },
      {
        id: '3',
        type: 'attachment',
        message: 'Added attachment: bank_statements.pdf',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: 'You'
      },
      {
        id: '4',
        type: 'progress_update',
        message: 'Progress updated to 85%',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: 'You'
      }
    ]
  };

  const comments: Comment[] = [
    {
      id: '1',
      message: 'Application form has been completed and uploaded. Moving to document collection phase.',
      author: 'You',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'comment'
    },
    {
      id: '2',
      message: 'Bank advisor recommended uploading 6 months of statements instead of 3 for better approval chances.',
      author: 'System',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'system'
    },
    {
      id: '3',
      message: 'All documents uploaded except employment verification letter. HR department should provide this by tomorrow.',
      author: 'You',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: 'comment'
    }
  ];

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'verification':
        return <Shield size={20} className="text-blue-600" />;
      case 'financial':
        return <Euro size={20} className="text-green-600" />;
      case 'legal':
        return <FileText size={20} className="text-purple-600" />;
      case 'property':
        return <Home size={20} className="text-amber-600" />;
      case 'documentation':
        return <FileText size={20} className="text-indigo-600" />;
      case 'appointment':
        return <Calendar size={20} className="text-orange-600" />;
      default:
        return <Target size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDaysRemaining = (dueDate: Date | null) => {
    if (!dueDate) return null;
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completedChecklist = task.checklist.filter(item => item.completed).length;
  const totalChecklist = task.checklist.length;
  const daysRemaining = getDaysRemaining(task.dueDate);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would be an API call
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    // In a real app, this would be an API call
    console.log('Toggling checklist item:', itemId);
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      // In a real app, this would be an API call
      console.log('Adding checklist item:', newChecklistItem);
      setNewChecklistItem('');
      setShowAddChecklist(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/buyer/tasks"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getTaskIcon(task.category)}
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()} PRIORITY
              </span>
              <span className="text-sm text-gray-500">
                Category: {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit3 size={16} />
            Edit Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Task Details */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900">{task.description}</p>
                </div>
                
                {task.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-800">{task.notes}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-900">{task.estimatedTime} minutes</span>
                    </div>
                  </div>
                  
                  {task.actualTime && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actual Time</label>
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-900">{task.actualTime} minutes</span>
                      </div>
                    </div>
                  )}
                </div>

                {task.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <span className="text-2xl font-bold text-blue-600">{task.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Started</p>
                  <p className="font-medium text-gray-900">{format(task.createdAt, 'MMM d')}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Last Update</p>
                  <p className="font-medium text-gray-900">{format(task.updatedAt, 'MMM d')}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  daysRemaining !== null && daysRemaining < 0 ? 'bg-red-50' :
                  daysRemaining !== null && daysRemaining <= 3 ? 'bg-amber-50' :
                  'bg-green-50'
                }`}>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className={`font-medium ${
                    daysRemaining !== null && daysRemaining < 0 ? 'text-red-700' :
                    daysRemaining !== null && daysRemaining <= 3 ? 'text-amber-700' :
                    'text-green-700'
                  }`}>
                    {task.dueDate ? format(task.dueDate, 'MMM d') : 'No due date'}
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Checklist ({completedChecklist}/{totalChecklist})
                </h3>
                <button
                  onClick={() => setShowAddChecklist(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {task.checklist.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        item.completed 
                          ? 'bg-green-600 border-green-600 text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {item.completed && <Check size={14} />}
                    </button>
                    <div className="flex-1">
                      <p className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.text}
                      </p>
                      {item.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed on {format(item.completedAt, 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showAddChecklist && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      placeholder="Add a new checklist item..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    />
                    <button
                      onClick={handleAddChecklistItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setShowAddChecklist(false);
                        setNewChecklistItem('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attachments ({task.attachments.length})
                </h3>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Upload size={16} />
                  Upload File
                </button>
              </div>

              <div className="space-y-3">
                {task.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Paperclip size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(attachment.size)} • {format(attachment.uploadedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      comment.type === 'system' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {comment.type === 'system' ? (
                        <AlertCircle size={16} className="text-blue-600" />
                      ) : (
                        <User size={16} className="text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{format(comment.timestamp, 'MMM d, yyyy \'at\' HH:mm')}</span>
                      </div>
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        <MessageSquare size={16} className="inline mr-2" />
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="font-medium text-gray-900">Mark Complete</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Clock size={16} className="text-blue-600" />
                  <span className="font-medium text-gray-900">Update Progress</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar size={16} className="text-purple-600" />
                  <span className="font-medium text-gray-900">Change Due Date</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Flag size={16} className="text-amber-600" />
                  <span className="font-medium text-gray-900">Change Priority</span>
                </button>
              </div>
            </div>

            {/* Task Info */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-900">{task.assignedTo}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-900">{format(task.createdAt, 'MMM d, yyyy')}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-900">{format(task.updatedAt, 'MMM d, yyyy')}</span>
                  </div>
                </div>
                
                {task.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className={
                        daysRemaining !== null && daysRemaining < 0 ? 'text-red-500' :
                        daysRemaining !== null && daysRemaining <= 3 ? 'text-amber-500' :
                        'text-green-500'
                      } />
                      <span className={
                        daysRemaining !== null && daysRemaining < 0 ? 'text-red-700' :
                        daysRemaining !== null && daysRemaining <= 3 ? 'text-amber-700' :
                        'text-green-700'
                      }>
                        {format(task.dueDate, 'MMM d, yyyy')}
                        {daysRemaining !== null && (
                          <span className="text-sm ml-1">
                            ({daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
                              daysRemaining === 0 ? 'Due today' :
                              daysRemaining === 1 ? 'Due tomorrow' :
                              `${daysRemaining} days remaining`})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Tasks */}
            {task.relatedTasks.length > 0 && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tasks</h3>
                
                <div className="space-y-2">
                  {task.relatedTasks.map((relatedTaskId) => (
                    <Link 
                      key={relatedTaskId}
                      href={`/buyer/tasks/${relatedTaskId}`}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <LinkIcon size={16} className="text-gray-400" />
                      <span className="text-gray-900 capitalize">{relatedTaskId.replace('-', ' ')}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {task.activity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={12} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(activity.timestamp, 'MMM d, yyyy \'at\' HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}