// Letter shape stored in db.json's `letters` array:
// {
//   id: string,
//   fromUsername: string,
//   toUsername: string,
//   body: string,
//   stamp: string,        // an emoji/pixel-stamp id chosen by the sender
//   paperColor: string,   // hex, chosen by the sender
//   read: boolean,
//   createdAt: ISOString
// }

export function toPublicLetter(letter) {
  return letter;
}
