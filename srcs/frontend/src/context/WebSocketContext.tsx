'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { UserContext, UserContextProvider } from './UserContext';

interface Message {
  message: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
}

interface WebSocketContextType {
  sendMessage: (recipientId: number, message: string) => void;
  messages: Message[];
  isConnected: boolean;
  clearMessages: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { userData } = useContext(UserContext);
  
  useEffect(() => {
    const connect = () => {
      const wsUrl = `ws://localhost:8000/ws/chat/`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to chat');
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'message') {
          setMessages(prev => {
            //check if message already exists
            const messageExists = prev.some(
              msg => 
                msg.message === message.message && 
                msg.timestamp === message.timestamp &&
                msg.sender_id === message.sender_id
            );
            
            if (messageExists) {
              return prev;
            }
            return [...prev, message];
          });
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from chat');
        setIsConnected(false);
        if (userData.id)
          setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    };
    if (!userData.id) {
      return;
    }
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userData.id]);

  const sendMessage = (recipientId: number, message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        recipient_id: recipientId,
        message: message,
        type: 'message',
      }));
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, messages, isConnected, clearMessages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
