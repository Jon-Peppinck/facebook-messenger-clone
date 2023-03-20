import {View} from 'react-native';

import {useMeeting} from '@videosdk.live/react-native-sdk';

import ParticipantList from './ParticipantList';
import Controls from './Controls';
import {useEffect, useState} from 'react';

const MeetingView = () => {
  const {join, leave, toggleWebcam, toggleMic, participants} = useMeeting({});

  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (hasJoined) return;

    setHasJoined(true);

    const joinCall = async () => {
      await join();
      console.log(participants);
    };

    joinCall().catch(e => console.log(e));

    return () => {
      if (hasJoined) {
        const leaveCall = async () => {
          await leave();
        };

        leaveCall().catch(e => console.log(e));
      }
    };
  }, []);

  const participantsArrId = [...participants.keys()];

  return (
    <View style={{flex: 1}}>
      <ParticipantList participants={participantsArrId} />
      <Controls
        leave={leave}
        toggleWebcam={toggleWebcam}
        toggleMic={toggleMic}
      />
    </View>
  );
};

export default MeetingView;
