// User shape stored in db.json's `users` array:
// {
//   id: string,
//   username: string,       // unique, lowercase
//   displayName: string,
//   passwordHash: string,
//   avatarColor: string,    // hex, used for the pixel avatar
//   createdAt: ISOString
// }

export function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
