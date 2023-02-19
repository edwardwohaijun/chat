import { MentionedUser } from "../types";

const validateMention = (msg: string, mentionList: MentionedUser): number[] => {
  let result: number[] = [];
  if (mentionList == null) {
    return result;
  }
  for (const [userId, nickname] of Object.entries(mentionList as Object)) {
    if (msg.indexOf(nickname) !== -1) {
      result.push(Number(userId));
    }
  }
  return result;
};

export { validateMention };
