'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { 
  MessageCircle, 
  Send, 
  User,
  Bot,
  Phone,
  Video,
  Paperclip,
  MoreVertical,
  Minimize2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
}

interface ChatComponentProps {
  isOpen?: boolean;
  onToggle?: () => void;
  agentName?: string;
  agentAvatar?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  isOpen = false,
  onToggle,
  agentName = 'Support Agent',
  agentAvatar
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAgentResponse(newMessage),
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'I can help you with pricing information. Our properties range from €250,000 to €2.5M depending on location and size. Would you like to see properties in a specific price range?';
    }
    
    if (lowerMessage.includes('mortgage') || lowerMessage.includes('finance')) {
      return 'We work with several mortgage providers and can connect you with our financial advisors. The typical mortgage approval process takes 2-4 weeks. Would you like me to arrange a consultation?';
    }
    
    if (lowerMessage.includes('viewing') || lowerMessage.includes('visit')) {
      return 'I\'d be happy to arrange a property viewing for you. We offer both in-person and virtual viewings. What properties are you interested in viewing?';
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('area')) {
      return 'We have properties across Dublin, Cork, Galway, and other major Irish cities. Each area has different amenities and price points. Which location interests you most?';
    }
    
    return 'Thank you for your message. I\'m here to help with any questions about our properties, financing, viewings, or the buying process. What specific information would you like?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            {agentAvatar ? (
              <img src={agentAvatar} alt={agentName} className="w-10 h-10 rounded-full" />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-sm">{agentName}</CardTitle>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.sender === 'agent'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-yellow-100 text-yellow-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatComponent;