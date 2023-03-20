import {UserDetails} from './../../auth/models/index';

export interface ActiveFriend extends UserDetails {
  isActive: boolean;
}

export interface CallDetails {
  meetingId: string;
  friendId: number;
}

export enum CallResponse {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
}

export interface ICallResponse {
  status: CallResponse;
}

export enum CallActivity {
  None = 'NONE',
  Receiving = 'RECEIVING',
  Requesting = 'REQUESTING',
  Accepted = 'ACCEPTED',
}
