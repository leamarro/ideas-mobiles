export interface Mensaje {
  id: string;
  name: string;
  whatsapp: string | null;
  service: string | null;
  message: string;
  image: string | null;
  read: boolean;
  createdAt: string;
}
