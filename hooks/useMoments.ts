import { useState, useEffect } from 'react';
import { Moment } from '@/types';
import { momentService } from '@/services/momentService';
import { useAuth } from '@/template';

export function useMoments() {
  const { user } = useAuth();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoments();
    }
  }, [user]);

  const loadMoments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await momentService.getMoments(user.id);
      setMoments(data);
    } catch (err) {
      console.error('Failed to load moments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMoment = async (imageUri: string, caption?: string) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      const moment = await momentService.createMoment(user.id, imageUri, caption);
      setMoments(prev => [moment, ...prev]);
      return moment;
    } catch (err) {
      console.error('Failed to create moment:', err);
      throw err;
    }
  };

  const addReaction = async (momentId: string, emoji: string) => {
    if (!user) return;
    
    try {
      await momentService.addReaction(momentId, user.id, emoji);
      await loadMoments();
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const removeReaction = async (momentId: string) => {
    if (!user) return;
    
    try {
      await momentService.removeReaction(momentId, user.id);
      await loadMoments();
    } catch (err) {
      console.error('Failed to remove reaction:', err);
    }
  };

  const addComment = async (momentId: string, content: string) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      await momentService.addComment(momentId, user.id, content);
      await loadMoments();
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  };

  return {
    moments,
    loading,
    refresh: loadMoments,
    createMoment,
    addReaction,
    removeReaction,
    addComment,
  };
}