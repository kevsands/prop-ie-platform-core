'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckIcon,
  UserGroupIcon,
  LockClosedIcon,
  MicrophoneIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from "@/lib/utils";
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import EmojiPicker from '@/components/ui/emoji-picker';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
  reactions?: MessageReaction[];
}

interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  lastActivity: Date;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
  metadata?: {
    propertyId?: string;
    transactionId?: string;
    [key: string]: any;
  };
}

interface ConversationParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  isAdmin?: boolean;
}

export default function MessagingCenter() {
  const { user } = useAuth();
  const { 
    conversations, 
    activeConversation, 
    messages, 
    sendMessage, 
    markAsRead,
    searchMessages,
    createConversation,
    addReaction,
    removeReaction,
    editMessage,
    deleteMessage,
    uploadAttachment,
    typing,
    setTyping
  } = useMessaging();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (selectedTab === 'unread' && conv.unreadCount === 0) return false;
    if (selectedTab === 'groups' && conv.type !== 'group') return false;
    if (selectedTab === 'archived' && !conv.archived) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return conv.name?.toLowerCase().includes(query) ||
        conv.participants.some(p => p.name.toLowerCase().includes(query));
    }
    
    return true;
  });

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation,
      text: messageText.trim(),
      attachments: [],
      replyTo: replyingTo?.id,
    };

    // Upload attachments if any
    if (attachments.length > 0) {
      const uploadedAttachments = await Promise.all(
        attachments.map(file => uploadAttachment(file))
      );
      messageData.attachments = uploadedAttachments;
    }

    await sendMessage(messageData);
    setMessageText('');
    setAttachments([]);
    setReplyingTo(null);
    setEditingMessage(null);
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments([...attachments, ...Array.from(files)]);
    }
  };

  // Start/stop voice recording
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
          setAttachments([...attachments, audioFile]);
          audioChunksRef.current = [];
        };
        
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (selectedConversation) {
      setTyping(selectedConversation, true);
      
      // Clear typing after 3 seconds
      setTimeout(() => {
        setTyping(selectedConversation, false);
      }, 3000);
    }
  }, [selectedConversation, setTyping]);

  // Format message timestamp
  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  // Get conversation display name
  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.userId !== user?.id);
      return otherParticipant?.name || 'Unknown';
    }
    
    return 'Unnamed conversation';
  };

  // Get conversation avatar
  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.userId !== user?.id);
      return otherParticipant?.avatar;
    }
    
    return null;
  };

  // Message component
  const MessageItem = ({ message, previousMessage }: { message: Message; previousMessage?: Message }) => {
    const isOwnMessage = message.senderId === user?.id;
    const sender = activeConversation?.participants.find(p => p.userId === message.senderId);
    const showAvatar = !previousMessage || previousMessage.senderId !== message.senderId;
    const showTimestamp = !previousMessage || 
      new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() > 300000; // 5 minutes

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-end gap-2 mb-4",
          isOwnMessage && "flex-row-reverse"
        )}
      >
        {!isOwnMessage && (
          <div className="w-8">
            {showAvatar && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={sender?.avatar} />
                <AvatarFallback>{sender?.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
        
        <div className={cn(
          "max-w-[70%] space-y-1",
          isOwnMessage && "items-end"
        )}>
          {!isOwnMessage && showAvatar && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">{sender?.name}</span>
              {sender?.role && (
                <Badge variant="secondary" className="text-xs">{sender.role}</Badge>
              )}
            </div>
          )}
          
          {message.replyTo && (
            <div className="bg-gray-100 rounded p-2 mb-1 text-sm">
              <p className="text-gray-600">Replying to</p>
              {/* Show replied message preview */}
            </div>
          )}
          
          <div className={cn(
            "rounded-lg p-3",
            isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100"
          )}>
            <p className="whitespace-pre-wrap">{message.text}</p>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id}>
                    {attachment.type === 'image' ? (
                      <img 
                        src={attachment.url} 
                        alt={attachment.name}
                        className="rounded max-w-full"
                      />
                    ) : (
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded",
                          isOwnMessage ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"
                        )}
                      >
                        <DocumentIcon className="h-5 w-5" />
                        <span className="text-sm">{attachment.name}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {message.edited && (
              <p className={cn(
                "text-xs mt-1",
                isOwnMessage ? "text-blue-200" : "text-gray-500"
              )}>
                (edited)
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showTimestamp && (
              <span className="text-xs text-gray-500">
                {formatMessageTime(message.timestamp)}
              </span>
            )}
            
            {isOwnMessage && (
              <span className="text-xs text-gray-500">
                {message.status === 'read' && '✓✓'}
                {message.status === 'delivered' && '✓'}
              </span>
            )}
            
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex -space-x-1">
                {message.reactions.map((reaction) => (
                  <span key={reaction.userId} className="text-sm">
                    {reaction.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
            >
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0">
        <div className="flex h-full">
          {/* Conversations sidebar */}
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button size="sm" variant="outline">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  New Chat
                </Button>
              </div>
              
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread ({conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)})
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedTab} className="flex-1 m-0">
                <ScrollArea className="h-full">
                  {filteredConversations.map((conversation) => {
                    const isActive = selectedConversation === conversation.id;
                    
                    return (
                      <div
                        key={conversation.id}
                        className={cn(
                          "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                          "hover:bg-gray-100 border-b",
                          isActive && "bg-blue-50 border-l-4 border-l-blue-500"
                        )}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={getConversationAvatar(conversation)} />
                            <AvatarFallback>
                              {conversation.type === 'group' ? (
                                <UserGroupIcon className="h-5 w-5" />
                              ) : (
                                getConversationName(conversation)[0]
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.participants[0]?.status === 'online' && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className={cn(
                              "font-medium truncate",
                              conversation.unreadCount > 0 && "font-semibold"
                            )}>
                              {getConversationName(conversation)}
                            </h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          
                          {conversation.lastMessage && (
                            <p className={cn(
                              "text-sm truncate",
                              conversation.unreadCount > 0 ? "text-gray-900" : "text-gray-600"
                            )}>
                              {conversation.lastMessage.text}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-1">
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            {conversation.pinned && (
                              <Badge variant="secondary" className="text-xs">Pinned</Badge>
                            )}
                            {conversation.muted && (
                              <Badge variant="secondary" className="text-xs">Muted</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Chat area */}
          {selectedConversation && activeConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)}>
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Button>
                  
                  <Avatar>
                    <AvatarImage src={getConversationAvatar(activeConversation)} />
                    <AvatarFallback>
                      {activeConversation.type === 'group' ? (
                        <UserGroupIcon className="h-5 w-5" />
                      ) : (
                        getConversationName(activeConversation)[0]
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{getConversationName(activeConversation)}</h3>
                    <p className="text-sm text-gray-500">
                      {activeConversation.type === 'group' 
                        ? `${activeConversation.participants.length} members`
                        : activeConversation.participants[0]?.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <PhoneIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <VideoCameraIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
                    <InformationCircleIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Messages area */}
              <ScrollArea className="flex-1 p-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <MessageItem 
                      key={message.id} 
                      message={message}
                      previousMessage={messages[index - 1]}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Typing indicator */}
                {typing[selectedConversation] && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm">typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t bg-white">
                {replyingTo && (
                  <div className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded">
                    <div>
                      <p className="text-sm font-medium">Replying to</p>
                      <p className="text-sm text-gray-600 truncate">{replyingTo.text}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setReplyingTo(null)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {attachments.length > 0 && (
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {attachments.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="p-2 bg-gray-100 rounded">
                          {file.type.startsWith('image/') ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center">
                              <DocumentIcon className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="min-h-[40px] max-h-[120px] resize-none"
                      rows={1}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FaceSmileIcon className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <EmojiPicker
                          onEmojiSelect={(emoji) => {
                            setMessageText(messageText + emoji);
                            setShowEmojiPicker(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PaperClipIcon className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleRecording}
                      className={cn(isRecording && "text-red-600")}
                    >
                      {isRecording ? (
                        <StopIcon className="h-5 w-5" />
                      ) : (
                        <MicrophoneIcon className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() && attachments.length === 0}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No conversation selected</p>
                <p className="text-sm">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
          
          {/* Conversation info sidebar */}
          <AnimatePresence>
            {showInfo && activeConversation && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l bg-gray-50 overflow-hidden"
              >
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Conversation Info</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowInfo(false)}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-6">
                    {/* Participants */}
                    <div>
                      <h4 className="font-medium mb-3">Participants</h4>
                      <div className="space-y-2">
                        {activeConversation.participants.map((participant) => (
                          <div key={participant.userId} className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-sm text-gray-500">{participant.role}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {participant.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shared files */}
                    <div>
                      <h4 className="font-medium mb-3">Shared Files</h4>
                      <div className="space-y-2">
                        {messages
                          .filter(m => m.attachments && m.attachments.length > 0)
                          .map(m => m.attachments!)
                          .flat()
                          .slice(0, 5)
                          .map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.url}
                              download={attachment.name}
                              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                            >
                              <DocumentIcon className="h-5 w-5 text-gray-500" />
                              <span className="text-sm truncate">{attachment.name}</span>
                            </a>
                          ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <BellIcon className="h-4 w-4 mr-2" />
                        Mute Notifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <LockClosedIcon className="h-4 w-4 mr-2" />
                        Privacy Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600">
                        <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                        Archive Conversation
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}