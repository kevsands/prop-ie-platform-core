'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  unread: boolean;
  avatar?: string;
}

interface MessageCenterProps {
  messages?: Message[];
  onMessageClick?: (message: Message) => void;
}

export default function MessageCenter({ messages = [], onMessageClick }: MessageCenterProps) {
  const defaultMessages: Message[] = [
    {
      id: '1',
      sender: 'Sarah Johnson (Agent)',
      message: 'Hi! I have some great news about the property you viewed.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unread: true,
    },
    {
      id: '2',
      sender: 'Tom Smith (Solicitor)',
      message: 'I\'ve reviewed the contracts. Everything looks good.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: false,
    },
    {
      id: '3',
      sender: 'Property Team',
      message: 'Your viewing has been confirmed for tomorrow at 2 PM.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
    },
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                message.unread ? 'bg-blue-50' : 'bg-gray-50'
              } hover:bg-gray-100`}
              onClick={() => onMessageClick?.(message)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {message.avatar ? (
                  <img src={message.avatar} alt={message.sender} className="rounded-full" />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{message.sender}</h4>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
              </div>
              {message.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}