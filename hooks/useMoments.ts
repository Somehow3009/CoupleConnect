import { useState, useEffect } from 'react';
import { Moment } from '@/types';
import { momentService } from '@/services/momentService';

export function useMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoments();
  }, []);

  const loadMoments = async () => {
    try {
      setLoading(true);
      const data = await momentService.getMoments();
      setMoments(data);
    } catch (err) {
      console.error('Failed to load moments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMoment = async (imageUrl: string, caption?: string) => {
    try {
      const moment = await momentService.createMoment(imageUrl, caption);
      setMoments(prev => [moment, ...prev]);
      return moment;
    } catch (err) {
      console.error('Failed to create moment:', err);
      throw err;
    }
  };

  const addReaction = async (momentId: string, emoji: string) => {
    try {
      await momentService.addReaction(momentId, emoji);
      await loadMoments();
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const removeReaction = async (momentId: string) => {
    try {
      await momentService.removeReaction(momentId);
      await loadMoments();
    } catch (err) {
      console.error('Failed to remove reaction:', err);
    }
  };

  const addComment = async (momentId: string, content: string) => {
    try {
      await momentService.addComment(momentId, content);
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
