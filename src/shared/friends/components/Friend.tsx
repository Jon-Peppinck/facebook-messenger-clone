import {View, Text, StyleSheet, Pressable} from 'react-native';

import {useNavigate} from 'react-router-native';
import {Avatar} from 'react-native-paper';

import {ActiveFriend} from '../models';
import {COLOR_ONLINE_GREEN} from '../../constants/colors';

type Props = {
  friend: ActiveFriend;
  showMessage?: boolean;
};

const Friend = ({friend, showMessage = false}: Props) => {
  const navigate = useNavigate();

  const {id, firstName, lastName, isActive} = friend;

  return (
    <Pressable key={friend.id} onPress={() => navigate(`/chat/${id}`)}>
      <View style={styles.friend}>
        <Avatar.Image
          size={72}
          style={styles.profilePicture}
          source={{
            uri: `https://randomuser.me/api/portraits/men/${id}.jpg`,
          }}
        />
        {isActive && (
          <Avatar.Icon
            size={14}
            icon="circle"
            color={COLOR_ONLINE_GREEN}
            style={{
              position: 'absolute',
              top: 48,
              left: 60,
              backgroundColor: COLOR_ONLINE_GREEN,
            }}
          />
        )}
        <View>
          <Text>
            {firstName} {lastName}
          </Text>
          {showMessage && <Text>This was the last message | Sun</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  friend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePicture: {
    marginRight: 8,
  },
});

export default Friend;
