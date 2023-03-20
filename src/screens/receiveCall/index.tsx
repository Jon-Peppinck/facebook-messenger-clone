import {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Avatar, IconButton} from 'react-native-paper';
import {useNavigate} from 'react-router-native';

import {
  COLOR_ONLINE_GREEN,
  COLOR_RED,
  COLOR_WHITE,
} from '../../shared/constants/colors';
import {FriendsContext} from '../../shared/friends/contexts/friends.context';
import {CallDetails, CallResponse} from '../../shared/friends/models';

const ReceiveCallScreen = () => {
  const {friends, callDetails, respondToCall} = useContext(FriendsContext);

  const navigate = useNavigate();

  const foundFriend = friends.find(f => f.id === callDetails?.friendId);

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={144}
        source={{
          uri: `https://randomuser.me/api/portraits/men/${
            (callDetails as CallDetails).friendId
          }.jpg`,
        }}
      />
      <Text style={styles.nameText}>
        {foundFriend?.firstName} {foundFriend?.lastName}
      </Text>
      <Text>Video calling on Messenger...</Text>
      <View style={styles.responseToCallContainer}>
        <IconButton
          icon="phone"
          iconColor={COLOR_WHITE}
          style={{margin: 0, backgroundColor: COLOR_RED}}
          size={72}
          onPress={() => {
            respondToCall(CallResponse.Declined);
            navigate('/');
          }}
          accessibilityLabelledBy={undefined}
          accessibilityLanguage={undefined}
        />
        <IconButton
          icon="video"
          iconColor={COLOR_WHITE}
          style={{margin: 0, backgroundColor: COLOR_ONLINE_GREEN}}
          size={72}
          onPress={() => {
            respondToCall(CallResponse.Accepted);
            navigate(`/call/${callDetails!.meetingId}`);
          }}
          accessibilityLabelledBy={undefined}
          accessibilityLanguage={undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 40,
    fontWeight: '500',
  },
  responseToCallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    padding: 32,
  },
});

export default ReceiveCallScreen;
