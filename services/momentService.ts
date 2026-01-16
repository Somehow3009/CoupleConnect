import { Moment, Comment, Reaction } from '@/types';
import { mockMoments, mockCurrentUser } from './mockData';

class MomentService {
  private moments: Moment[] = [...mockMoments];

  async getMoments(): Promise<Moment[]> {
    // Sort by timestamp descending
    return this.moments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createMoment(imageUrl: string, caption?: string): Promise<Moment> {
    const newMoment: Moment = {
      id: `moment-${Date.now()}`,
      userId: mockCurrentUser.id,
      user: mockCurrentUser,
      imageUrl,
      caption,
      timestamp: new Date(),
      visibility: 'friends',
      reactions: [],
      comments: [],
    };

    this.moments.unshift(newMoment);
    return newMoment;
  }

  async addReaction(momentId: string, emoji: string): Promise<void> {
    const moment = this.moments.find(m => m.id === momentId);
    if (!moment) return;

    // Remove existing reaction from same user
    moment.reactions = moment.reactions.filter(r => r.userId !== mockCurrentUser.id);

    // Add new reaction
    moment.reactions.push({
      userId: mockCurrentUser.id,
      emoji,
      timestamp: new Date(),
    });
  }

  async removeReaction(momentId: string): Promise<void> {
    const moment = this.moments.find(m => m.id === momentId);
    if (!moment) return;

    moment.reactions = moment.reactions.filter(r => r.userId !== mockCurrentUser.id);
  }

  async addComment(momentId: string, content: string): Promise<Comment> {
    const moment = this.moments.find(m => m.id === momentId);
    if (!moment) throw new Error('Moment not found');

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: mockCurrentUser.id,
      user: mockCurrentUser,
      content,
      timestamp: new Date(),
    };

    moment.comments.push(comment);
    return comment;
  }

  async deleteMoment(momentId: string): Promise<void> {
    this.moments = this.moments.filter(m => m.id !== momentId);
  }
}

export const momentService = new MomentService();
