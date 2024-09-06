// Function to add spacing to Aadhaar number input after every 4 digits
document.getElementById("aadhaar").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s+/g, ''); // Remove existing spaces
    if (value.length > 12) {
        value = value.slice(0, 12); // Limit to 12 digits
    }
    let formattedAadhaar = value.match(/.{1,4}/g)?.join(" ") || value; // Add space every 4 digits
    e.target.value = formattedAadhaar;
});

// Function to validate captcha and display OTP message
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get user input for captcha
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

    // Validate the captcha
    if (captchaInput === correctCaptcha) {
        // Hide error message if captcha is correct
        errorMessage.textContent = '';
        // Proceed to send OTP (you can add your OTP logic here)
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('otpMessage').textContent = 'Enter the OTP sent to mobile number *****0051';
    } else {
        // Show "captcha invalid" message and clear the input field
        errorMessage.textContent = 'Captcha invalid. Please try again.';
        document.getElementById('loginBtn').insertAdjacentElement('beforebegin', errorMessage);

        // Clear the captcha input field to prompt the user to enter again
        document.getElementById('captcha').value = '';
    }
});



// Function to handle OTP verification
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
        // OTP is valid, show success message in green
        errorMessage.textContent = "OTP Verified Successfully!";
        errorMessage.style.color = "green"; // Change color to green for success
    } else {
        // OTP is invalid, show error message in red
        errorMessage.textContent = "Invalid OTP. Please try again.";
        errorMessage.style.color = "red"; // Ensure the message is red for errors
    }
});


