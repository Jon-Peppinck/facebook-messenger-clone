import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import {Platform} from 'react-native';

import {useQuery} from 'react-query';
import {useParams} from 'react-router-native';
import SocketIOClient from 'socket.io-client';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundTimer from 'react-native-background-timer';

import {IP_ADDRESS} from '@env';

import getFriends from '../helpers/friends';
import {getFriendRequests} from '../../../screens/people/requests';
import {AuthContext} from '../../auth/contexts/auth.context';
import {UserDetails} from '../../auth/models';
import {
  ActiveFriend,
  CallActivity,
  CallDetails,
  CallResponse,
  ICallResponse,
} from '../models';
import {Conversation} from '../../../screens/chat/models/Conversation';
import {Message} from '../../../screens/chat/models/Message';

export interface IFriendsContext {
  friends: ActiveFriend[];
  friend: ActiveFriend;
  isLoading: boolean;
  conversations: Conversation[];
  messages: Message[];
  callDetails: CallDetails | null;
  callActivity: CallActivity;
  sendMessage: (text: string, conversationId: number) => void;
  setFriend: (friend: ActiveFriend) => void;
  setCallDetails: (callDetails: CallDetails | null) => void;
  setCallActivity: (callActivity: CallActivity) => void;
  startCall: (details: CallDetails) => void;
  respondToCall: (response: CallResponse) => void;
}

export const FriendsContext = createContext<IFriendsContext>({
  friends: [],
  friend: {} as ActiveFriend,
  isLoading: false,
  conversations: [],
  messages: [],
  callDetails: null,
  callActivity: CallActivity.None,
  sendMessage: () => null,
  setFriend: () => null,
  setCallDetails: () => null,
  setCallActivity: () => null,
  startCall: () => null,
  respondToCall: () => null,
});

export const FriendsProvider = ({children}: {children: ReactNode}) => {
  const {isActive, jwt, isLoggedIn, userDetails} = useContext(AuthContext);
  const {friendId} = useParams();

  const [friends, setFriends] = useState<ActiveFriend[]>([]);
  const [friend, setFriend] = useState<ActiveFriend>({} as ActiveFriend);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
  const [callActivity, setCallActivity] = useState<CallActivity>(
    CallActivity.None,
  );

  const chatBaseUrl = `http://${IP_ADDRESS ?? '10.0.2.2'}:7000`;

  const chatSocket = useMemo(
    () =>
      SocketIOClient(chatBaseUrl, {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: jwt,
            },
          },
        },
      }),
    [jwt, chatBaseUrl],
  );

  useEffect(() => {
    if (conversations.length > 0) return;

    chatSocket.on('getAllConversations', (allConversations: Conversation[]) => {
      setConversations(() => allConversations);
    });

    return () => {
      chatSocket.off('getAllConversations');
    };
  }, [chatSocket, conversations]);

  const startCall = (details: CallDetails) => {
    chatSocket.emit('startCall', details);
  };

  useEffect(() => {
    chatSocket.on('newMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);

      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: '1',
            channelName: 'name',
          },
          created => console.log(`createChannel returned '${created}'`),
        );

        PushNotification.localNotification({
          title: 'NEW Message - ANDROID',
          message: message.message,
          channelId: '1',
        });
      } else if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: '1',
          title: 'NEW Message - IOS',
          body: message.message,
        });
      }
    });

    chatSocket.on('receiveCall', (friendsCallDetails: CallDetails) => {
      setCallDetails(friendsCallDetails);
      setCallActivity(CallActivity.Receiving);
    });

    chatSocket.on('callResponse', (callResponse: ICallResponse) => {
      const hasFriendAccepted = callResponse.status === CallResponse.Accepted;

      setCallActivity(
        hasFriendAccepted ? CallActivity.Accepted : CallActivity.None,
      );
    });

    return () => {
      chatSocket.off('newMessage');
      chatSocket.off('receiveCall');
      chatSocket.off('callResponse');
    };
  }, [chatSocket, friends]);

  useEffect(() => {
    if (!isLoggedIn || isActive) return;

    BackgroundTimer.runBackgroundTimer(() => {
      // ping server to keep ws alive in background
      chatSocket.emit('ping');
    }, 3000);

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [chatSocket, isActive, isLoggedIn]);

  useQuery(
    'friendRequests',
    async () => {
      setIsLoading(true);

      const friendRequests = await getFriendRequests();

      const _friends = getFriends(
        friendRequests,
        (userDetails as UserDetails).id,
      );

      const activeFriends: ActiveFriend[] = _friends.map(f => ({
        ...f,
        isActive: false,
      }));

      setFriends(activeFriends);

      return _friends;
    },
    {
      enabled: isLoggedIn,
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  const presenceBaseUrl = `http://${IP_ADDRESS ?? '10.0.2.2'}:6000`;

  const presenceSocket = useMemo(
    () =>
      SocketIOClient(presenceBaseUrl, {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: jwt,
            },
          },
        },
      }),
    [jwt, presenceBaseUrl],
  );

  useEffect(() => {
    presenceSocket.emit('updateActiveStatus', isActive);

    presenceSocket.on(
      'friendActive',
      ({id, isActive: isFriendActive}: {id: number; isActive: boolean}) => {
        setFriends(prevFriends => {
          if (userDetails?.id === id) return prevFriends;

          const updatedFriends = [...prevFriends];
          const activeFriend = updatedFriends.find(f => f.id === id);

          if (!activeFriend) return prevFriends;

          activeFriend.isActive = isFriendActive;

          return updatedFriends;
        });
      },
    );

    return () => {
      presenceSocket.emit('updateActiveStatus', false);
      presenceSocket.off('friendActive');
    };
  }, [presenceSocket, isActive, userDetails]);

  const sendMessageHandler = (text: string, conversationId: number) => {
    if (!userDetails) return;

    const newMessage: Message = {
      message: text,
      creatorId: userDetails.id,
      conversationId,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    chatSocket.emit('sendMessage', {
      message: text,
      friendId,
      conversationId,
    });
  };

  const respondToCall = (response: CallResponse) => {
    if (!callDetails) return;

    if (response === CallResponse.Accepted) {
      chatSocket.emit('acceptCall', callDetails.friendId);
    } else {
      chatSocket.emit('declineCall', callDetails.friendId);
    }
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friend,
        isLoading,
        conversations,
        messages,
        callDetails,
        callActivity,
        sendMessage: (text, conversationId) =>
          sendMessageHandler(text, conversationId),
        setFriend,
        setCallDetails,
        setCallActivity,
        startCall,
        respondToCall,
      }}>
      {children}
    </FriendsContext.Provider>
  );
};
