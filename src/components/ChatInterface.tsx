
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your FormFit AI coach. Upload a workout video or use your camera, and I'll analyze your form to help you exercise safely and effectively.",
    sender: 'ai',
    timestamp: new Date(),
  },
];

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, disabled = false }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsProcessing(true);
    
    try {
      const response = await onSendMessage(newMessage);
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="font-semibold">AI Coach Chat</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/20 border border-border'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'user' ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} />
                  )}
                  <span className="text-xs font-semibold">
                    {message.sender === 'user' ? 'You' : 'FormFit AI'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-secondary/20 border border-border max-w-[80%] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={14} />
                  <span className="text-xs font-semibold">FormFit AI</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about your form or exercises..."
            disabled={disabled || isProcessing}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={disabled || isProcessing || !newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
