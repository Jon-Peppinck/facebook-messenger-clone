import {useContext, useEffect, useMemo, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';

import SocketIOClient from 'socket.io-client';
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
import {Message} from './models/Message';
import {Conversation} from './models/Conversation';

const ChatScreen = () => {
  const {jwt, userDetails} = useContext(AuthContext);
  const {chatId} = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const conversationId = conversations.find(conversation =>
    conversation.userIds.includes(+(chatId ?? -1)),
  )?.id;

  const conversationMessages = [...messages].filter(
    message => message.conversationId === conversationId,
  );

  const conversationBaseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:7000'
      : 'http://localhost:7000';

  const conversationSocket = useMemo(
    () =>
      SocketIOClient(conversationBaseUrl, {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: jwt,
            },
          },
        },
      }),
    [jwt, conversationBaseUrl],
  );

  useEffect(() => {
    if (conversations.length > 0) return;
    // conversationSocket.emit('getConversations');
    conversationSocket.on(
      'getAllConversations',
      (allConversations: Conversation[]) => {
        setConversations(() => allConversations);
      },
    );
    return () => {
      conversationSocket.off('getAllConversations');
    };
  }, [conversationSocket, conversations]);

  useEffect(() => {
    conversationSocket.on('newMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      conversationSocket.off('newMessage');
    };
  }, [conversationSocket]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigate('/')} />

        <Avatar.Image
          size={36}
          source={{
            uri: `https://randomuser.me/api/portraits/men/${chatId}.jpg`,
          }}
        />

        <View style={{marginLeft: 8}}>
          <Text>Name</Text>
          <Text>Active Now</Text>
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
        <Text>Chat Id: {chatId}</Text>
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
            if (!userDetails || !text) return;

            const newMessage: Message = {
              message: text,
              creatorId: userDetails.id,
              conversationId,
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);

            conversationSocket.emit('sendMessage', {
              message: text,
              friendId: chatId,
              conversationId,
            });

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
