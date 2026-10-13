import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    avatarColor: {
      type: String,
      default: "#F4C95D",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Virtual to expose passwordHash for backward-compatibility if needed
userSchema.virtual("passwordHash").get(function () {
  return this.password;
});

export function toPublicUser(user) {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : user;
  return {
    id: (doc._id || doc.id)?.toString(),
    username: doc.username,
    displayName: doc.displayName || doc.username,
    avatarColor: doc.avatarColor || "#F4C95D",
    createdAt: doc.createdAt,
  };
}

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
