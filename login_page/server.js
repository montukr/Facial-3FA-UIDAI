// Import required modules
const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();
app.use(bodyParser.json());  // To handle JSON body parsing

// CORS configuration for development, adjust in production
app.use(cors({ origin: '*' }));  // For production, replace '*' with the allowed frontend domain

// Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Check if environment variables are loaded
if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('Twilio credentials are missing from environment variables.');
    process.exit(1);
}

// Twilio client initialization
const client = new twilio(accountSid, authToken);

// In-memory storage for OTPs (or use a database in production)
const otpStorage = {};

// Function to generate a random 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();  // Generates a random 6-digit OTP
}

// API route to handle sending OTP
app.post('/send-otp', (req, res) => {
    const { aadhaarNumber } = req.body;

    // Read the updated data.json to find the user based on Aadhaar number
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        const usersData = JSON.parse(data);
        const user = usersData.find(u => u.id === aadhaarNumber);

        if (!user || !user.phone) {
            return res.status(404).json({ success: false, message: 'User not found or phone number not available' });
        }

        const phoneNumber = user.phone;
        const otp = generateOtp();  // Generate the OTP

        // Send the OTP using Twilio
        client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: phoneNumber
        })
        .then((message) => {
            console.log(`OTP sent successfully: ${message.sid}`);
            otpStorage[aadhaarNumber] = otp;  // Store the OTP temporarily for verification
            res.json({ success: true, message: 'OTP sent!' });
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, message: 'Failed to send OTP' });
        });
    });
});

// API route to verify OTP
app.post('/verify-otp', (req, res) => {
    const { aadhaarNumber, otp } = req.body;

    // Verify OTP
    const storedOtp = otpStorage[aadhaarNumber];
    if (storedOtp && storedOtp === otp) {
        delete otpStorage[aadhaarNumber];  // OTP is valid, remove it from storage
        res.json({ success: true, message: 'OTP verified successfully!' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
