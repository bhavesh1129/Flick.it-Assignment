const {
  caputureImageViaNodeWebcam,
} = require("../utils/caputureImageViaNodeWebcam");
const tf = require("@tensorflow/tfjs");
const Jimp = require("jimp");
const cocoSsd = require("@tensorflow-models/coco-ssd");
const { validateImgUrl } = require("../utils/validateImgUrl");
const User = require("../models/user");

exports.captureImage = async (req, res) => {
  try {
    const imageData = await caputureImageViaNodeWebcam();
    const { shapes, colors } = await processFrame(imageData);
    res.json({ shapes, colors });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadImage = (req, res) => {
  try {
    const imageURL = `http://localhost:8080/backend/uploads/${req.file.filename}`;
    res.status(200).json({ image: imageURL });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addImageLink = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json("Please provide the image link.");
    }
    const isValidURL = await validateImgUrl(image);
    if (!isValidURL) {
      return res.status(400).json("Image URL is invalid.");
    }
    const result = await User.updateMany({}, { image });
    if (result.nModified === 0) {
      return res.status(404).json({ message: "No documents found to update." });
    }
    res.status(200).json({ message: "Image link saved successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const IMAGE_HEIGHT = 300; // Define the desired height of the input image
const IMAGE_WIDTH = 300; // Define the desired width of the input image

async function processFrame(frameData) {
  const tfImage = await loadFrameAsTensor(frameData);
  const reshapedImage = tfImage.reshape([1, IMAGE_HEIGHT, IMAGE_WIDTH, 3]); // Reshape the input tensor to match the expected format
  const shapes = await detectShapes(reshapedImage); // Pass the reshaped tensor to the model for shape detection
  const colors = await extractColors(shapes);
  return { shapes, colors };
}

async function loadFrameAsTensor(frameDataPath) {
  try {
    const image = await Jimp.read(frameDataPath);

    // Debugging: Log image properties
    console.log("Image Width:", image.bitmap.width);
    console.log("Image Height:", image.bitmap.height);
    console.log("Image MIME Type:", image.getMIME());

    // Convert the Jimp image to a buffer in PNG format
    const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Debugging: Log the image buffer
    console.log("Image Buffer:", imageBuffer);

    // Decode the image buffer into a TensorFlow tensor
    const tensor = tf.tensor(imageBuffer);

    return tensor;
  } catch (error) {
    throw new Error(
      `Error loading frame as TensorFlow tensor: ${error.message}`
    );
  }
}

async function detectShapes(tfImage) {
  try {
    const model = await cocoSsd.load();
    const predictions = await model.detect(tfImage);
    return predictions;
  } catch (error) {
    throw new Error(`Error detecting shapes: ${error.message}`);
  }
}

async function extractColors(shapes) {
  const colors = shapes.map(() => [255, 0, 0]);
  return colors;
}
