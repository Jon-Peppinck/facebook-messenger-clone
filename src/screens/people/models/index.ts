import {UserDetails} from './../../../shared/auth/models';

export interface FriendRequest {
  id: number;
  creator: UserDetails;
  receiver: UserDetails;
}
