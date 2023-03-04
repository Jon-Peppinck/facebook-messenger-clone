import {createContext, useState, ReactNode, useRef, useEffect} from 'react';
import {AppState} from 'react-native';

import {useMutation} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Credentials, LoginUser, UserDetails} from '../models';
import {login} from '../requests';

export interface IAuthContext {
  userDetails?: UserDetails;
  jwt?: string;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isActive: boolean;
  onLogin: (loginUser: LoginUser) => void;
  onLogout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userDetails: undefined,
  jwt: undefined,
  isLoggedIn: false,
  isLoggingIn: false,
  isActive: false,
  onLogin: () => null,
  onLogout: () => null,
});

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [jwt, setJwt] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
        isActive: isLoggedIn && appStateVisible === 'active',
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
