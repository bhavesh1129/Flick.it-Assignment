const validUrl = require("valid-url");

const validateImgUrl = async (image) => {
  try {
    if (validUrl.isUri(image)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

module.exports = { validateImgUrl };
