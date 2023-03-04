import {baseUrl, get} from '../../../shared/request';
import {FriendRequest} from '../models';

export const getFriendRequests = async () => {
  const {data: friendRequests} = await get<FriendRequest[]>(
    `${baseUrl}/get-friends`,
  );

  return friendRequests;
};
