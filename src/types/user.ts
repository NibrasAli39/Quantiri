export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  hashedPassword?: string;
}
