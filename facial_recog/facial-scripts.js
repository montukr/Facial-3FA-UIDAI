console.log(faceapi);

let faceMatcher = null;
let intervalId = null;
let faceVerified = false;
let faceNotVerified = false;
let noFaceDetected = true;

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('camera-permission-modal');
    const allowCameraBtn = document.getElementById('allow-camera-btn');
    const mainContent = document.getElementById('main-content');
    const videoFeed = document.getElementById('video-feed');

    // Show the modal when the page loads
    modal.style.display = 'flex';

    // When the user clicks "Allow Camera"
    allowCameraBtn.addEventListener('click', async () => {
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // If access is granted, set the video stream
            videoFeed.srcObject = stream;

            // Hide the modal and show the main content
            modal.style.display = 'none';
            mainContent.style.display = 'block';

            // Now that the camera is allowed, start face-api processing
            run();
        } catch (err) {
            alert("Camera access is required for this feature. Please allow access.");
        }
    });
});

const run = async () => {
    const videoFeedEl = document.getElementById('video-feed');
    const canvas = document.getElementById('canvas');

    // Load the models
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),

    ]);

    // Make the canvas the same size and in the same location as the video feed
    canvas.width = videoFeedEl.width;
    canvas.height = videoFeedEl.height;

    // Load the reference face image from the local folder
    const referenceImagePath = '../ref1.jpg'; // Update this path to the correct location
    const refImage = new Image();
    refImage.src = referenceImagePath;

    refImage.onload = async () => {
        // Detect face in the reference image and extract descriptors
        const refFaceAiData = await faceapi.detectAllFaces(refImage)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withAgeAndGender();

        if (!refFaceAiData.length) {
            console.error('No face detected in the reference image');
            return;
        }

        faceMatcher = new faceapi.FaceMatcher(refFaceAiData);
        console.log('Reference face loaded and processed');

        // Start the facial detection loop
        intervalId = setInterval(async () => {
            let faceAIData = await faceapi.detectAllFaces(videoFeedEl)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withAgeAndGender();

            // Clear the canvas
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // Resize and draw detections and landmarks
            faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);
            faceapi.draw.drawDetections(canvas, faceAIData);
            faceapi.draw.drawFaceLandmarks(canvas, faceAIData);

            // Handle face match detection logic
            handleFaceStatus(faceAIData);
        }, 50);
    };
};

function handleFaceStatus(faceAIData) {
    if (faceAIData.length > 0) {
        noFaceDetected = false;

        faceAIData.forEach(face => {
            const { age, gender, detection, descriptor } = face;
            const genderText = `${gender}`;
            const ageText = `${Math.round(age)} years`;
            const textField = new faceapi.draw.DrawTextField([genderText, ageText], detection.box.topRight);
            textField.draw(canvas);

            // Check the face match
            let label = faceMatcher.findBestMatch(descriptor).toString();
            let options;
            let boxColor;

            if (label.includes("unknown")) {
                options = { label: "No Match" };
                boxColor = 'red'; // Red box for no match
                setTimeout(() => {
                    if (!faceVerified && !faceNotVerified) {
                        window.parent.postMessage({ status: 'face-not-verified' }, '*');
                        faceNotVerified = true;
                        clearInterval(intervalId);
                    }
                }, 5000);
            } else {
                options = { label: "Match" };
                boxColor = 'green'; // Green box for match
                setTimeout(() => {
                    if (!faceVerified) {
                        window.parent.postMessage({ status: 'face-verified' }, '*');
                        faceVerified = true;
                        clearInterval(intervalId);
                    }
                }, 3000);
            }

            // Draw bounding box with color based on match
            const drawBox = new faceapi.draw.DrawBox(detection.box, { ...options, boxColor });
            drawBox.draw(canvas);
        });
    } else {
        setTimeout(() => {
            if (noFaceDetected) {
                window.parent.postMessage({ status: 'no-face-detected' }, '*');
                clearInterval(intervalId);
            }
        }, 7000);
    }
}
