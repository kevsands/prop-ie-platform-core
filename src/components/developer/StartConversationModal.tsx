'use client';

import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Search, 
  Building2, 
  AlertTriangle, 
  Crown, 
  Calendar,
  Plus,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}

interface StartConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (data: {
    title: string;
    recipients: User[];
    initialMessage: string;
    conversationType: string;
    priority: string;
    projectId?: string;
  }) => void;
}

export function StartConversationModal({ isOpen, onClose, onStartConversation }: StartConversationModalProps) {
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
  const [initialMessage, setInitialMessage] = useState('');
  const [conversationType, setConversationType] = useState('team_communication');
  const [priority, setPriority] = useState('normal');
  const [projectId, setProjectId] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock users - in production this would come from API
  const mockUsers: User[] = [
    {
      id: 'user_architect_001',
      name: 'David McCarthy',
      email: 'david.mccarthy@design.ie',
      role: 'architect',
      department: 'Design Team'
    },
    {
      id: 'user_engineer_001',
      name: 'Sarah O\'Brien',
      email: 'sarah.obrien@engineering.ie',
      role: 'engineer',
      department: 'Engineering Team'
    },
    {
      id: 'user_site_manager_001',
      name: 'Patrick Kelly',
      email: 'patrick.kelly@construction.ie',
      role: 'site_manager',
      department: 'Construction Team'
    },
    {
      id: 'user_contractor_001',
      name: 'Cork Construction Ltd',
      email: 'info@corkconstruction.ie',
      role: 'contractor',
      department: 'External Partners'
    },
    {
      id: 'user_buyer_001',
      name: 'John Murphy',
      email: 'john.murphy@email.ie',
      role: 'buyer',
      department: 'Clients'
    },
    {
      id: 'user_solicitor_001',
      name: 'Sarah O\'Sullivan',
      email: 'sarah@lawfirm.ie',
      role: 'solicitor',
      department: 'Legal Partners'
    },
    {
      id: 'user_ceo_001',
      name: 'Michael Fitzgerald',
      email: 'michael@fitzgerald.ie',
      role: 'ceo',
      department: 'Executive Team'
    }
  ];

  useEffect(() => {
    setAvailableUsers(mockUsers);
  }, []);

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecipient = (user: User) => {
    if (!selectedRecipients.find(r => r.id === user.id)) {
      setSelectedRecipients([...selectedRecipients, user]);
    }
  };

  const handleRemoveRecipient = (userId: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== userId));
  };

  const handleSubmit = () => {
    if (!title.trim() || selectedRecipients.length === 0 || !initialMessage.trim()) {
      return;
    }

    setLoading(true);
    
    onStartConversation({
      title: title.trim(),
      recipients: selectedRecipients,
      initialMessage: initialMessage.trim(),
      conversationType,
      priority,
      projectId: projectId || undefined
    });

    // Reset form
    setTitle('');
    setSelectedRecipients([]);
    setInitialMessage('');
    setConversationType('team_communication');
    setPriority('normal');
    setProjectId('');
    setLoading(false);
    onClose();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'architect':
        return '🏗️';
      case 'engineer':
        return '⚙️';
      case 'contractor':
        return '🔨';
      case 'site_manager':
        return '👷';
      case 'ceo':
        return '👑';
      case 'solicitor':
        return '⚖️';
      case 'buyer':
        return '🏠';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'architect':
        return 'bg-purple-100 text-purple-800';
      case 'engineer':
        return 'bg-indigo-100 text-indigo-800';
      case 'contractor':
        return 'bg-orange-100 text-orange-800';
      case 'site_manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'ceo':
        return 'bg-red-100 text-red-800';
      case 'solicitor':
        return 'bg-purple-100 text-purple-800';
      case 'buyer':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            Start New Conversation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conversation Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Conversation Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fitzgerald Gardens - Design Review"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Conversation Type</Label>
                <Select value={conversationType} onValueChange={setConversationType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team_communication">Team Communication</SelectItem>
                    <SelectItem value="buyer_query">Buyer Inquiry</SelectItem>
                    <SelectItem value="approval_request">Approval Request</SelectItem>
                    <SelectItem value="meeting_discussion">Meeting Discussion</SelectItem>
                    <SelectItem value="project_update">Project Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="project">Project (Optional)</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific project</SelectItem>
                  <SelectItem value="fitzgerald-gardens">Fitzgerald Gardens</SelectItem>
                  <SelectItem value="ellwood">Ellwood</SelectItem>
                  <SelectItem value="ballymakenny-view">Ballymakenny View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recipients Selection */}
          <div>
            <Label>Recipients</Label>
            <div className="mt-2 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search team members, buyers, partners..."
                  className="pl-9"
                />
              </div>

              {/* Selected Recipients */}
              {selectedRecipients.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Recipients:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getRoleColor(recipient.role)}`}
                      >
                        <span>{getRoleIcon(recipient.role)}</span>
                        <span>{recipient.name}</span>
                        <button
                          onClick={() => handleRemoveRecipient(recipient.id)}
                          className="hover:bg-black/10 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Users */}
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleAddRecipient(user)}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                      selectedRecipients.find(r => r.id === user.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)} {user.role}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.department}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Initial Message */}
          <div>
            <Label htmlFor="message">Initial Message</Label>
            <Textarea
              id="message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start the conversation..."
              rows={4}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || selectedRecipients.length === 0 || !initialMessage.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Starting...' : 'Start Conversation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}