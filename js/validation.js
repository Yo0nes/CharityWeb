document.addEventListener('DOMContentLoaded', function() {
    // Password confirmation validation
    const signupForm = document.querySelector('.signup');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const password = document.getElementById('psword');
            const confirmPassword = document.getElementById('pswrd-conf');
            
            if (password.value !== confirmPassword.value) {
                e.preventDefault();
                alert('Passwords do not match!');
            }
        });
    }

    // Donation form validation and formatting
    const donationForm = document.querySelector('form[action="php/process_donation.php"]');
    if (donationForm) {
        // Card number formatting
        const cardInput = document.getElementById('card_number');
        if (cardInput) {
            cardInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                if (value.length > 16) {
                    value = value.substr(0, 16);
                }
                value = value.replace(/\D/g, '');
                // Format with spaces after every 4 digits
                value = value.replace(/(\d{4})/g, '$1 ').trim();
                e.target.value = value;
            });
        }

        // Expiration date formatting
        const expiryInput = document.getElementById('expiration-date');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length) {
                    if (value.length <= 2) {
                        if (value > 12) value = '12';
                    } else {
                        value = value.substr(0, 2) + '/' + value.substr(2, 2);
                    }
                }
                e.target.value = value;
            });
        }

        // Form submission validation
        donationForm.addEventListener('submit', function(e) {
            const cardNumber = document.getElementById('card_number');
            const expirationDate = document.getElementById('expiration-date');
            const securityCode = document.getElementById('security-code');
            const amount = document.getElementById('amount');
            
            // Validate amount
            if (amount.value <= 0) {
                e.preventDefault();
                alert('Please enter a valid donation amount');
                amount.focus();
                return;
            }
            
            // Validate card number (Luhn algorithm check)
            if (!validateCardNumber(cardNumber.value)) {
                e.preventDefault();
                alert('Please enter a valid credit card number');
                cardNumber.focus();
                return;
            }
            
            // Validate expiration date
            if (!validateExpirationDate(expirationDate.value)) {
                e.preventDefault();
                alert('Please enter a valid expiration date (MM/YY) that is not in the past');
                expirationDate.focus();
                return;
            }

            // Validate CVV
            const cvv = securityCode.value.trim();
            if (!/^\d{3,4}$/.test(cvv)) {
                e.preventDefault();
                alert('Please enter a valid CVV code (3 or 4 digits)');
                securityCode.focus();
                return;
            }

            // Store amount for success page
            sessionStorage.setItem('donationAmount', amount.value);
        });
    }
});

function validateCardNumber(number) {
    // Remove spaces and non-digit characters
    number = number.replace(/\D/g, '');
    
    if (number.length !== 16) {
        return false;
    }

    // Luhn algorithm implementation
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

function validateExpirationDate(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
    }

    const [month, year] = expiry.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    
    // Set expiration to end of month
    expDate.setDate(expDate.getDate() + 1);
    expDate.setDate(0);
    
    return expDate > today;
}
