import {createContext, useState, ReactNode} from 'react';

import {useMutation} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Credentials, LoginUser, UserDetails} from '../models';
import {login} from '../requests';

export interface IAuthContext {
  userDetails?: UserDetails;
  jwt?: string;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  onLogin: (loginUser: LoginUser) => void;
  onLogout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userDetails: undefined,
  jwt: undefined,
  isLoggedIn: false,
  isLoggingIn: false,
  onLogin: () => null,
  onLogout: () => null,
});

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [jwt, setJwt] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginMutation = useMutation(
    (loginUser: LoginUser) => login(loginUser),
    {
      onSuccess: credentials => {
        setUserDetails(credentials.user);
        setJwt(credentials.token);
        setIsLoggedIn(true);
        _storeCredentials(credentials);
      },

      onSettled: () => {
        setIsLoggingIn(false);
      },
    },
  );

  const _storeCredentials = async (credentials: Credentials) => {
    try {
      await AsyncStorage.setItem('credentials', JSON.stringify(credentials));
    } catch (error) {
      console.log(error);
    }
  };

  const loginHandler = (loginUser: LoginUser) => {
    setIsLoggingIn(true);
    loginMutation.mutate(loginUser);
  };

  const logoutHandler = () => {
    setUserDetails(undefined);
    setJwt(undefined);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        jwt,
        isLoggedIn,
        isLoggingIn,
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
