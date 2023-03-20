import {useContext} from 'react';
import {SafeAreaView} from 'react-native';

import {MeetingProvider} from '@videosdk.live/react-native-sdk';

import {VIDEO_SDK_TOKEN} from '@env';

import {FriendsContext} from '../../shared/friends/contexts/friends.context';
import MeetingView from './components/MeetingView';
import {AuthContext} from '../../shared/auth/contexts/auth.context';

const CallScreen = () => {
  const {userDetails} = useContext(AuthContext);
  const {callDetails} = useContext(FriendsContext);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6FF'}}>
      {callDetails && userDetails && (
        <MeetingProvider
          config={{
            meetingId: callDetails?.meetingId,
            micEnabled: false,
            webcamEnabled: true,
            name: `${userDetails?.id}`,
          }}
          token={VIDEO_SDK_TOKEN}>
          <MeetingView />
        </MeetingProvider>
      )}
    </SafeAreaView>
  );
};

export default CallScreen;
