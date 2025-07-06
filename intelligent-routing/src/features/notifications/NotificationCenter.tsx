'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  BellAlertIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  HomeIcon,
  XMarkIcon,
  CheckIcon,
  ChevronRightIcon,
  EyeIcon,
  TrashIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'message' | 'property' | 'document' | 'appointment' | 'transaction' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  metadata?: {
    propertyId?: string;
    documentId?: string;
    appointmentId?: string;
    transactionId?: string;
    [key: string]: any;
  };
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, archiveNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filter notifications by type
  const filterNotifications = (type: string) => {
    let filtered = notifications;
    
    if (showArchived) {
      filtered = filtered.filter(n => n.archived);
    } else {
      filtered = filtered.filter(n => !n.archived);
    }
    
    if (type === 'unread') {
      return filtered.filter(n => !n.read);
    }
    
    if (type !== 'all') {
      return filtered.filter(n => n.type === type);
    }
    
    return filtered;
  };

  const filteredNotifications = filterNotifications(selectedTab);

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Monitor for new notifications
  useEffect(() => {
    if (notifications.length > 0 && !notifications[0].read) {
      playNotificationSound();
    }
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <ChatBubbleLeftIcon className="h-5 w-5" />;
      case 'property':
        return <HomeIcon className="h-5 w-5" />;
      case 'document':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'appointment':
        return <CalendarIcon className="h-5 w-5" />;
      case 'transaction':
        return <CurrencyEuroIcon className="h-5 w-5" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setIsOpen(false);
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "p-4 border-b hover:bg-gray-50 cursor-pointer transition-all",
        !notification.read && "bg-blue-50 hover:bg-blue-100",
        notification.archived && "opacity-60"
      )}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          getPriorityColor(notification.priority)
        )}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={cn(
                "font-medium text-gray-900",
                !notification.read && "font-semibold"
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              {notification.sender && (
                <p className="text-xs text-gray-500 mt-1">
                  From {notification.sender.name} • {notification.sender.role}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </span>
                {notification.actionText && (
                  <span className="text-xs text-blue-600 hover:text-blue-700">
                    {notification.actionText} →
                  </span>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-2"
                >
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.read && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Mark as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  archiveNotification(notification.id);
                }}>
                  <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                  {notification.archived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Notification Sound */}
      <audio ref={audioRef} src="/sounds/notification.mp3" />
      
      {/* Notification Bell */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            {unreadCount > 0 ? (
              <>
                <BellAlertIcon className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </>
            ) : (
              <BellIcon className="h-5 w-5" />
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
              <Switch
                checked={showArchived}
                onCheckedChange={setShowArchived}
                className="scale-75"
              />
              <span className="text-sm text-gray-500">Archived</span>
            </div>
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full rounded-none border-b h-auto p-0">
              <TabsTrigger value="all" className="flex-1 rounded-none data-[state=active]:border-b-2">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 rounded-none data-[state=active]:border-b-2">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="message" className="flex-1 rounded-none data-[state=active]:border-b-2">
                Messages
              </TabsTrigger>
              <TabsTrigger value="property" className="flex-1 rounded-none data-[state=active]:border-b-2">
                Properties
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="m-0">
              <ScrollArea className="h-[400px]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                      />
                    ))}
                  </AnimatePresence>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 border-t bg-gray-50">
            <Button variant="outline" className="w-full" onClick={() => {
              setIsOpen(false);
              window.location.href = '/notifications';
            }}>
              View all notifications
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}