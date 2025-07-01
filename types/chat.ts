export interface ChatProps {
  id: string;
  name: string;
  description: string | null;
  image: {
    url: string;
    blur: string | null;
    width: number | null;
    height: number | null;
  } | null;
  type: "chat" | "group";
  createdAt: Date;
  updatedAt: Date;
  members: {
    createdAt: Date;
    updatedAt: Date;
    isAdmin: boolean;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      regNo: string | null;
      email: string | null;
      phone: string | null;
      notificationIds: string[];
    };
  }[];
  messages: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    media: {
      url: string;
      blur: string | null;
      width: number | null;
      height: number | null;
      duration: number | null;
    } | null;
    content: string | null;
  }[];
}
