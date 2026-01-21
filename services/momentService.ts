import { getSupabaseClient } from '@/template';
import { Moment, Comment, Reaction } from '@/types';

class MomentService {
  private supabase = getSupabaseClient();

  async getMoments(userId: string): Promise<Moment[]> {
    // Get user's friends
    const { data: relationships } = await this.supabase
      .from('relationships')
      .select('related_user_id')
      .eq('user_id', userId);

    const friendIds = relationships?.map(r => r.related_user_id) || [];

    // Get moments from friends and self
    const { data, error } = await this.supabase
      .from('moments')
      .select(`
        id,
        user_id,
        image_url,
        caption,
        visibility,
        created_at,
        user_profiles (
          id,
          username,
          email,
          avatar,
          status
        )
      `)
      .or(`user_id.eq.${userId},user_id.in.(${friendIds.join(',')})`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get reactions and comments for each moment
    const moments: Moment[] = await Promise.all(
      (data || []).map(async (item: any) => {
        const { data: reactions } = await this.supabase
          .from('moment_reactions')
          .select('user_id, emoji, created_at')
          .eq('moment_id', item.id);

        const { data: comments } = await this.supabase
          .from('moment_comments')
          .select(`
            id,
            user_id,
            content,
            created_at,
            user_profiles (
              id,
              username,
              email,
              avatar
            )
          `)
          .eq('moment_id', item.id)
          .order('created_at', { ascending: true });

        return {
          id: item.id,
          userId: item.user_id,
          user: {
            id: item.user_profiles.id,
            username: item.user_profiles.username || item.user_profiles.email,
            displayName: item.user_profiles.username || item.user_profiles.email,
            avatar: item.user_profiles.avatar,
            status: item.user_profiles.status || 'offline',
          },
          imageUrl: item.image_url,
          caption: item.caption,
          timestamp: new Date(item.created_at),
          visibility: item.visibility,
          reactions: (reactions || []).map((r: any) => ({
            userId: r.user_id,
            emoji: r.emoji,
            timestamp: new Date(r.created_at),
          })),
          comments: (comments || []).map((c: any) => ({
            id: c.id,
            userId: c.user_id,
            user: {
              id: c.user_profiles.id,
              username: c.user_profiles.username || c.user_profiles.email,
              displayName: c.user_profiles.username || c.user_profiles.email,
              avatar: c.user_profiles.avatar,
              status: 'offline',
            },
            content: c.content,
            timestamp: new Date(c.created_at),
          })),
        };
      })
    );

    return moments;
  }

  async createMoment(userId: string, imageUri: string, caption?: string): Promise<Moment> {
    // Upload image to storage
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = `${userId}/${Date.now()}.jpg`;

    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('moments')
      .upload(fileName, blob);

    if (uploadError) throw uploadError;

    const { data: urlData } = this.supabase.storage
      .from('moments')
      .getPublicUrl(fileName);

    // Create moment in database
    const { data, error } = await this.supabase
      .from('moments')
      .insert({
        user_id: userId,
        image_url: urlData.publicUrl,
        caption,
        visibility: 'friends',
      })
      .select(`
        id,
        user_id,
        image_url,
        caption,
        visibility,
        created_at,
        user_profiles (
          id,
          username,
          email,
          avatar,
          status
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      user: {
        id: data.user_profiles.id,
        username: data.user_profiles.username || data.user_profiles.email,
        displayName: data.user_profiles.username || data.user_profiles.email,
        avatar: data.user_profiles.avatar,
        status: data.user_profiles.status || 'offline',
      },
      imageUrl: data.image_url,
      caption: data.caption,
      timestamp: new Date(data.created_at),
      visibility: data.visibility,
      reactions: [],
      comments: [],
    };
  }

  async addReaction(momentId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await this.supabase
      .from('moment_reactions')
      .upsert({
        moment_id: momentId,
        user_id: userId,
        emoji,
      });

    if (error) throw error;
  }

  async removeReaction(momentId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('moment_reactions')
      .delete()
      .eq('moment_id', momentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async addComment(momentId: string, userId: string, content: string): Promise<Comment> {
    const { data, error } = await this.supabase
      .from('moment_comments')
      .insert({
        moment_id: momentId,
        user_id: userId,
        content,
      })
      .select(`
        id,
        user_id,
        content,
        created_at,
        user_profiles (
          id,
          username,
          email,
          avatar
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      user: {
        id: data.user_profiles.id,
        username: data.user_profiles.username || data.user_profiles.email,
        displayName: data.user_profiles.username || data.user_profiles.email,
        avatar: data.user_profiles.avatar,
        status: 'offline',
      },
      content: data.content,
      timestamp: new Date(data.created_at),
    };
  }

  async deleteMoment(momentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('moments')
      .delete()
      .eq('id', momentId);

    if (error) throw error;
  }
}

export const momentService = new MomentService();
