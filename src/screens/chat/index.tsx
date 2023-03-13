import {useContext, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {Appbar, Avatar, IconButton} from 'react-native-paper';
import {useNavigate, useParams} from 'react-router-native';

import {AuthContext} from '../../shared/auth/contexts/auth.context';
import Input from '../../shared/components/Input';
import {
  COLOR_BLACK,
  COLOR_FB_PRIMARY,
  COLOR_LIGHT_GRAY,
  COLOR_WHITE,
} from '../../shared/constants/colors';
import {FriendsContext} from '../../shared/friends/contexts/friends.context';

const ChatScreen = () => {
  const {userDetails} = useContext(AuthContext);
  const {messages, conversations, friend, sendMessage} =
    useContext(FriendsContext);
  const {friendId} = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const conversationId = conversations.find(conversation =>
    conversation.userIds.includes(+(friendId ?? -1)),
  )?.id;

  const conversationMessages = [...messages].filter(
    message => message.conversationId === conversationId,
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigate('/')} />

        <Avatar.Image
          size={36}
          source={{
            uri: `https://randomuser.me/api/portraits/men/${friendId}.jpg`,
          }}
        />

        <View style={{marginLeft: 8}}>
          <Text>
            {friend.firstName} {friend.lastName}
          </Text>
          <Text>{friend.isActive ? 'Active Now' : 'Active 4 hours ago'}</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 8,
          }}>
          <IconButton
            icon="phone"
            iconColor={COLOR_FB_PRIMARY}
            style={{margin: 0}}
            size={24}
            onPress={() => console.log('Call')}
          />
          <IconButton
            icon="video"
            iconColor={COLOR_FB_PRIMARY}
            style={{margin: 0}}
            size={24}
            onPress={() => console.log('Video Call')}
          />
        </View>
      </Appbar.Header>

      <ScrollView style={styles.chatContainer}>
        {conversationMessages.map((message, i) => (
          <View
            key={i}
            style={[
              styles.message,

              message.creatorId === userDetails?.id
                ? styles.userMessage
                : styles.friendMessage,
            ]}>
            <Text
              style={{
                color:
                  message.creatorId === userDetails?.id
                    ? COLOR_BLACK
                    : COLOR_WHITE,
              }}>
              {message.message}
            </Text>
          </View>
        ))}
        <View style={{height: 16}} />
      </ScrollView>

      <View
        style={[
          styles.inputContainer,
          {
            marginHorizontal: 16,
            marginBottom: 12,
          },
        ]}>
        <View style={{flex: 1}}>
          <Input
            mode="outlined"
            placeholder="Type a message..."
            value={text}
            onChangeText={setText}
          />
        </View>
        <IconButton
          icon="send"
          iconColor={COLOR_FB_PRIMARY}
          style={{margin: 0}}
          size={32}
          onPress={() => {
            if (!text || !conversationId) return;
            sendMessage(text, conversationId);
            setText(() => '');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  message: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: COLOR_LIGHT_GRAY,
    alignSelf: 'flex-start',
  },
  friendMessage: {
    backgroundColor: COLOR_FB_PRIMARY,
    alignSelf: 'flex-end',
  },
});

export default ChatScreen;
