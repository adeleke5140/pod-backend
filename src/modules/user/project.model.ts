import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface IProjectModel extends IProjectDocument, mongoose.Document {}

export interface IProject extends IProjectDocument {
  _id: string;
}

export interface IProjectDocument {
  username: string;
  nftUri: string;
  projectHash: string;
  projectName: string;
  account: string;
  minContributions: number;
  twitter?: string;
  updatedAt?: Date | string;
  createdAt: Date | string;
  deletedAt?: Date | string;
}

const projectSchema: Schema = new Schema(
  {
    account: {
      required: true,
      trim: true,
      type: String,
    },
    nftUri: {
      required: true,
      trim: true,
      type: String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    projectHash: {
      type: String,
      unique: true,
      required: true,
    },
    projectName: {
      type: String,
      unique: true,
      required: true,
    },
    twitter: {
      sparse: true,
      type: String,
    },
    minContributions: {
      type: Number,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'project',
  },
);

export const projectModel: mongoose.Model<IProjectModel> = mongoose.model<IProjectModel>(
  'project',
  projectSchema,
);
