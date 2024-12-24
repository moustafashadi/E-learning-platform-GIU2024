import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../_utils/axiosInstance';
import { Chat } from '../interfaces/chat.interface';

export function useChats(userId: string) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/chat/user/${userId}`);
      setChats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch chats');
      console.error('Error fetching chats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { chats, error, isLoading, refetch: fetchChats };
}