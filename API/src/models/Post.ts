import { User } from "./User";
import { UserComment } from "./UserComment";

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  userId: number;
  user: User; // Relation to User
  comments: UserComment[];
}