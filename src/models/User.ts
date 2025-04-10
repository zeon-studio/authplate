import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  image: { type: String },
  emailVerified: { type: Boolean, default: false },
  isTermsAccepted: { type: Boolean, default: false },
  provider: { type: String },
});

const User = models?.User || model("User", UserSchema);

export default User;
