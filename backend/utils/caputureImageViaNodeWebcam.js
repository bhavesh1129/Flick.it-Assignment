const NodeWebCam = require("node-webcam");

var opts = {
  width: 1280,
  height: 720,
  quality: 100,
  frames: 60,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "location",
  verbose: false,
};

const webcam = NodeWebCam.create();
const caputureImageViaNodeWebcam = async () => {
  return new Promise((resolve, reject) => {
    webcam.capture("captured_image", (err, data) => {
      console.log("webcam " + data);
      if (err) {
        reject(err);
      }
      
      resolve(data);
    });
  });
};

module.exports = { caputureImageViaNodeWebcam };
