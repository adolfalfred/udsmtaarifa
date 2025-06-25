export interface FeedbackProps {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  typeId: string;
  status: "submitted" | "pending" | "reviewed";
  reviewDate: Date | null;
  user: {
    id: string;
    name: string | null;
    regNo: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
}
