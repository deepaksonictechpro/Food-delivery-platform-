const fs = require("fs");

// delete file safely
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.log("File delete error:", err.message);
  }
};

module.exports = { deleteFile };