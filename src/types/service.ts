export interface Service {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceFormData {
  title: string;
  description: string;
  image: string | null;
  category: string | null;
  order: number;
  published: boolean;
}
