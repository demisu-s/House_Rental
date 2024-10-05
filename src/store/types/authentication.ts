export interface RegisterData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  primaryPhoneNumber?: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  bio: string | null;
  created_at: string;
  email: string;
  firstName: string | null;
  id: number;
  imageUrl: string | null;
  lastName: string | null;
  mainPhoneNumber: string | null;
  secondaryPhoneNumber: string | null;
}

export interface UpdateUserProfile {
  bio?: string | undefined;
  email: string;
  firstName: string | null;
  imageUrl?: string | null;
  lastName: string | null;
  mainPhoneNumber: string | null;
  secondaryPhoneNumber?: string | undefined;
  image?: File;
}
