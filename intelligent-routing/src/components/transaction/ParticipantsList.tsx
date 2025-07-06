'use client';

import React, { useState } from 'react';
import { Transaction, TransactionParticipant } from '@/context/TransactionContext';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  UserIcon,
  UserPlusIcon,
  MoreVerticalIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ClockIcon,
  AlertCircleIcon,
  BuildingIcon,
  BriefcaseIcon,
  ScaleIcon,
  HomeIcon,
  CreditCardIcon
} from 'lucide-react';

interface ParticipantsListProps {
  transaction: Transaction;
  userRole?: string;
  className?: string;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
  transaction, 
  userRole,
  className = "" 
}) => {
  const { user } = useAuth();
  const { addParticipant, removeParticipant } = useTransaction();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    role: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get icon for participant role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'BUYER':
        return <HomeIcon className="h-4 w-4" />;
      case 'DEVELOPER':
        return <BuildingIcon className="h-4 w-4" />;
      case 'AGENT':
        return <BriefcaseIcon className="h-4 w-4" />;
      case 'BUYER_SOLICITOR':
      case 'VENDOR_SOLICITOR':
        return <ScaleIcon className="h-4 w-4" />;
      case 'LENDER':
        return <CreditCardIcon className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'BUYER':
        return 'Buyer';
      case 'DEVELOPER':
        return 'Developer';
      case 'AGENT':
        return 'Sales Agent';
      case 'BUYER_SOLICITOR':
        return 'Buyer\'s Solicitor';
      case 'VENDOR_SOLICITOR':
        return 'Vendor\'s Solicitor';
      case 'LENDER':
        return 'Mortgage Lender';
      default:
        return role;
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BUYER':
        return 'bg-blue-100 text-blue-700';
      case 'DEVELOPER':
        return 'bg-green-100 text-green-700';
      case 'AGENT':
        return 'bg-yellow-100 text-yellow-700';
      case 'BUYER_SOLICITOR':
      case 'VENDOR_SOLICITOR':
        return 'bg-purple-100 text-purple-700';
      case 'LENDER':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get available roles for adding
  const getAvailableRoles = () => {
    const existingRoles = transaction.participants.map(p => p.role);
    const allRoles = [
      'BUYER',
      'DEVELOPER',
      'AGENT',
      'BUYER_SOLICITOR',
      'VENDOR_SOLICITOR',
      'LENDER'
    ];
    
    // Filter out roles that already exist
    return allRoles.filter(role => {
      // Allow multiple agents but not other roles
      if (role === 'AGENT') return true;
      return !existingRoles.includes(role);
    });
  };

  // Check if user can manage participants
  const canManageParticipants = () => {
    if (!user || !userRole) return false;
    // Developers and their agents can add/remove participants
    return userRole === 'DEVELOPER' || userRole === 'AGENT';
  };

  // Handle adding participant
  const handleAddParticipant = async () => {
    if (!newParticipant.role || !newParticipant.name || !newParticipant.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await addParticipant(transaction.id, {
        role: newParticipant.role,
        userId: '', // This will be set by the backend
        name: newParticipant.name,
        email: newParticipant.email,
        phone: newParticipant.phone,
        status: 'PENDING'
      });

      toast({
        title: "Success",
        description: `${newParticipant.name} has been added to the transaction`,
      });

      // Reset form and close dialog
      setNewParticipant({ role: '', name: '', email: '', phone: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add participant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing participant
  const handleRemoveParticipant = async (participantId: string, participantName: string) => {
    if (!confirm(`Are you sure you want to remove ${participantName} from this transaction?`)) {
      return;
    }

    try {
      await removeParticipant(transaction.id, participantId);
      toast({
        title: "Success",
        description: `${participantName} has been removed from the transaction`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove participant. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Group participants by role
  const groupedParticipants = transaction.participants.reduce((acc, participant) => {
    const role = participant.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(participant);
    return acc;
  }, {} as Record<string, TransactionParticipant[]>);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Transaction Participants
        </CardTitle>
        {canManageParticipants() && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Participant</DialogTitle>
                <DialogDescription>
                  Add a new participant to this transaction. They will receive an invitation to join.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newParticipant.role}
                    onValueChange={(value) => setNewParticipant({ ...newParticipant, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map(role => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role)}
                            {getRoleDisplayName(role)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newParticipant.phone}
                    onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                    placeholder="+353 1 234 5678"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddParticipant} disabled={isLoading}>
                  Add Participant
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedParticipants).map(([role, participants]) => (
            <div key={role}>
              <h3 className="font-medium text-sm text-gray-500 mb-3">
                {getRoleDisplayName(role)}
              </h3>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}`} />
                        <AvatarFallback>
                          {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{participant.name}</p>
                          {participant.userId === user?.id && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                          <Badge className={`text-xs ${getRoleColor(participant.role)}`}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(participant.role)}
                              {getRoleDisplayName(participant.role)}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <a href={`mailto:${participant.email}`} className="flex items-center gap-1 hover:text-blue-600">
                            <MailIcon className="h-3 w-3" />
                            {participant.email}
                          </a>
                          {participant.phone && (
                            <a href={`tel:${participant.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                              <PhoneIcon className="h-3 w-3" />
                              {participant.phone}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3" />
                            Joined {new Date(participant.joinedAt).toLocaleDateString()}
                          </div>
                          {participant.status === 'ACTIVE' && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <ShieldCheckIcon className="h-3 w-3" />
                              Verified
                            </div>
                          )}
                          {participant.status === 'PENDING' && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600">
                              <AlertCircleIcon className="h-3 w-3" />
                              Pending Verification
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {canManageParticipants() && participant.userId !== user?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemoveParticipant(participant.id, participant.name)}
                            className="text-red-600"
                          >
                            Remove Participant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Missing Participants Alert */}
        {getAvailableRoles().length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Missing Participants</p>
                <p className="text-sm text-yellow-700 mt-1">
                  The following roles are not yet assigned: {' '}
                  {getAvailableRoles().map(role => getRoleDisplayName(role)).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;