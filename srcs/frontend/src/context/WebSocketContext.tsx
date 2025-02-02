'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './UserContext';

interface Message {
  message: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
}

type Notifications ={
  id: number,
  user: number,
  notification_type: string,
  message: string,
  created_at: string,
  read: boolean,
}

interface WebSocketContextType {
  close: () => void;
  sendMessage: (recipientId: number, message: string) => void;
  messages: Message[];
  isConnected: boolean;
  clearMessages: () => void;
  notification: boolean;
  setNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { userData } = useContext(UserContext);
  const [notification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([])
  const [onlineUser, setOnlineUser] = useState<{user_id:number, is_online:boolean}>({user_id:0, is_online:false});

  useEffect(() => {
      const wsUrl = `ws://localhost:8000/ws/chat/`;
      
      if (!ws.current)
        ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to chat');
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.type === 'message'){
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
        if (message.type === 'notification'){
          setNotifications(prev => {
            const notificationExists = prev.some(
              notif =>
                notif.message === message.message &&
                notif.created_at === message.created_at &&
                notif.user === message.user
            );
            if (notificationExists){
              return prev;
            }
            return [...prev, message];
          });
          setNotification(true)
        }
        if (message.type === 'online') {
          const { user_id, is_online } = message;
          setOnlineUser({user_id: user_id, is_online: is_online});
          console.log(message);
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from chat');
        setIsConnected(false);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    if (!userData.id) {
      return;
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [notifications, userData.id]);

  const close = () => {
    if (ws.current) {
      ws.current.close();
    }
  }

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
    <WebSocketContext.Provider value={{close, sendMessage, messages, isConnected, clearMessages, notification ,setNotification, onlineUser }}>
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
