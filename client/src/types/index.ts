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
  draft?: string; // 用户输入了一半, 切换到其他chat window, 要把之前的一半文本保存下来, 便于下次切换回来继续输入.
}

export interface IChatRoomList {
  list: IChatRoom[];
  activeRoomId: string;
}

export interface IMessage {
  roomId: string;
  messageId: string;
  senderProfile: IProfile;
  // sentFrom: string;
  sentAt: string;
  content: string;
  type: "TEXT" | "PHOTO" | "FILE";
}

export interface IMessageList {
  list: IMessage[];
}
