// Tab Switching Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// RSVP Form Submission to Google Sheets
// IMPORTANT: Replace 'YOUR_GOOGLE_SCRIPT_URL' with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweGV9TvDeWSlpYVHpUgbpkCJVjszrlefUiDuDxmoduYLtqNW35FhKYthdWhpcsGpv3Tw/exec';

document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const formStatus = document.getElementById('formStatus');

    // Disable submit button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        attendance: document.getElementById('attendance').value,
        guests: document.getElementById('guests').value,
        dietary: document.getElementById('dietary').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString()
    };

    try {
        // Send data to Google Sheets via Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData)
        });

        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            throw new Error('Unexpected response from server. Please ensure the Apps Script deployment allows access.');
        }
        console.log('RSVP response:', result);

        if (result.status !== 'success') {
            throw new Error(result.message || 'Submission failed.');
        }

        const statusDetails = [];
        if (result.email) {
            statusDetails.push(result.email.success ? 'Email confirmed' : `Email: ${result.email.message}`);
        }
        if (result.messaging) {
            statusDetails.push(result.messaging.success ? 'SMS sent' : `SMS: ${result.messaging.message}`);
        }

        const detailText = statusDetails.length ? ` (${statusDetails.join(' | ')})` : '';

        formStatus.textContent = `Thank you! Your RSVP has been submitted successfully.`;
        formStatus.classList.add('success');

        // Reset form
        this.reset();

    } catch (error) {
        console.error('Error:', error);
        const errorMessage = error && error.message ? ` ${error.message}` : '';
        formStatus.textContent = `There was an error submitting your RSVP.${errorMessage ? ' ' + errorMessage : ''}`;
        formStatus.classList.add('error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit RSVP';
    }
});

// Form validation - update guest count based on attendance
document.getElementById('attendance').addEventListener('change', function() {
    const guestsInput = document.getElementById('guests');
    if (this.value === 'no') {
        guestsInput.value = 0;
        guestsInput.disabled = true;
    } else {
        guestsInput.disabled = false;
        if (guestsInput.value === '0') {
            guestsInput.value = 1;
        }
    }
});
