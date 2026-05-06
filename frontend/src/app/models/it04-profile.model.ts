export interface It04Profile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  birth_day: string;
  occupation: string;
  profile_image_base64: string;
  created_at: string;
}

export interface CreateIt04Profile {
  full_name: string;
  email: string;
  phone: string;
  birth_day: string;
  occupation: string;
  profile_image_base64: string;
}
