import mongoose, { Schema } from "mongoose";
import "dotenv/config";

import bcrypt from "bcrypt";
import { JsonWebToken } from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,

      trim: true,
      index: true,
    },

    phonenumber: {
      type: Number,

      required: true,
      unique: true,
      index: true,
    },

    avatar: {
      type: String, //cloudinaryurl
      required: true,
    },
    coverImages: {
      type: String, //cloudinaryurl
      required: true,
    },

    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: " Video",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccestoken = function () {
  return JsonWebToken.sign(
    {
      id: this._id,
      email: this.email,
      userName: this.username,
      fullname: this.fullname,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshtoken = function () {
  return JsonWebToken.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
