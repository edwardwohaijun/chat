export interface IProfile {
  _id?: string; // to match with objectId in mongoDB
  userId: number;
  nickname: string;
  avatar?: string;
}

export interface IProfileList {
  list: IProfile[];
}

export interface IChatRoom {
  _id?: string;
  name: string;
  roomId: number;
  members: number[];
  lastMsg?: IMessage;
  draft?: string; // 用户输入了一半, 切换到其他chat window, 要把之前的一半文本保存下来, 便于下次切换回来继续输入.
}

export interface IChatRoomList {
  list: IChatRoom[];
  activeRoomId: number;
}

export interface IMessage {
  _id?: string;
  roomId: number;
  messageId: string; // locally generated by uuid()
  senderProfile: IProfile;
  mentions?: number[];
  sentAt: string;
  content: string;
  type: "TEXT" | "PHOTO" | "FILE";
}

export interface IMessageList {
  list: IMessage[];
}
