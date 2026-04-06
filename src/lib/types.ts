export type Post = {
  id: string;
  nickname: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  uid: string | null;
  likedBy: string[];
   pinned?: boolean;        
  reportCount?: number; 
};

export type Comment = {
  id: string;
  nickname: string;
  content: string;
  uid: string | null;
  likes: number;
  likedBy: string[];
  createdAt: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  bio: string;
  createdAt: string;
  followers: string[];
  following: string[];
  totalLikes: number;
};

export type NotificationType = "like" | "comment" | "follow" | "trending";

export type Notification = {
  id: string;
  recipientUid: string;       // who receives it
  senderNickname: string;     // who triggered it
  senderUid: string | null;
  type: NotificationType;
  message: string;
  postId?: string;            // optional — links to the post
  read: boolean;
  createdAt: string;
};