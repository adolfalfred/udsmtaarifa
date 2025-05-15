export interface CategoryProps {
  id: number;
  name: string | null;
  image: {
    url: string;
    blur: string | null;
    width: number | null;
    height: number | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
