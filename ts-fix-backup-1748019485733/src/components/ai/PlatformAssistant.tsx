'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMic, FiPaperclip, FiZap, FiCpu } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  actions?: AIAction[];
  loading?: boolean;
}

interface AIAction {
  id: string;
  type: 'navigate' | 'create' | 'search' | 'analyze';
  label: string;
  data: any;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    icon: FiZap,
    label: 'Create Project',
    prompt: 'I want to create a new development project',
    color: 'blue'},
  {
    icon: FiCpu,
    label: 'Market Analysis',
    prompt: 'Show me market trends for Dublin properties',
    color: 'green'},
  {
    icon: FiMessageSquare,
    label: 'Get Help',
    prompt: 'How do I upload planning permissions?',
    color: 'purple'}];

export default function PlatformAssistant() {
  const [isOpensetIsOpen] = useState(false);
  const [messagessetMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. I can help you with project creation, market analysis, document management, and more. What would you like to do today?',
      role: 'assistant',
      timestamp: new Date(),
      suggestions: [
        'Create a new project',
        'View market analytics',
        'Check verification status',
        'Upload documents']}]);
  const [inputValuesetInputValue] = useState('');
  const [isRecordingsetIsRecording] = useState(false);
  const [isTypingsetIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()};

    setMessages(prev => [...prevuserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing
    const loadingMessage: Message = {
      id: `${Date.now()}-loading`,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      loading: true};

    setMessages(prev => [...prevloadingMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? { ...aiResponse, id: msg.id } : msg
      ));
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('create') && lowerInput.includes('project')) {
      return {
        id: Date.now().toString(),
        content: 'I can help you create a new project! I\'ll guide you through the process step by step. First, let me gather some basic information.',
        role: 'assistant',
        timestamp: new Date(),
        actions: [
          {
            id: '1',
            type: 'create',
            label: 'Start Project Creation',
            data: { path: '/developer/projects/create' }],
        suggestions: [
          'Use AI project wizard',
          'Upload existing plans',
          'Import from template']};
    }

    if (lowerInput.includes('market') || lowerInput.includes('analytics')) {
      return {
        id: Date.now().toString(),
        content: 'Here\'s a quick market analysis based on current data:\n\n📈 Dublin property prices are up 12% YoY\n🏘️ First-time buyer demand increased 23%\n💰 Average sale price: €450,000\n⏱️ Average time to sell: 45 days',
        role: 'assistant',
        timestamp: new Date(),
        actions: [
          {
            id: '1',
            type: 'navigate',
            label: 'View Full Analytics',
            data: { path: '/analytics/dashboard' }]};
    }

    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return {
        id: Date.now().toString(),
        content: 'I can help you with that! Here\'s what you need to know about uploading planning permissions:\n\n1. Navigate to your project page\n2. Click on "Documents" tab\n3. Select "Upload Planning Permission"\n4. Choose your PDF file (max 20MB)\n5. Our AI will automatically verify the document',
        role: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'Show me a demo',
          'What formats are accepted?',
          'How long does verification take?']};
    }

    // Default response
    return {
      id: Date.now().toString(),
      content: 'I understand you\'re asking about "' + userInput + '". Let me help you with that. Could you provide more details about what specific information you need?',
      role: 'assistant',
      timestamp: new Date(),
      suggestions: [
        'Create a project',
        'View analytics',
        'Upload documents',
        'Check property listings']};
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleActionClick = (action: AIAction) => {
    switch (action.type) {
      case 'navigate':
        window.location.href = action.data.path;
        break;
      case 'create':
        window.location.href = action.data.path;
        break;
      case 'search':
        // Handle search action
        break;
      case 'analyze':
        // Handle analyze action
        break;
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        toast.error('Voice recognition failed');
      };

      recognition.start();
    } else {
      toast.error('Voice recognition not supported');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={ scale: 0 }
            animate={ scale: 1 }
            exit={ scale: 0 }
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <FiMessageSquare className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={ opacity: 0, y: 20, scale: 0.95 }
            animate={ opacity: 1, y: 0, scale: 1 }
            exit={ opacity: 0, y: 20, scale: 0.95 }
            transition={ duration: 0.2 }
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FiCpu className="w-6 h-6" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 h-[400px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={ opacity: 0, y: 10 }
                    animate={ opacity: 1, y: 0 }
                    transition={ duration: 0.2 }
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">AI Assistant</span>
                        </div>
                      )}

                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.loading ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={ rotate: 360 }
                              transition={ duration: 2, repeat: Infinity, ease: "linear" }
                              className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                            />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestionindex) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {message.actions && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action) => (
                            <Button
                              key={action.id}
                              onClick={() => handleActionClick(action)}
                              size="sm"
                              className="w-full justify-start"
                              variant="outline"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={ opacity: 0 }
                    animate={ opacity: 1 }
                    className="flex items-center gap-2 text-gray-500"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">AI is typing...</span>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t bg-gray-50">
              <div className="flex gap-2">
                {quickActions.map((actionindex) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(action.prompt)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg bg-white border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-colors`}
                  >
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    <span className="text-xs text-gray-600">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiPaperclip className="w-5 h-5 text-gray-500" />
                </button>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                    isRecording ? 'bg-red-100' : ''
                  }`}
                >
                  <FiMic className={`w-5 h-5 ${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
                </button>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  <FiSend className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}