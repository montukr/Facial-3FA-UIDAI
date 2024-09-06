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
    errorMessage.style.fontSize = '12px';
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
        // Hide error message if captcha is correct
        errorMessage.textContent = '';
        
        // Display OTP section
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('otpMessage').textContent = 'Enter the OTP sent to mobile number *****0051';
        
        // Hide the "Receive OTP via SMS" button after it's clicked and validation succeeds
        document.getElementById('loginBtn').style.display = 'none';
    } else {
        // Show "captcha invalid" message and clear the input field
        errorMessage.textContent = 'Captcha invalid. Please try again.';
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);

        // Clear the captcha input field to prompt the user to enter again
        document.getElementById('captcha').value = '';
    }
});

// Function to handle OTP verification and proceed to facial 3FA
document.getElementById("verifyOtpBtn").addEventListener("click", function () {
    // Get the OTP entered by the user
    const enteredOtp = document.getElementById("otp").value;

    // The valid OTP value
    const validOtp = "123456";

    // Check if the error message element exists
    let errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
        // Create an error message element if it doesn't exist
        errorMessage = document.createElement("p");
        errorMessage.id = "error-message";
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "12px";

        // Insert the error message above the "Verify OTP" button
        const otpSection = document.getElementById("otpSection");
        otpSection.insertBefore(errorMessage, document.getElementById("verifyOtpBtn"));
    }

    // Check if the entered OTP matches the valid OTP
    if (enteredOtp === validOtp) {
        // OTP is valid, show success message
        errorMessage.textContent = "OTP Verified Successfully!";
        errorMessage.style.color = "green";

        // Remove the "Verify OTP" button
        document.getElementById("verifyOtpBtn").remove();

        // Create a new "Proceed to Facial 3FA" button
        const proceedBtn = document.createElement('button');
        proceedBtn.id = "proceedBtn";
        proceedBtn.textContent = "Proceed to Facial 3FA";
        proceedBtn.classList.add('proceed-btn'); // Add class for styling
        document.getElementById("otpSection").appendChild(proceedBtn);

        // Add event listener to the new button
        proceedBtn.addEventListener('click', function () {
            // Remove the "Proceed to Facial 3FA" button
            proceedBtn.remove();

            // Add a loading animation and text "Verifying"
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('loading-animation');
            loadingDiv.innerHTML = `<div class="loader"></div> Verifying Face...`;
            document.getElementById("otpSection").appendChild(loadingDiv);

            // Show iframe section when "Proceed to Facial 3FA" is clicked
            document.getElementById('iframeSection').style.display = 'block';
        });
    } else {
        // OTP is invalid, show error message
        errorMessage.textContent = "Invalid OTP. Please try again.";
        errorMessage.style.color = "red";
    }
});
