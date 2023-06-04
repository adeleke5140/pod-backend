import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface IUserModel extends IUserDocument, mongoose.Document {}

export interface IUser extends IUserDocument {
  _id: string;
}

export interface IUserDocument {
  username: string;
  fullname?: string;
  account?: string;
  accessToken: string;
  email?: string;
  twitter?: string;
  isEnabled: boolean;
  updatedAt?: Date | string;
  createdAt: Date | string;
  deletedAt?: Date | string;
}

const userSchema: Schema = new Schema(
  {
    account: {
      trim: true,
      type: String,
    },
    fullname: {
      trim: true,
      type: String,
    },
    email: {
      sparse: true,
      type: String,
    },
    username: {
      sparse: true,
      type: String,
      // unique:true
      required: true,
    },
    accessToken: {
      trim: true,
      type: String,
      required: true,
    },
    twitter: {
      sparse: true,
      type: String,
    },
    isEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'user',
  },
);

userSchema.index({ _id: 1, username: 1 }, { unique: true }); // indexing according to get-user-by-token
// userSchema.index({ _id: 1, email: 1, isEnabled: 1, isVerified: 1 }, { unique: true }); // indexing according to verify-by-username

export const userModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('user', userSchema);
