export interface IProductPreview {
  productID: string;
  name: string;
  category: {
    main: string;
    sub?: string;
  };
  brand: string; //lowercase
  image: {
    //merge
    main: string;
    icons?: string;
  };
}

export interface IProductDetail {
  fullname: string; // vietnamses
  image: {
    //merge
    gallery?: string[];
  };
  price: {
    sale?: number; //positive number
    old?: number;
    current?: number;
  };
  rating: {
    count: number;
    point: number;
  };
  articleElements?: string[]; //HTML elements
  parameters: TParameter[];
  relatedProducts: string[]; //IDs
}

export type TParameter = {
  k: string;
  v: string;
};

export interface IProductGenerated {
  _generated_sold: number; //random int
  _generated_remain: number; //random int
  _generated_preorder: boolean;
}

export interface IProduct extends IProductPreview, Partial<IProductDetail>, IProductGenerated {}

export interface IComment {
  commentID: string;
  authorID: string;
  avatar: string;
  content: string;
}

export interface IProductKey {
  productID: string;
  href: string;
}
