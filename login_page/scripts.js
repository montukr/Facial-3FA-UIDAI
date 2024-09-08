// Function to add spacing to Aadhaar number input after every 4 digits
document.getElementById("aadhaar").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s+/g, ''); // Remove existing spaces
    if (value.length > 12) {
        value = value.slice(0, 12); // Limit to 12 digits
    }
    let formattedAadhaar = value.match(/.{1,4}/g)?.join(" ") || value; // Add space every 4 digits
    e.target.value = formattedAadhaar;
});

// Function to validate captcha, Aadhaar length, and display OTP section
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get user input for Aadhaar and captcha
    const aadhaarInput = document.getElementById('aadhaar').value.replace(/\s+/g, ''); // Remove spaces
    const captchaInput = document.getElementById('captcha').value;
    const correctCaptcha = '39646'; // Hardcoded correct captcha value

    // Error message element
    const errorMessage = document.createElement('p');
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '14px';
    errorMessage.id = 'error-message';

    // Remove any previous error message
    const existingError = document.getElementById('error-message');
    if (existingError) {
        existingError.remove();
    }

    // Aadhaar number must be exactly 12 digits
    if (aadhaarInput.length !== 12) {
        errorMessage.textContent = 'Aadhaar number must be exactly 12 digits.';
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
        return; // Stop the form submission
    }

    // Validate the captcha
    if (captchaInput === correctCaptcha) {
        errorMessage.textContent = '';
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('otpMessage').textContent = 'Enter the OTP sent to mobile number *****0051';
        document.getElementById('loginBtn').style.display = 'none';
    } else {
        errorMessage.textContent = 'Captcha invalid. Please try again.';
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);
        document.getElementById('captcha').value = '';
    }
});

// Function to handle OTP verification and proceed to facial 3FA
document.getElementById("verifyOtpBtn").addEventListener("click", function () {
    const enteredOtp = document.getElementById("otp").value;
    const validOtp = "123456";
    let errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.id = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "16px";
        const otpSection = document.getElementById("otpSection");
        otpSection.insertBefore(errorMessage, document.getElementById("verifyOtpBtn"));
    }

    if (enteredOtp === validOtp) {
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
});

// Listen for messages from the iframe (face recognition status)
window.addEventListener('message', function (event) {
    const status = event.data.status;
    const loadingDiv = document.querySelector('.loading-animation');

    if (status === 'face-verified') {
        loadingDiv.innerHTML = 'Face Verified! Redirecting...';
        removeIframe();
        setTimeout(() => {
            window.location.href = 'verified.html';
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
