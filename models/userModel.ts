import { NextFunction } from 'express';
import mongoose, { Date } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date | number;
  role: string;
  active: boolean;
  correctPassword: (
    actualPassword: string,
    candidatePassword: string
  ) => Promise<boolean>;
  passwordWasChanged: (issueTime: number) => boolean;
}

const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: [true, 'A user must have a name'] },
  email: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email format',
    },
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must confirm its password'],
    validate: {
      validator: function (input: string): boolean {
        return input === this.password;
      },
      message: 'Password confirm must be the same as password',
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew)
    this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  actualPassword: string,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, actualPassword);
};

userSchema.methods.passwordWasChanged = function (issueTime: number) {
  if (!this.passwordChangedAt) return false;

  const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
  return issueTime < changedTimestamp;
};

const User: mongoose.Model<User> = mongoose.model('User', userSchema);

export default User;
