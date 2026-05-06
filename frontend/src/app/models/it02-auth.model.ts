export interface It02RegisterBody {
  username: string;
  password: string;
  confirm_password: string;
}

export interface It02LoginBody {
  username: string;
  password: string;
}

export interface It02LoginResponse {
  token: string;
  username: string;
}

export interface It02UserResponse {
  username: string;
}
