import {useContext, useState} from 'react';
import {View} from 'react-native';

import {NativeRouter, Route, Routes} from 'react-router-native';
import {BottomNavigation as NavScreens, Text} from 'react-native-paper';

import {AuthContext} from '../shared/auth/contexts/auth.context';
import {FriendsContext} from '../shared/friends/contexts/friends.context';
import {navRoutes} from '../shared/constants/navRoutes';
import {CallActivity} from '../shared/friends/models';
import ChatsScreen from './chats';
import RegisterScreen from './register';
import LoginScreen from './login';
import ChatScreen from './chat';
import PeopleScreen from './people';
import CallScreen from './call';
import ReceiveCallScreen from './receiveCall';

const Screens = () => {
  const {isLoggedIn} = useContext(AuthContext);
  const {callActivity} = useContext(FriendsContext);

  const [index, setIndex] = useState(0);
  const [routes] = useState(navRoutes);

  const isReceivingCall = callActivity === CallActivity.Receiving;

  const inCall = [CallActivity.Accepted, CallActivity.Requesting].includes(
    callActivity,
  );

  const renderScene = NavScreens.SceneMap({
    chats: () => <ChatsScreen />,
    calls: () => <Text>Calls</Text>,
    people: () => <PeopleScreen />,
    stories: () => <Text>Stories</Text>,
  });

  const renderNavScreensRoute = () => {
    const paths = ['/', '/login'];

    return paths.map(path => (
      <Route
        key="path"
        path={path}
        element={
          <View style={{flex: 1, marginTop: 32}}>
            <NavScreens
              navigationState={{index, routes}}
              onIndexChange={setIndex}
              renderScene={renderScene}
            />
          </View>
        }
      />
    ));
  };

  return (
    <NativeRouter>
      {isLoggedIn ? (
        <Routes>
          {(!inCall || !isReceivingCall) && renderNavScreensRoute()}

          {<Route path="/receive-call" element={<ReceiveCallScreen />} />}

          <Route path="/chat/:friendId" element={<ChatScreen />} />

          <Route path="/call/:callId" element={<CallScreen />} />
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
