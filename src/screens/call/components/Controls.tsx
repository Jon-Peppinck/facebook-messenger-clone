import {useContext} from 'react';
import {View} from 'react-native';

import {IconButton} from 'react-native-paper';
import {useNavigate} from 'react-router-native';
import {COLOR_BLACK, COLOR_WHITE} from '../../../shared/constants/colors';
import {FriendsContext} from '../../../shared/friends/contexts/friends.context';
import {CallActivity} from '../../../shared/friends/models';

const Controls = ({leave, toggleWebcam, toggleMic}: any) => {
  const {friend, setCallDetails, setCallActivity} = useContext(FriendsContext);

  const navigate = useNavigate();

  return (
    <View
      style={{
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: 0.7,
        backgroundColor: COLOR_BLACK,
        height: 80,
      }}>
      <IconButton
        icon="video"
        iconColor={COLOR_WHITE}
        style={{margin: 0}}
        size={24}
        onPress={() => toggleWebcam()}
        accessibilityLabelledBy={undefined}
        accessibilityLanguage={undefined}
      />
      <IconButton
        icon="microphone"
        iconColor={COLOR_WHITE}
        style={{margin: 0}}
        size={24}
        onPress={() => toggleMic()}
        accessibilityLabelledBy={undefined}
        accessibilityLanguage={undefined}
      />
      <IconButton
        icon="phone"
        iconColor={COLOR_WHITE}
        background={'#FF0000'}
        style={{margin: 0}}
        size={24}
        onPress={() => {
          leave();
          setCallActivity(CallActivity.None);
          setCallDetails(null);
          navigate(`/chat/${friend.id}`);
        }}
        accessibilityLabelledBy={undefined}
        accessibilityLanguage={undefined}
      />
    </View>
  );
};

export default Controls;
