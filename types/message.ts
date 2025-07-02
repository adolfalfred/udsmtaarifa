export interface MessageProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  media: {
    url: string;
    blur: string | null;
    width: number | null;
    height: number | null;
    duration: number | null;
  } | null;
  content: string | null;
  chat: {
    id: string;
    name: string;
    image: {
      url: string;
      blur: string | null;
      width: number | null;
      height: number | null;
    } | null;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    type: "chat" | "group";
  };
  user: {
    id: string;
    name: string | null;
    regNo: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
    notificationIds: string[];
  };
}
