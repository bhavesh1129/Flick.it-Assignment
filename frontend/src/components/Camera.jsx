import React, { useState } from 'react';
import axios from 'axios';

function Camera() {
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);

    const handleCaptureImage = async () => {
        try {
            const response = await axios.get('http://localhost:8080/images/capture');
            console.log(received);
            setCapturedImage(response.data.imagePath);
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <div>
            <h2>Webcam Capture</h2>
            {capturedImage ? (
                <div>
                    <img src={capturedImage} alt="Captured" />
                </div>
            ) : (
                <button onClick={handleCaptureImage}>Capture Image</button>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    )
}

export default Camera