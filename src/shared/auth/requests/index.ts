import {baseUrl, get, post} from '../../request';

import {Credentials, LoginUser, NewUser, UserDetails} from '../models';

export const getUsers = async () => {
  const {data: users} = await get<UserDetails[]>(`${baseUrl}/auth`);

  return users;
};

export const register = async (newUser: NewUser) => {
  const {data: user} = await post<UserDetails>(
    `${baseUrl}/auth/register`,
    newUser,
  );

  return user;
};

export const login = async (loginUser: LoginUser) => {
  const {data: credentials} = await post<Credentials>(
    `${baseUrl}/auth/login`,
    loginUser,
  );

  return credentials;
};
