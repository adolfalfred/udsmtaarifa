export interface PostProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: PostTypesProps;
  media: {
    [key: number]: {
      url: string;
      blur: string | null;
      width: number | null;
      height: number | null;
      duration: number | null;
    };
  } | null;
  title: string | null;
  content: string | null;
  availability: boolean;
  likes: number;
  comments: number;
  postLikes: {
    userId: string;
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
  }[];
  postComments: {
    userId: string;
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    postId: string;
    commentId: string | null;
  }[];
  postCategories: {
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
  postUnits: {
    unitId: string;
    unit: {
      name: string;
      description: string | null;
      unitTypeId: number;
      unitType: {
        name: string;
        description: string | null;
      };
    };
  }[];
  postColleges: {
    collegeId: string;
    college: {
      name: string;
      code: string;
    };
  }[];
  postDepartments: {
    departmentId: string;
    department: {
      name: string;
      code: string;
      collegeId: string;
      college: {
        name: string;
        code: string;
      };
    };
  }[];
  postProgrammes: {
    programmeId: string;
    programme: {
      name: string;
      code: string;
      years: number;
    };
  }[];
  user: {
    id: string;
    name: string | null;
    regNo: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
}

export type PostTypesProps =
  | "college"
  | "department"
  | "category"
  | "news"
  | "class"
  | "special";
