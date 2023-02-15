export interface IProfile {
  userId: string;
  nickname: string;
  avatar: string;
}

export interface IChatRoom {
  name: string;
  roomId: string;
  members: string[];
  lastMsg?: IMessage;
}

export interface IChatRoomList {
  list: IChatRoom[];
  activeRoomId: string;
}

export interface IMessage {
  roomId: string;
  messageId: string;
  sentFrom: string;
  sentAt: Date;
  content: string;
  type: "TEXT" | "PHOTO" | "FILE";
}

export interface IMessageList {
  list: IMessage[];
}
