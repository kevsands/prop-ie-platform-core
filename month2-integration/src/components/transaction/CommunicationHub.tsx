'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionMessage } from '@/context/TransactionContext';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  MessageSquareIcon,
  SendIcon,
  PaperclipIcon,
  MoreVerticalIcon,
  SearchIcon,
  CheckIcon,
  CheckCheckIcon,
  ClockIcon,
  ImageIcon,
  FileIcon,
  UserIcon,
  UsersIcon,
  BellIcon,
  BellOffIcon
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface CommunicationHubProps {
  transaction: Transaction;
  className?: string;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({ 
  transaction, 
  className = "" 
}) => {
  const { user } = useAuth();
  const { sendMessage } = useTransaction();
  const { toast } = useToast();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transaction.messages]);

  // Filter messages based on search
  const filteredMessages = transaction.messages.filter(msg => 
    searchQuery === '' || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group messages by date
  const groupedMessages = filteredMessages.reduce((acc, message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, TransactionMessage[]>);

  // Get participant info
  const getParticipant = (senderId: string) => {
    return transaction.participants.find(p => p.userId === senderId);
  };

  // Format date header
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    setIsSending(true);
    try {
      await sendMessage(transaction.id, newMessage.trim(), attachments);
      
      // Clear form
      setNewMessage('');
      setAttachments([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle file attachment
  const handleFileAttachment = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Get message status icon
  const getMessageStatus = (message: TransactionMessage) => {
    const isRead = message.readBy.includes(user!.id);
    const isAllRead = transaction.participants.every(p => 
      p.userId === message.senderId || message.readBy.includes(p.userId)
    );

    if (isAllRead) {
      return <CheckCheckIcon className="h-3 w-3 text-blue-500" />;
    } else if (isRead) {
      return <CheckIcon className="h-3 w-3 text-gray-400" />;
    } else {
      return <ClockIcon className="h-3 w-3 text-gray-300" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5" />
            Communication Hub
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Participants count */}
            <Badge variant="secondary" className="flex items-center gap-1">
              <UsersIcon className="h-3 w-3" />
              {transaction.participants.length} Participants
            </Badge>
            
            {/* Notifications toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNotifications(!notifications)}
                  >
                    {notifications ? (
                      <BellIcon className="h-4 w-4" />
                    ) : (
                      <BellOffIcon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {notifications ? 'Mute notifications' : 'Enable notifications'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-6">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                    {formatDateHeader(date)}
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {messages.map((message) => {
                    const participant = getParticipant(message.senderId);
                    const isOwnMessage = message.senderId === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          {/* Avatar */}
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderName}`} />
                            <AvatarFallback>
                              {message.senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {/* Message Content */}
                          <div className={`${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            {/* Sender Info */}
                            {!isOwnMessage && (
                              <div className="flex items-center gap-2 px-2">
                                <span className="text-sm font-medium">{message.senderName}</span>
                                {participant && (
                                  <Badge variant="outline" className="text-xs">
                                    {participant.role}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={`rounded-lg p-3 ${
                                isOwnMessage 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              
                              {/* Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment, index) => (
                                    <div
                                      key={index}
                                      className={`flex items-center gap-2 p-2 rounded ${
                                        isOwnMessage ? 'bg-blue-600' : 'bg-gray-200'
                                      }`}
                                    >
                                      <FileIcon className="h-4 w-4" />
                                      <span className="text-xs">Attachment {index + 1}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Message Info */}
                            <div className="flex items-center gap-2 px-2 text-xs text-gray-500">
                              <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                              {isOwnMessage && getMessageStatus(message)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <FileIcon className="h-4 w-4" />
                  )}
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => removeAttachment(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input Controls */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileAttachment(e.target.files)}
            />
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && attachments.length === 0) || isSending}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="mt-2 text-xs text-gray-500">
              Someone is typing...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationHub;