import {UserDetails} from './../../auth/models/index';

export interface ActiveFriend extends UserDetails {
  isActive: boolean;
}
