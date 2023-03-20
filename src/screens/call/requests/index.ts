import {VIDEO_SDK_TOKEN} from '@env';

export const createMeeting = async (): Promise<string> => {
  const res = await fetch('https://api.videosdk.live/v2/rooms', {
    method: 'POST',
    headers: {
      authorization: `${VIDEO_SDK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const {roomId} = await res.json();

  return roomId;
};
