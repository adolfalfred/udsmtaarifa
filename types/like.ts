export interface LikeProps {
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
}
