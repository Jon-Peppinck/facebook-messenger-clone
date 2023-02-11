export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface Jwt {
  token: string;
}

export interface Credentials extends Jwt {
  user: UserDetails;
}
