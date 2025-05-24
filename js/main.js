// Handle login/signup button clicks
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'Login.html';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = 'Login.html#signup';
            // Show signup form if we're already on the login page
            if (window.location.pathname.includes('Login.html')) {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('signup-form').classList.remove('hidden');
            }
        });
    }

    // Check if user is redirected to signup
    if (window.location.hash === '#signup') {
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
    }

    // Format credit card number with spaces
    const cardInput = document.getElementById('card_number');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 16) {
                value = value.substr(0, 16);
            }
            // Add space after every 4 digits
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // Format expiration date
    const expiryInput = document.getElementById('expiration-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = value;
                } else {
                    value = value.substr(0, 2) + '/' + value.substr(2, 2);
                }
                e.target.value = value;
            }
        });
    }

    // Store donation information for success page
    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            const amount = document.getElementById('amount').value;
            sessionStorage.setItem('donationAmount', amount);
            // Receipt number will be set by PHP
        });
    }
});

// Show/hide password functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}
