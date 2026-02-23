// Load environment variables first
require("dotenv").config();

const ImageKit = require("imagekit");

// ⚠️ Check if ImageKit env variables are properly configured
if (!process.env.IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY === 'xxxxxxxx') {
  console.warn('⚠️ ImageKit keys not configured. Please update your .env file with proper ImageKit credentials.');
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file to ImageKit
 * @param {Buffer} file - file buffer (from multer)
 * @param {string} fileName - unique filename
 * @returns {Promise<{url: string, fileId: string}>}
 */
async function uploadFile(file, fileName) {
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Double-check env vars at runtime
    if (!process.env.IMAGEKIT_PUBLIC_KEY || 
        !process.env.IMAGEKIT_PRIVATE_KEY || 
        !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error("ImageKit is not properly configured. Please update your environment variables.");
    }

    const result = await imagekit.upload({
      file,       // buffer from multer
      fileName,   // unique name
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw error; // Controller will handle this
  }
}

module.exports = {
  uploadFile,
};