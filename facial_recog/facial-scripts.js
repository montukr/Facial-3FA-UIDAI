console.log(faceapi);

let faceMatcher = null;
let intervalId = null;

const run = async () => {
    // Start the webcam stream
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });
    const videoFeedEl = document.getElementById('video-feed');
    videoFeedEl.srcObject = stream;

    // Load the models
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ]);

    // Make the canvas the same size and in the same location as the video feed
    const canvas = document.getElementById('canvas');
    canvas.style.left = videoFeedEl.offsetLeft + 'px';
    canvas.style.top = videoFeedEl.offsetTop + 'px';
    canvas.width = videoFeedEl.width;
    canvas.height = videoFeedEl.height;

    // Load the reference face image from local folder
    const referenceImagePath = '../ref1.jpg';  // Update this path to the correct location
    const refImage = new Image();
    refImage.src = referenceImagePath;

    refImage.onload = async () => {
        // Detect face in the reference image and extract descriptors
        const refFaceAiData = await faceapi.detectAllFaces(refImage).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
        if (!refFaceAiData.length) {
            console.error('No face detected in the reference image');
            return;
        }
        faceMatcher = new faceapi.FaceMatcher(refFaceAiData);
        console.log('Reference face loaded and processed');

        // Start the facial detection loop
        intervalId = setInterval(async () => {
            let faceAIData = await faceapi.detectAllFaces(videoFeedEl).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();

            // Clear the canvas
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // Resize and draw detections and landmarks
            faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);
            faceapi.draw.drawDetections(canvas, faceAIData);
            faceapi.draw.drawFaceLandmarks(canvas, faceAIData);

            // Loop over each detected face
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
                    // Red box for no match
                    boxColor = 'red'; 
                } else {
                    options = { label: "Match" };
                    // Green box for match
                    boxColor = 'green'; 
                }

                // Draw bounding box with color based on match
                const drawBox = new faceapi.draw.DrawBox(detection.box, { ...options, boxColor });
                drawBox.draw(canvas);

            });
        }, 50);
    };
};

// Run the script
run();
