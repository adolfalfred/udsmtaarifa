export interface UnitProps {
  id: string;
  name: string;
  description: string | null;
  unitTypeId: number;
  createdAt: Date;
  updatedAt: Date;
  unitType: {
    name: string;
    description: string | null;
  };
}
