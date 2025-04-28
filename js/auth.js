// Authentication JavaScript for VanRakshak

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    
    // Section toggle handlers
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const adminLoginLink = document.getElementById('admin-login-link');
    const showUserLogin = document.getElementById('show-user-login');
    
    const userLoginSection = document.getElementById('user-login');
    const registerSection = document.getElementById('register-section');
    const adminLoginSection = document.getElementById('admin-login');
    
    function showSection(sectionToShow) {
        [userLoginSection, registerSection, adminLoginSection].forEach(section => {
            section.style.display = 'none';
        });
        sectionToShow.style.display = 'block';
    }
    
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registerSection);
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(userLoginSection);
    });
    
    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(adminLoginSection);
    });
    
    showUserLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(userLoginSection);
    });
    
    // Form handlers
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!validateEmail(email)) {
                showFormError('email', 'Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                showFormError('password', 'Password must be at least 6 characters');
                return;
            }
            
            handleUserLogin(email, password);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            if (!name.trim()) {
                showFormError('reg-name', 'Please enter your name');
                return;
            }
            
            if (!validateEmail(email)) {
                showFormError('reg-email', 'Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                showFormError('reg-password', 'Password must be at least 6 characters');
                return;
            }
            
            if (password !== confirmPassword) {
                showFormError('reg-confirm-password', 'Passwords do not match');
                return;
            }
            
            simulateRegister(name, email, password);
        });
    }
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            if (!validateEmail(email)) {
                showFormError('admin-email', 'Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                showFormError('admin-password', 'Password must be at least 6 characters');
                return;
            }
            
            handleAdminLogin(email, password);
        });
    }
    
    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFormError(fieldId, message) {
        const field = document.getElementById(fieldId);
        
        clearFormError(fieldId);
        
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFormError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Add input event listeners for validation
    ['email', 'password', 'reg-name', 'reg-email', 'reg-password', 'reg-confirm-password', 'admin-email', 'admin-password'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                clearFormError(id);
            });
        }
    });

    function setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    function handleUserLogin(email, password) {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
        
        setTimeout(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Simulate user authentication
            if (email && password) {
                setCurrentUser({
                    email: email,
                    role: 'user',
                    name: 'Forest User'
                });
                window.location.href = 'user-dashboard.html';
            } else {
                showFormError('email', 'Invalid credentials');
            }
        }, 1500);
    }
    
    function handleAdminLogin(email, password) {
        const submitButton = adminLoginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
        
        setTimeout(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Check for admin credentials
            if (email === 'admin@vanrakshak.org' && password === 'admin123') {
                setCurrentUser({
                    email: email,
                    role: 'admin',
                    name: 'Forest Admin'
                });
                window.location.href = 'admin-dashboard.html';
            } else {
                showFormError('admin-email', 'Invalid admin credentials');
            }
        }, 1500);
    }
    
    function simulateRegister(name, email, password) {
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';
        
        setTimeout(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            alert('Registration successful! Please log in with your new account.');
            showSection(userLoginSection);
        }, 1500);
    }
});