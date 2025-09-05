/**
 * To-Do List App with Authentication
 * Developed by Raecia © 2023
 * 
 * Features:
 * - Add, delete, and filter tasks
 * - Task status management
 * - Date scheduling
 * - Input validation
 * - User authentication (sign up and login)
 * - Local storage persistence
 * - Visual effects and animations
 */

// Dark mode check (runs immediately)
(function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
})();

// Single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function() {
    // SIMPEL LOGIN - LANGSUNG MASUK
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        // Submit handler
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            
            if (!usernameInput || !usernameInput.value.trim()) {
                if (document.getElementById('username-error')) {
                    document.getElementById('username-error').textContent = 'Username is required';
                }
                isValid = false;
            }
            
            if (!passwordInput || !passwordInput.value) {
                if (document.getElementById('password-error')) {
                    document.getElementById('password-error').textContent = 'Password is required';
                }
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Show loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                submitBtn.disabled = true;
            }
            
            // LANGSUNG REDIRECT - Tidak perlu cek user
            setTimeout(function() {
                window.location.href = 'todo.html';
            }, 1000);
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    
    if (darkModeToggle && darkModeIcon) {
        if (localStorage.getItem('darkMode') === 'true') {
            darkModeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        
        darkModeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            
            if (isDark) {
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
    
    // Initialize other functions as needed
    initTodoApp();
    initSignupForm();
    
    /**
     * ================ COMMON UTILITY FUNCTIONS ================
     */

    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Append to body
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Animate element
    function animateElement(element) {
        element.classList.add('pulse');
        element.focus();
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 400);
    }

    /**
     * ================ TO-DO LIST APP FUNCTIONALITY ================
     */
    function initTodoApp() {
        // Only run this if we're on the todo list page
        if (!document.getElementById('todo-form')) return;
        
        const todoForm = document.getElementById('todo-form');
        const todoInput = document.getElementById('todo-input');
        const dateInput = document.getElementById('date-input');
        const todoList = document.getElementById('todo-list');
        const filterStatus = document.getElementById('filter-status');
        const emptyState = document.getElementById('empty-state');

        // Set today as the minimum date
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        // Initialize todos from localStorage or empty array
        let todos = JSON.parse(localStorage.getItem('todos')) || [];

        // Save todos to localStorage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        // Format date to be more readable
        function formatDate(dateString) {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }

        // Update the empty state visibility
        function updateEmptyState() {
            if (todos.length === 0) {
                emptyState.classList.remove('hidden');
            } else {
                emptyState.classList.add('hidden');
            }
        }

        // Render todos with filter
        function renderTodos(filterValue = 'all') {
            todoList.innerHTML = '';
            let filteredTodos = todos;
            
            // Filter by status if not 'all'
            if (filterValue !== 'all') {
                filteredTodos = todos.filter(todo => todo.status === filterValue);
            }
            
            filteredTodos.forEach((todo, idx) => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                // Determine status class
                const statusClass = todo.status || 'pending';
                li.innerHTML = `
                    <div class="todo-content">
                        <div class="todo-text">${todo.text}</div>
                        <div class="todo-info">
                            <div class="todo-date">
                                <i class="far fa-calendar-alt"></i>
                                ${formatDate(todo.date)}
                            </div>
                            <select class="todo-status-select ${statusClass}" data-index="${idx}" title="Change status">
                                <option value="pending" ${todo.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="in-progress" ${todo.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                <option value="completed" ${todo.status === 'completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn delete-btn" data-index="${idx}" title="Delete task">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                todoList.appendChild(li);
                setTimeout(() => {
                    li.style.opacity = '1';
                    li.style.transform = 'translateY(0)';
                }, 10);
            });
            updateEmptyState();
        }

        // Add new todo
        todoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = todoInput.value.trim();
            const date = dateInput.value;
            const status = 'pending'; // Default status for new tasks
            
            // Validate input
            if (!text) {
                showNotification('Please enter a task', 'error');
                animateElement(todoInput);
                return;
            }
            
            if (!date) {
                showNotification('Please select a date', 'error');
                animateElement(dateInput);
                return;
            }
            
            // Add new todo
            todos.push({ text, date, status, completed: false });
            saveTodos();
            
            // Clear form
            todoInput.value = '';
            dateInput.value = '';
            
            // Show success notification
            showNotification('Task added successfully!', 'success');
            
            // Render todos
            renderTodos(filterStatus.value);
        });

        // Handle todo actions (delete)
        todoList.addEventListener('click', function(e) {
            const deleteBtn = e.target.closest('.delete-btn');
            if (deleteBtn) {
                const idx = parseInt(deleteBtn.getAttribute('data-index'));
                const todoItem = deleteBtn.closest('.todo-item');
                todoItem.style.opacity = '0';
                todoItem.style.height = '0';
                todoItem.style.marginBottom = '0';
                todoItem.style.padding = '0';
                todoItem.style.overflow = 'hidden';
                setTimeout(() => {
                    todos.splice(idx, 1);
                    saveTodos();
                    renderTodos(filterStatus.value);
                    showNotification('Task deleted', 'warning');
                }, 300);
                return;
            }
        });

        // Handle status change via dropdown
        todoList.addEventListener('change', function(e) {
            const statusSelect = e.target.closest('.todo-status-select');
            if (statusSelect) {
                const idx = parseInt(statusSelect.getAttribute('data-index'));
                const newStatus = statusSelect.value;
                todos[idx].status = newStatus;
                saveTodos();
                renderTodos(filterStatus.value);
                showNotification(`Task marked as ${newStatus}`, 'success');
            }
        });
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeIcon = document.getElementById('dark-mode-icon');
        if (darkModeToggle && darkModeIcon) {
            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    darkModeIcon.classList.remove('fa-moon');
                    darkModeIcon.classList.add('fa-sun');
                } else {
                    darkModeIcon.classList.remove('fa-sun');
                    darkModeIcon.classList.add('fa-moon');
                }
            });
        }

        // Filter todos by status
        filterStatus.addEventListener('change', function() {
            renderTodos(this.value);
        });

        // Set today's date as default
        dateInput.valueAsDate = new Date();
        
        // Initial render
        renderTodos('all');
        
        // Add subtle animation to the header
        const header = document.querySelector('.app-header');
        if (header) {
            setTimeout(() => {
                header.style.transform = 'translateY(0)';
                header.style.opacity = '1';
            }, 100);
        }
    }

    /**
     * ================ SIGNUP FUNCTIONALITY ================
     */
    function initSignupForm() {
        // Only run this if we're on the signup page
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;
        
        const fullnameInput = document.getElementById('fullname');
        const emailInput = document.getElementById('email');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        const fullnameError = document.getElementById('fullname-error');
        const emailError = document.getElementById('email-error');
        const usernameError = document.getElementById('username-error');
        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');
        
        // Input validation functions
        function validateFullname(fullname) {
            if (!fullname) {
                return 'Full name is required';
            }
            if (fullname.length < 3) {
                return 'Full name must be at least 3 characters long';
            }
            return '';
        }
        
        function validateEmail(email) {
            if (!email) {
                return 'Email is required';
            }
            
            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return 'Please enter a valid email address';
            }
            return '';
        }
        
        function validateUsername(username) {
            if (!username) {
                return 'Username is required';
            }
            if (username.length < 3) {
                return 'Username must be at least 3 characters long';
            }
            
            // Check if username contains only allowed characters
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
                return 'Username can only contain letters, numbers, and underscores';
            }
            return '';
        }
        
        function validatePassword(password) {
            if (!password) {
                return 'Password is required';
            }
            if (password.length < 6) {
                return 'Password must be at least 6 characters long';
            }
            
            // Password strength check
            let strength = 0;
            if (password.match(/[a-z]+/)) strength += 1;
            if (password.match(/[A-Z]+/)) strength += 1;
            if (password.match(/[0-9]+/)) strength += 1;
            if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;
            
            if (strength < 3) {
                return 'Password should include uppercase, lowercase, numbers, and special characters';
            }
            
            return '';
        }
        
        function validateConfirmPassword(confirmPassword, password) {
            if (!confirmPassword) {
                return 'Please confirm your password';
            }
            if (confirmPassword !== password) {
                return 'Passwords do not match';
            }
            return '';
        }
        
        // Handle input events for real-time validation
        fullnameInput.addEventListener('input', function() {
            const error = validateFullname(fullnameInput.value);
            fullnameError.textContent = error;
            
            if (error) {
                fullnameInput.classList.add('invalid');
            } else {
                fullnameInput.classList.remove('invalid');
            }
        });
        
        emailInput.addEventListener('input', function() {
            const error = validateEmail(emailInput.value);
            emailError.textContent = error;
            
            if (error) {
                emailInput.classList.add('invalid');
            } else {
                emailInput.classList.remove('invalid');
            }
        });
        
        usernameInput.addEventListener('input', function() {
            const error = validateUsername(usernameInput.value);
            usernameError.textContent = error;
            
            if (error) {
                usernameInput.classList.add('invalid');
            } else {
                usernameInput.classList.remove('invalid');
            }
        });
        
        passwordInput.addEventListener('input', function() {
            const error = validatePassword(passwordInput.value);
            passwordError.textContent = error;
            
            if (error) {
                passwordInput.classList.add('invalid');
            } else {
                passwordInput.classList.remove('invalid');
            }
            
            // If confirm password is not empty, validate it again
            if (confirmPasswordInput.value) {
                const confirmError = validateConfirmPassword(confirmPasswordInput.value, passwordInput.value);
                confirmPasswordError.textContent = confirmError;
                
                if (confirmError) {
                    confirmPasswordInput.classList.add('invalid');
                } else {
                    confirmPasswordInput.classList.remove('invalid');
                }
            }
        });
        
        confirmPasswordInput.addEventListener('input', function() {
            const error = validateConfirmPassword(confirmPasswordInput.value, passwordInput.value);
            confirmPasswordError.textContent = error;
            
            if (error) {
                confirmPasswordInput.classList.add('invalid');
            } else {
                confirmPasswordInput.classList.remove('invalid');
            }
        });
        
        // Handle form submission
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all inputs
            const fullnameErrorMsg = validateFullname(fullnameInput.value);
            const emailErrorMsg = validateEmail(emailInput.value);
            const usernameErrorMsg = validateUsername(usernameInput.value);
            const passwordErrorMsg = validatePassword(passwordInput.value);
            const confirmPasswordErrorMsg = validateConfirmPassword(confirmPasswordInput.value, passwordInput.value);
            
            // Update error messages
            fullnameError.textContent = fullnameErrorMsg;
            emailError.textContent = emailErrorMsg;
            usernameError.textContent = usernameErrorMsg;
            passwordError.textContent = passwordErrorMsg;
            confirmPasswordError.textContent = confirmPasswordErrorMsg;
            
            // Check if there are any errors
            if (fullnameErrorMsg || emailErrorMsg || usernameErrorMsg || passwordErrorMsg || confirmPasswordErrorMsg) {
                return; // Don't submit if there are errors
            }
            
            // All validations passed, proceed with signup
            // This would normally send data to a server
            
            // For demo purposes, we'll simulate a successful signup
            // Simpan user ke localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({
                fullname: fullnameInput.value,
                email: emailInput.value,
                username: usernameInput.value,
                password: passwordInput.value
            });
            localStorage.setItem('users', JSON.stringify(users));
            showSuccessMessage();
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
        
        function showSuccessMessage() {
            // Create a success message element
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <div class="success-text">Account created successfully! Redirecting to login...</div>
            `;
            
            // Add it to the page
            document.querySelector('.auth-content').appendChild(successMessage);
        }
    }

    /**
     * ================ DARK MODE FUNCTIONALITY ================
     */
    function initDarkMode() {
        // Apply dark mode if it's saved in localStorage
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const darkModeIcons = document.querySelectorAll('#dark-mode-icon');
            darkModeIcons.forEach(icon => {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            });
        }
        
        // Set up dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                // Toggle dark mode class
                const isDarkMode = document.body.classList.toggle('dark-mode');
                
                // Save preference to localStorage
                localStorage.setItem('darkMode', isDarkMode);
                
                // Update all icons
                const darkModeIcons = document.querySelectorAll('#dark-mode-icon');
                darkModeIcons.forEach(icon => {
                    if (isDarkMode) {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                    } else {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                    }
                });
            });
        }
    }

    /**
     * ================ INITIALIZATION ================
     */
    // Run when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize Dark Mode (add this before other inits)
        initDarkMode();
        
        // Initialize the To-Do List App
        initTodoApp();
        
        // Initialize the Login Form
        initLoginForm();
        
        // Initialize the Signup Form
        initSignupForm();
    });
});
