import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fs from "fs";
import env from "../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Upload file (buffer or file path) directly to Cloudinary
export const uploadToCloudinary = async (fileOrPath, folder = "joms") => {
  if (!fileOrPath) {
    throw new Error("No file provided for upload");
  }

  // Handle Multer MemoryStorage file (buffer)
  if (typeof fileOrPath === "object" && fileOrPath.buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error(`Cloudinary upload failed: ${error.message}`)
            );
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
          });
        }
      );

      Readable.from(fileOrPath.buffer).pipe(uploadStream);
    });
  }

  // Handle local file path or object with path property
  const filePath =
    typeof fileOrPath === "string" ? fileOrPath : fileOrPath?.path;

  if (filePath) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "auto",
      });

      // Cleanup local file if exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      };
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  throw new Error("Invalid file format provided for upload");
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export default cloudinary;
