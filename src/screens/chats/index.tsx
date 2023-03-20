import {useContext, useEffect} from 'react';

import {useNavigate} from 'react-router-native';

import Friends from '../../shared/friends/components/Friends';
import {FriendsContext} from '../../shared/friends/contexts/friends.context';
import {CallActivity} from '../../shared/friends/models';

const ChatsScreen = () => {
  const {callActivity} = useContext(FriendsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (callActivity === CallActivity.Receiving) {
      navigate('/receive-call');
    }
  }, [callActivity, navigate]);

  return <Friends showMessage />;
};

export default ChatsScreen;
