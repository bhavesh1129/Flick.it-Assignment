import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

function HomePage() {
    const [imageUrl, setImageUrl] = useState('');
    const [analysisResults, setAnalysisResults] = useState([]);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [lastUploadMethod, setLastUploadMethod] = useState('');

    const analyzeImage = async () => {
        try {
            const results = await axios.get('http://localhost:8080/images/capture');
            setAnalysisResults(results.data);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    };

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        setLastUploadMethod('image_link');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        axios.post('http://localhost:8080/images/upload', formData)
            .then(response => {
                const imageUrl = response.data.image;
                setImageUrl(imageUrl);
                setPreviewImageUrl(URL.createObjectURL(file));
                setLastUploadMethod('file_upload');
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };

    const handleWebcamCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoElement = document.createElement('video');
            videoElement.autoplay = true;
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = () => {
                const canvasElement = document.createElement('canvas');
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                const context = canvasElement.getContext('2d');
                context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                stream.getVideoTracks()[0].stop();
                const imageUrl = canvasElement.toDataURL('image/png');
                setImageUrl(imageUrl);
                setPreviewImageUrl(imageUrl);
                setLastUploadMethod('webcam_capture');
                videoElement.remove();
                canvasElement.remove();
            };
        } catch (error) {
            console.error('Error capturing image from webcam:', error);
        }
    };

    const renderPreviewImage = () => {
        return previewImageUrl ? (
            <img src={previewImageUrl} alt="Preview" className="w-full max-w-md mx-auto mb-4 rounded" />
        ) : null;
    };

    const addImageLinkToDB = () => {
        if (imageUrl) {
            axios.post('http://localhost:8080/images/addImageLink', { image: imageUrl })
                .then(response => {
                    console.log('Image link added successfully:', response.data);
                    window.alert('Image link added successfully');
                })
                .catch(error => {
                    console.error('Error adding image link:', error);
                    window.alert('Error adding image link');
                });
        } else {
            console.warn('No image link to add.');
            window.alert('No image link to add');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto">
                <div className="mt-8">
                    <div className="flex justify-center mb-4">
                        <input type="text" placeholder="Enter image URL" value={imageUrl} onChange={handleImageUrlChange} className="mr-2 border rounded px-2 py-1" />
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="mr-2 hidden w-80" id="upload" />
                        <br />
                        <label htmlFor="upload" className="cursor-pointer border rounded px-2 py-1">Upload Image</label>
                        <br />
                        <button onClick={handleWebcamCapture} className="ml-2 border rounded px-2 py-1">Capture from Webcam</button>
                        <button onClick={analyzeImage} className="ml-2 border rounded px-2 py-1 bg-blue-500 text-white hover:bg-blue-600">Analyze Image</button>
                    </div>
                    {renderPreviewImage()}
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Analysis Results:</h2>
                        <ul>
                            {analysisResults.map((result, index) => (
                                <li key={index}>{/* Display bounding boxes and labels */}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <button onClick={addImageLinkToDB} className="border rounded px-2 py-1 bg-green-500 text-white hover:bg-green-600">Add Image Link</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default HomePage;
