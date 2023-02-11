import {useContext, useState} from 'react';

import {NativeRouter, Route, Routes} from 'react-router-native';
import {BottomNavigation as NavScreens, Text} from 'react-native-paper';

import {AuthContext} from '../shared/auth/contexts/auth.context';
import {navRoutes} from '../shared/constants/navRoutes';
import ChatsScreen from './chats';
import RegisterScreen from './register';
import LoginScreen from './login';
import ChatScreen from './chat';

const Screens = () => {
  const {isLoggedIn} = useContext(AuthContext);

  const [index, setIndex] = useState(0);
  const [routes] = useState(navRoutes);

  const renderScene = NavScreens.SceneMap({
    chats: () => <ChatsScreen />,
    calls: () => <Text>Calls</Text>,
    people: () => <Text>People</Text>,
    stories: () => <Text>Stories</Text>,
  });

  return (
    <NativeRouter>
      {isLoggedIn ? (
        <Routes>
          <Route
            path="/"
            element={
              <NavScreens
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
            }
          />
          <Route
            path="/login"
            element={
              <NavScreens
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
            }
          />
          <Route path="/chat/:chatId" element={<ChatScreen />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<RegisterScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      )}
    </NativeRouter>
  );
};

export default Screens;
