export interface CommentProps {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  user: {
    id: string;
    name: string | null;
    regNo: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
  comments: {
    id: string;
    content: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string | null;
      regNo: string | null;
      email: string | null;
      phone: string | null;
      image: string | null;
    };
  }[];
}
