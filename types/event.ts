export interface EventProps {
  date: Date | null;
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
  media: {
    [key: number]: {
      url: string;
      blur: string | null;
      width: number | null;
      height: number | null;
      duration: number | null;
    };
  } | null;
  organizers: {
    [key: number]: {
      name: string;
      url: string;
      image: {
        url: string | null;
        blur: string | null;
        width: number | null;
        height: number | null;
      };
    };
  } | null;
  categories: {
    categoryId: number;
    category: {
      name: string | null;
      image: {
        url: string;
        blur: string | null;
        width: number | null;
        height: number | null;
      } | null;
    };
  }[];
}
