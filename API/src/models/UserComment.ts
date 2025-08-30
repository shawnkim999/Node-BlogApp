import { Post } from "./Post";
import { User } from "./User";

export interface UserComment {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
  userId: number;
  post: Post;   // Relation to Post
  user: User;   // Relation to User
}