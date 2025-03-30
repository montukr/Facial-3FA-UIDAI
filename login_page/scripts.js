// // Function to add spacing to Aadhaar number input after every 4 digits
// document.getElementById("aadhaar").addEventListener("input", function (e) {
//     let value = e.target.value.replace(/\s+/g, ''); // Remove existing spaces
//     if (value.length > 12) {
//         value = value.slice(0, 12); // Limit to 12 digits
//     }
//     let formattedAadhaar = value.match(/.{1,4}/g)?.join(" ") || value; // Add space every 4 digits
//     e.target.value = formattedAadhaar;
// });

// // Aadhaar Validation using JSON
// async function validateAadhaar(aadhaarNumber) {
//     const errorMessage = document.createElement("p");
//     errorMessage.style.color = "red";
//     errorMessage.style.fontSize = "14px";
//     errorMessage.id = 'error-message';

//     // Remove existing error messages if any
//     const existingError = document.getElementById('error-message');
//     if (existingError) {
//         existingError.remove();
//     }

//     try {
//         // Fetch the JSON data
//         const response = await fetch('data.json'); // Ensure the correct path to your JSON file
//         const users = await response.json();

//         // Find the user with the matching Aadhaar number
//         const user = users.find(u => u.id === aadhaarNumber);

//         if (user) {
//             errorMessage.textContent = ""; // Clear any previous error
//             localStorage.setItem("userName", user.name); // Store the user's name in localStorage
//             return true;
//         } else {
//             errorMessage.textContent = "Aadhaar Number Invalid";
//             document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//             return false;
//         }
//     } catch (error) {
//         console.error("Error loading JSON:", error);
//         errorMessage.textContent = "Error loading Aadhaar data";
//         document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//         return false;
//     }
// }

// // Function to validate captcha, Aadhaar length, and display OTP section
// document.getElementById('loginForm').addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent form submission

//     // Get user input for Aadhaar and captcha
//     const aadhaarInput = document.getElementById('aadhaar').value.replace(/\s+/g, ''); // Remove spaces
//     const captchaInput = document.getElementById('captcha').value;
//     const correctCaptcha = '39646'; // Hardcoded correct captcha value

//     // Aadhaar number must be exactly 12 digits
//     if (aadhaarInput.length !== 12) {
//         const errorMessage = document.createElement('p');
//         errorMessage.textContent = 'Aadhaar number must be exactly 12 digits.';
//         errorMessage.style.color = 'red';
//         document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//         return; // Stop the form submission
//     }

//     // Validate the Aadhaar number with JSON
//     const isValidAadhaar = await validateAadhaar(aadhaarInput);
//     if (!isValidAadhaar) return;

//     // Validate the captcha
//     if (captchaInput === correctCaptcha) {
//         document.getElementById('otpSection').style.display = 'block';
//         document.getElementById('otpMessage').textContent = 'Enter the OTP sent to mobile number *****0051';
//         document.getElementById('loginBtn').style.display = 'none';
//     } else {
//         const errorMessage = document.createElement('p');
//         errorMessage.textContent = 'Captcha invalid. Please try again.';
//         errorMessage.style.color = 'red';
//         document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//         document.getElementById('captcha').value = '';
//     }
// });

// // Function to handle OTP verification and proceed to facial 3FA
// document.getElementById("verifyOtpBtn").addEventListener("click", function () {
//     const enteredOtp = document.getElementById("otp").value;
//     const validOtp = "123456";
//     let errorMessage = document.getElementById("error-message");
//     if (!errorMessage) {
//         errorMessage = document.createElement("p");
//         errorMessage.id = "error-message";
//         errorMessage.style.color = "red";
//         errorMessage.style.fontSize = "16px";
//         const otpSection = document.getElementById("otpSection");
//         otpSection.insertBefore(errorMessage, document.getElementById("verifyOtpBtn"));
//     }

//     if (enteredOtp === validOtp) {
//         errorMessage.textContent = "OTP Verified Successfully!";
//         errorMessage.style.color = "green";

//         // Remove OTP message and input box
//         document.getElementById("otpMessage").remove();
//         document.getElementById("otp").remove();
//         document.getElementById("verifyOtpBtn").remove();

//         // Add proceed button to 3FA
//         const proceedBtn = document.createElement('button');
//         proceedBtn.id = "proceedBtn";
//         proceedBtn.textContent = "Proceed to Facial 3FA";
//         proceedBtn.classList.add('proceed-btn');
//         document.getElementById("otpSection").appendChild(proceedBtn);

//         proceedBtn.addEventListener('click', function () {
//             proceedBtn.remove();
//             const loadingDiv = document.createElement('div');
//             loadingDiv.classList.add('loading-animation');
//             loadingDiv.innerHTML = '<div class="loader"></div> Verifying Face...';
//             document.getElementById("otpSection").appendChild(loadingDiv);
//             document.getElementById('iframeSection').style.display = 'block';
//         });
//     } else {
//         errorMessage.textContent = "Invalid OTP. Please try again.";
//         errorMessage.style.color = "red";
//     }
// });

// // Listen for messages from the iframe (face recognition status)
// window.addEventListener('message', function (event) {
//     const status = event.data.status;
//     const loadingDiv = document.querySelector('.loading-animation');

//     if (status === 'face-verified') {
//         loadingDiv.innerHTML = 'Face Verified! Redirecting...';
//         removeIframe();
//         setTimeout(() => {
//             window.location.href = '../before_after_login/after.html'; // Redirect after face verification
//         }, 2000);
//     } else if (status === 'face-not-verified') {
//         loadingDiv.innerHTML = 'Face Not Verified! <button id="tryAgainBtn">Try Again</button>';
//         removeIframe();
//         setupTryAgain();
//     } else if (status === 'no-face-detected') {
//         loadingDiv.innerHTML = 'No Face Detected! <button id="tryAgainBtn">Try Again</button>';
//         removeIframe();
//         setupTryAgain();
//     }
// });

// function setupTryAgain() {
//     const tryAgainBtn = document.getElementById('tryAgainBtn');
//     tryAgainBtn.addEventListener('click', function () {
//         document.getElementById('iframeSection').style.display = 'none';

//         // Prevent multiple iframes by removing any existing ones before adding new
//         const iframe = document.querySelector('iframe');
//         if (iframe) iframe.remove();

//         setTimeout(() => {
//             const iframeSection = document.getElementById('iframeSection');
//             const newIframe = document.createElement('iframe');
//             newIframe.src = '/facial_recog/facial.html';
//             newIframe.className = 'iframe-box';
//             iframeSection.appendChild(newIframe);
//             iframeSection.style.display = 'block';
//         }, 100);
//     });
// }

// function removeIframe() {
//     const iframeSection = document.getElementById('iframeSection');
//     const iframe = iframeSection.querySelector('iframe');

//     if (iframe) {
//         iframe.remove(); // Remove the iframe itself
//     }

//     // Hide the iframe section to remove borders, padding, and any other container styling
//     iframeSection.style.display = 'none';
// }





// // Function to add spacing to Aadhaar number input after every 4 digits
// document.getElementById("aadhaar").addEventListener("input", function (e) {
//     let value = e.target.value.replace(/\s+/g, ''); // Remove existing spaces
//     if (value.length > 12) {
//         value = value.slice(0, 12); // Limit to 12 digits
//     }
//     let formattedAadhaar = value.match(/.{1,4}/g)?.join(" ") || value; // Add space every 4 digits
//     e.target.value = formattedAadhaar;
// });

// // Aadhaar Validation using JSON
// async function validateAadhaar(aadhaarNumber) {
//     const errorMessage = document.createElement("p");
//     errorMessage.style.color = "red";
//     errorMessage.style.fontSize = "14px";
//     errorMessage.id = 'error-message';

//     // Remove existing error messages if any
//     const existingError = document.getElementById('error-message');
//     if (existingError) {
//         existingError.remove();
//     }

//     try {
//         // Fetch the JSON data
//         const response = await fetch('data.json'); // Ensure the correct path to your JSON file
//         const users = await response.json();

//         // Find the user with the matching Aadhaar number
//         const user = users.find(u => u.id === aadhaarNumber);

//         if (user) {
//             errorMessage.textContent = ""; // Clear any previous error
//             localStorage.setItem("userName", user.name); // Store the user's name in localStorage
//             return true;
//         } else {
//             errorMessage.textContent = "Aadhaar Number Invalid";
//             document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//             return false;
//         }
//     } catch (error) {
//         console.error("Error loading JSON:", error);
//         errorMessage.textContent = "Error loading Aadhaar data";
//         document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//         return false;
//     }
// }

// // Function to validate captcha, Aadhaar length, and send OTP using Twilio
// document.getElementById('loginForm').addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent form submission

//     // Get user input for Aadhaar and captcha
//     const aadhaarInput = document.getElementById('aadhaar').value.replace(/\s+/g, ''); // Remove spaces
//     const captchaInput = document.getElementById('captcha').value;
//     const correctCaptcha = '39646'; // Hardcoded correct captcha value

//     // Aadhaar number must be exactly 12 digits
//     if (aadhaarInput.length !== 12) {
//         const errorMessage = document.createElement('p');
//         errorMessage.textContent = 'Aadhaar number must be exactly 12 digits.';
//         errorMessage.style.color = 'red';
//         document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//         return; // Stop the form submission
//     }

//     // Validate the Aadhaar number with JSON
//     const isValidAadhaar = await validateAadhaar(aadhaarInput);
//     if (!isValidAadhaar) return;

//     // Validate the captcha
//     if (captchaInput === correctCaptcha) {
//         // Send OTP via Twilio
//         try {
//             const response = await fetch('http://localhost:3000/send-otp', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ aadhaarNumber: aadhaarInput })
//             });

//             const data = await response.json();
//             if (data.success) {
//                 document.getElementById('otpSection').style.display = 'block';
//                 document.getElementById('otpMessage').textContent = 'Enter the OTP sent to your registered mobile number';
//                 document.getElementById('loginBtn').style.display = 'none';
//             } else {
//                 alert('Failed to send OTP: ' + data.message);
//             }
//         } catch (error) {
//             console.error('Error sending OTP:', error);
//             alert('An error occurred while sending OTP.');
//         }
//     } else {
//         const errorMessage = document.createElement('p');
//         errorMessage.textContent = 'Captcha invalid. Please try again.';
//         errorMessage.style.color = 'red';
//         document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
//         document.getElementById('captcha').value = '';
//     }
// });

// // Function to handle OTP verification and proceed to facial 3FA
// document.getElementById("verifyOtpBtn").addEventListener("click", async function () {
//     const aadhaarInput = document.getElementById('aadhaar').value.replace(/\s+/g, ''); // Get the Aadhaar number
//     const enteredOtp = document.getElementById("otp").value;

//     try {
//         // Send request to the backend server to validate the OTP
//         const response = await fetch('http://localhost:3000/verify-otp', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 aadhaarNumber: aadhaarInput,
//                 otp: enteredOtp
//             })
//         });

//         const data = await response.json();
//         let errorMessage = document.getElementById("error-message");
//         if (!errorMessage) {
//             errorMessage = document.createElement("p");
//             errorMessage.id = "error-message";
//             errorMessage.style.color = "red";
//             errorMessage.style.fontSize = "16px";
//             const otpSection = document.getElementById("otpSection");
//             otpSection.insertBefore(errorMessage, document.getElementById("verifyOtpBtn"));
//         }

//         if (data.success) {
//             errorMessage.textContent = "OTP Verified Successfully!";
//             errorMessage.style.color = "green";

//             // Remove OTP message and input box
//             document.getElementById("otpMessage").remove();
//             document.getElementById("otp").remove();
//             document.getElementById("verifyOtpBtn").remove();

//             // Add proceed button to 3FA
//             const proceedBtn = document.createElement('button');
//             proceedBtn.id = "proceedBtn";
//             proceedBtn.textContent = "Proceed to Facial 3FA";
//             proceedBtn.classList.add('proceed-btn');
//             document.getElementById("otpSection").appendChild(proceedBtn);

//             proceedBtn.addEventListener('click', function () {
//                 proceedBtn.remove();
//                 const loadingDiv = document.createElement('div');
//                 loadingDiv.classList.add('loading-animation');
//                 loadingDiv.innerHTML = '<div class="loader"></div> Verifying Face...';
//                 document.getElementById("otpSection").appendChild(loadingDiv);
//                 document.getElementById('iframeSection').style.display = 'block';
//             });
//         } else {
//             errorMessage.textContent = "Invalid OTP. Please try again.";
//             errorMessage.style.color = "red";
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred during OTP verification.');
//     }
// });

// // Listen for messages from the iframe (face recognition status)
// window.addEventListener('message', function (event) {
//     const status = event.data.status;
//     const loadingDiv = document.querySelector('.loading-animation');

//     if (status === 'face-verified') {
//         loadingDiv.innerHTML = 'Face Verified! Redirecting...';
//         removeIframe();
//         setTimeout(() => {
//             window.location.href = '../before_after_login/after.html'; // Redirect after face verification
//         }, 2000);
//     } else if (status === 'face-not-verified') {
//         loadingDiv.innerHTML = 'Face Not Verified! <button id="tryAgainBtn">Try Again</button>';
//         removeIframe();
//         setupTryAgain();
//     } else if (status === 'no-face-detected') {
//         loadingDiv.innerHTML = 'No Face Detected! <button id="tryAgainBtn">Try Again</button>';
//         removeIframe();
//         setupTryAgain();
//     }
// });

// function setupTryAgain() {
//     const tryAgainBtn = document.getElementById('tryAgainBtn');
//     tryAgainBtn.addEventListener('click', function () {
//         document.getElementById('iframeSection').style.display = 'none';

//         // Prevent multiple iframes by removing any existing ones before adding new
//         const iframe = document.querySelector('iframe');
//         if (iframe) iframe.remove();

//         setTimeout(() => {
//             const iframeSection = document.getElementById('iframeSection');
//             const newIframe = document.createElement('iframe');
//             newIframe.src = '/facial_recog/facial.html';
//             newIframe.className = 'iframe-box';
//             iframeSection.appendChild(newIframe);
//             iframeSection.style.display = 'block';
//         }, 100);
//     });
// }

// function removeIframe() {
//     const iframeSection = document.getElementById('iframeSection');
//     const iframe = iframeSection.querySelector('iframe');

//     if (iframe) {
//         iframe.remove(); // Remove the iframe itself
//     }

//     // Hide the iframe section to remove borders, padding, and any other container styling
//     iframeSection.style.display = 'none';
// }





// Function to add spacing to Aadhaar number input after every 4 digits
document.getElementById("aadhaar").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s+/g, ''); // Remove existing spaces
    if (value.length > 12) {
        value = value.slice(0, 12); // Limit to 12 digits
    }
    let formattedAadhaar = value.match(/.{1,4}/g)?.join(" ") || value; // Add space every 4 digits
    e.target.value = formattedAadhaar;
});

// Aadhaar Validation using JSON
async function validateAadhaar(aadhaarNumber) {
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "14px";
    errorMessage.id = 'error-message';

    // Remove existing error messages if any
    const existingError = document.getElementById('error-message');
    if (existingError) {
        existingError.remove();
    }

    try {
        // Fetch the JSON data
        const response = await fetch('data.json'); // Ensure the correct path to your JSON file
        const users = await response.json();

        // Find the user with the matching Aadhaar number
        const user = users.find(u => u.id === aadhaarNumber);

        if (user) {
            errorMessage.textContent = ""; // Clear any previous error
            localStorage.setItem("userName", user.name); // Store the user's name in localStorage
            return true;
        } else {
            errorMessage.textContent = "Aadhaar Number Invalid";
            document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
            return false;
        }
    } catch (error) {
        console.error("Error loading JSON:", error);
        errorMessage.textContent = "Error loading Aadhaar data";
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
        return false;
    }
}

// Function to validate captcha, Aadhaar length, and send OTP using Twilio
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    // Remove any existing error messages
    const errorMessage = document.querySelector('#error-message');
    if (errorMessage) errorMessage.remove();

    // Get user input for Aadhaar and captcha
    const aadhaarInput = document.getElementById('aadhaar').value.replace(/\s+/g, ''); // Remove spaces
    const captchaInput = document.getElementById('captcha').value;
    const correctCaptcha = '39646'; // Hardcoded correct captcha value

    // Aadhaar number must be exactly 12 digits
    if (aadhaarInput.length !== 12) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Aadhaar number must be exactly 12 digits.';
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = "14px";
        errorMessage.id = 'error-message';
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
        return; // Stop the form submission
    }

    // Validate the Aadhaar number with JSON
    const isValidAadhaar = await validateAadhaar(aadhaarInput);
    if (!isValidAadhaar) return;

    // Validate the captcha
    if (captchaInput === correctCaptcha) {
        // Send OTP via Twilio
        try {
            const response = await fetch('http://localhost:3000/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ aadhaarNumber: aadhaarInput })
            });

            const data = await response.json();
            if (data.success) {
                document.getElementById('otpSection').style.display = 'block';
                document.getElementById('otpMessage').textContent = 'Enter the OTP sent to your registered mobile number';
                document.getElementById('loginBtn').style.display = 'none';
            } else {
                alert('Failed to send OTP: ' + data.message);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('An error occurred while sending OTP.');
        }
    } else {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Captcha invalid. Please try again.';
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = "14px";
        errorMessage.id = 'error-message';
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
        document.getElementById('captcha').value = '';
    }
});

// Function to handle OTP verification and proceed to facial 3FA
document.getElementById("verifyOtpBtn").addEventListener("click", async function () {
    const aadhaarInput = document.getElementById('aadhaar').value.replace(/\s+/g, ''); // Get the Aadhaar number
    const enteredOtp = document.getElementById("otp").value;

    try {
        // Send request to the backend server to validate the OTP
        const response = await fetch('http://localhost:3000/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aadhaarNumber: aadhaarInput,
                otp: enteredOtp
            })
        });

        const data = await response.json();
        let errorMessage = document.getElementById("error-message");
        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.id = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "16px";
            const otpSection = document.getElementById("otpSection");
            otpSection.insertBefore(errorMessage, document.getElementById("verifyOtpBtn"));
        }

        if (data.success) {
            errorMessage.textContent = "OTP Verified Successfully!";
            errorMessage.style.color = "green";

            // Remove OTP message and input box
            document.getElementById("otpMessage").remove();
            document.getElementById("otp").remove();
            document.getElementById("verifyOtpBtn").remove();

            // Add proceed button to 3FA
            const proceedBtn = document.createElement('button');
            proceedBtn.id = "proceedBtn";
            proceedBtn.textContent = "Proceed to Facial 3FA";
            proceedBtn.classList.add('proceed-btn');
            document.getElementById("otpSection").appendChild(proceedBtn);

            proceedBtn.addEventListener('click', function () {
                proceedBtn.remove();
                const loadingDiv = document.createElement('div');
                loadingDiv.classList.add('loading-animation');
                loadingDiv.innerHTML = '<div class="loader"></div> Verifying Face...';
                document.getElementById("otpSection").appendChild(loadingDiv);
                document.getElementById('iframeSection').style.display = 'block';
            });
        } else {
            errorMessage.textContent = "Invalid OTP. Please try again.";
            errorMessage.style.color = "red";
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during OTP verification.');
    }
});

// Listen for messages from the iframe (face recognition status)
window.addEventListener('message', function (event) {
    const status = event.data.status;
    const loadingDiv = document.querySelector('.loading-animation');

    if (status === 'face-verified') {
        loadingDiv.innerHTML = 'Face Verified! Redirecting...';
        removeIframe();
        setTimeout(() => {
            window.location.href = '../before_after_login/after.html'; // Redirect after face verification
        }, 2000);
    } else if (status === 'face-not-verified') {
        loadingDiv.innerHTML = 'Face Not Verified! <button id="tryAgainBtn">Try Again</button>';
        removeIframe();
        setupTryAgain();
    } else if (status === 'no-face-detected') {
        loadingDiv.innerHTML = 'No Face Detected! <button id="tryAgainBtn">Try Again</button>';
        removeIframe();
        setupTryAgain();
    }
});

function setupTryAgain() {
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    tryAgainBtn.addEventListener('click', function () {
        document.getElementById('iframeSection').style.display = 'none';

        // Prevent multiple iframes by removing any existing ones before adding new
        const iframe = document.querySelector('iframe');
        if (iframe) iframe.remove();

        setTimeout(() => {
            const iframeSection = document.getElementById('iframeSection');
            const newIframe = document.createElement('iframe');
            newIframe.src = '/facial_recog/facial.html';
            newIframe.className = 'iframe-box';
            iframeSection.appendChild(newIframe);
            iframeSection.style.display = 'block';
        }, 100);
    });
}

function removeIframe() {
    const iframeSection = document.getElementById('iframeSection');
    const iframe = iframeSection.querySelector('iframe');

    if (iframe) {
        iframe.remove(); // Remove the iframe itself
    }

    // Hide the iframe section to remove borders, padding, and any other container styling
    iframeSection.style.display = 'none';
}
