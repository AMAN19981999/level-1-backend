import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadoncloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    //uplaod fike
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    //uploadedfile
    console.log("uplaoded the file", response.url);

    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); // remove the locally saved path temproary if operation failed
  }
};

export { uploadoncloudinary };

// Upload an image
// const uploadResult = await cloudinary.uploader
//   .upload(
//     "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
//     {
//       public_id: "shoes",
//     }
//   )
//   .catch((error) => {
//     console.log(error);
//   });

// console.log(uploadResult);
