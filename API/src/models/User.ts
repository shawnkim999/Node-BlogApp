import { Post } from "./Post";
import { UserComment } from "./UserComment";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  posts: Post[];
  comments: UserComment[];
  createdAt: Date;
}