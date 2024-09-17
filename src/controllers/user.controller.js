import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

import { uploadoncloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/ApiResponse.js";

const registeterUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, phonenumber, password } = req.body;

  console.log("email", email);

  if (
    [fullname, email, phonenumber, password, username].some(
      (field) => field?.trim === " "
    )
  ) {
    throw new ApiError(400, " all fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  console.log("addddddddddd", existedUser);

  if (existedUser) {
    throw new ApiError(409, "User already existed");
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  //const coverPath = req.files?.coverImages[0]?.path;
  let coverPath;
  if(req.files && Array.isArray(req.files.coverImages) && req.files.coverImages.length > 0){
    coverPath = req.files.coverImages[0].path
  }

  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar is mandatory");
  }

  const avatar = await uploadoncloudinary(avatarlocalpath);
  const coverImages = await uploadoncloudinary(coverPath);

  const user = await User.create({
    fullname,
    avatar: avatar?.url,

    phonenumber,
    email,
    password,
    coverImages: coverImages?.url || " ",
    username: username.toLowerCase(),
  });

  console.log("user", user);
  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log("creatyeduser", createduser);

  if (!createduser) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new apiResponse(200, createduser, "created user succesfully"));
});
// get user details
// validation - notempty
//check if user already exist : usrname:email
//check for images and avatar
//upload to cloudinary
// cloudinary success

export { registeterUser };
