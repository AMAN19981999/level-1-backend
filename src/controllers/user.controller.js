import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

import { uploadoncloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/ApiResponse.js";

import cookieParser from "cookie-parser";
import  jwt  from "jsonwebtoken";


const generateRefreshandAccestokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesToken = user.generateAccestoken();
    const refreshToken = user.generateRefreshtoken();
    user.refreshToken = refreshToken;

    await user.save({ ValidateBeforeSave: false });

    return { accesToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      " internal seerver error someting went wrong while generating token"
    );
  }
};

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
  if (
    req.files &&
    Array.isArray(req.files.coverImages) &&
    req.files.coverImages.length > 0
  ) {
    coverPath = req.files.coverImages[0].path;
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

const loginUser = asyncHandler(async (req, res) => {
  //body email,password,username
  // check for login validation
  //password correcte eneterd
  // accestoekn and refeshtoken
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "username or email required ");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });

  console.log("user", user);

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }

  const passwordUser = await user.isPasswordCorrect(password);
  if (!passwordUser) {
    throw new ApiError(401, " invalid password");
  }

  const { accesToken, refreshToken } = await generateRefreshandAccestokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accesToken", accesToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accesToken,
          refreshToken,
        },

        "User logged in succesfull"
      )
    );
});

const loggedOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accesToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User Logged Out"));
});




const generateRefershToken =  asyncHandler (async(req,res) => {
const genertedtoken = req.cookie.accesToken || req.body;
if(!genertedtoken) {
  throw new ApiError(401 ," invalid token");
}

try {
  const decodeToken = jwt.verify(genertedtoken,process.env.REFRESH_TOKEN_SECRET)
  
  const user = await User.findById(decodeToken?._id)
  if(!user){
    throw new ApiError(401 , " invalid user")
  }
  
  if(genertedtoken!==user?.refreshToken)
  {
    throw new ApiError(401 ,'refresh token expired')
  }
  
  const options = {
    httpOnly : true,
    secure:true
  }
  
  
  const {accesToken,newrefreshToken} = await generateRefreshandAccestokens(user._id)
  
  return res
  .status(200)
  .cookie("accesToken", accesToken, options)
  .cookie("refreshToken", newrefreshToken, options)
  .json(
    new apiResponse(
      200,
      {
       
        accesToken,
        refreshToken:newrefreshToken
      },
  
      "refersh token succesfull"
    )
  );
} catch (error) {

  throw new ApiError ( 500 , "Internal server error")
  
}


});












export { registeterUser, loginUser, loggedOutUser, generateRefershToken};
