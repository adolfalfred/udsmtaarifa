export interface UserProps {
  id: string;
  name: string | null;
  regNo: string | null;
  email: string | null;
  phone: string | null;
  emailVerified: Date | null;
  image: string | null;
  userRoles: {
    roleId: string;
    role: {
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
  programme: {
    programmeId: string;
    startYear: number;
    currentStudyYear: number;
    programme: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      code: string;
      years: number;
      departmentId: string;
      department: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        collegeId: string;
        college: {
          id: string;
          name: string;
          createdAt: Date;
          updatedAt: Date;
          code: string;
        };
      };
    };
  }[];
  leadingUnits: {
    unitId: string;
    unit: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      description: string | null;
      unitTypeId: number;
      unitType: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
      };
    };
  }[];
  subscribedUnits: {
    unitId: string;
    unit: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      description: string | null;
      unitTypeId: number;
      unitType: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
      };
    };
  }[];
}
