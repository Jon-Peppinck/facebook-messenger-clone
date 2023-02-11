import {useContext} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {Avatar, Button} from 'react-native-paper';
import {useQuery} from 'react-query';
import {useNavigate} from 'react-router-native';

import {AuthContext} from '../../shared/auth/contexts/auth.context';
import {baseUrl, get} from '../../shared/request';

const ChatsScreen = () => {
  const {jwt, onLogout} = useContext(AuthContext);

  useQuery(
    'presence',
    async () => {
      const {data: presence} = await get(baseUrl + '/presence');

      return presence;
    },
    {
      enabled: !!jwt,
    },
  );

  const navigate = useNavigate();

  const friends = [
    {id: 1, name: 'Jon'},
    {id: 2, name: 'Larry'},
    {id: 3, name: 'Barry'},
  ];

  return (
    <View style={styles.container}>
      {friends.map(friend => (
        <Pressable
          key={friend.id}
          onPress={() => navigate(`/chat/${friend.id}`)}>
          <View style={styles.friend}>
            <Avatar.Image
              size={72}
              style={styles.profilePicture}
              source={{
                uri: `https://randomuser.me/api/portraits/men/${friend.id}.jpg`,
              }}
            />
            <View>
              <Text>{friend.name}</Text>
              <Text>This was the last message | Sun</Text>
            </View>
          </View>
        </Pressable>
      ))}

      <Button onPress={onLogout}>Sign Out</Button>
    </View>
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

export default ChatsScreen;
