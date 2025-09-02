/**
 * Easy Coding - Main JavaScript
 * Provides interactivity for the educational coding website
 */

document.addEventListener('DOMContentLoaded', function() {
    // -------------------- User Name Storage --------------------
    const userName = localStorage.getItem('easyCodeUserName');
    const userNameInput = document.getElementById('userName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const startLearningBtn = document.getElementById('startLearningBtn');
    
    // Display stored user name if available
    if (userName) {
        welcomeMessage.innerHTML = `<p>Welcome back, ${userName}! Ready to continue learning?</p>`;
        userNameInput.value = userName;
    }
    
    // Handle the start learning button
    startLearningBtn.addEventListener('click', function() {
        if (userNameInput.value.trim() !== '') {
            localStorage.setItem('easyCodeUserName', userNameInput.value.trim());
            welcomeMessage.innerHTML = `<p>Welcome, ${userNameInput.value.trim()}! Let's start learning!</p>`;
            
            // Scroll to courses section
            document.getElementById('courses').scrollIntoView({behavior: 'smooth'});
        } else {
            alert('Please enter your name to get started!');
        }
    });
    
    // Dark Mode functionality moved to dark-mode.js
    
    // -------------------- Course Progress Tracking --------------------
    const courses = document.querySelectorAll('.course');
    
    courses.forEach(course => {
        const courseId = course.dataset.course;
        const progress = localStorage.getItem(`course_${courseId}_progress`) || 0;
        const progressBar = course.querySelector('.progress-bar');
        const progressText = course.querySelector('.progress-text');
        
        // Update progress display
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;
        
        // Handle course button clicks
        const courseBtn = course.querySelector('.course-btn');
        courseBtn.addEventListener('click', function() {
            // In a real app, this would navigate to the course content
            // For this demo, we'll just increment progress
            let newProgress = Math.min(100, parseInt(progress) + 20);
            localStorage.setItem(`course_${courseId}_progress`, newProgress);
            
            // Update progress display
            progressBar.style.width = `${newProgress}%`;
            progressText.textContent = `${newProgress}% Complete`;
            
            alert(`You've made progress in the ${course.querySelector('h3').textContent} course!`);
        });
    });
    
    // -------------------- Code Playground --------------------
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    const resultFrame = document.getElementById('resultFrame');
    const runCodeBtn = document.getElementById('runCodeBtn');
    const tabs = document.querySelectorAll('.tab');
    const codePanels = document.querySelectorAll('.code-panel');
    
    // Load saved code if available
    htmlEditor.value = localStorage.getItem('htmlCode') || htmlEditor.value;
    cssEditor.value = localStorage.getItem('cssCode') || cssEditor.value;
    jsEditor.value = localStorage.getItem('jsCode') || jsEditor.value;
    
    // Run initial code
    updateResult();
    
    // Switch tabs in code editor
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active panel
            const tabId = this.dataset.tab;
            codePanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${tabId}Editor`) {
                    panel.classList.add('active');
                }
            });
        });
    });
    
    // Run code button click
    runCodeBtn.addEventListener('click', updateResult);
    
    // Auto-run on code change (with debounce)
    let debounceTimer;
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updateResult, 1000);
            
            // Save code to localStorage
            localStorage.setItem('htmlCode', htmlEditor.value);
            localStorage.setItem('cssCode', cssEditor.value);
            localStorage.setItem('jsCode', jsEditor.value);
        });
    });
    
    function updateResult() {
        // Create result document
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        
        const result = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>${js}</script>
            </body>
            </html>
        `;
        
        // Update iframe content
        const iframe = document.getElementById('resultFrame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(result);
        iframeDoc.close();
    }
    
    // -------------------- Mini Quiz --------------------
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitQuiz');
    const quizResults = document.getElementById('quizResults');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const quizFeedback = document.getElementById('quizFeedback');
    const retakeBtn = document.getElementById('retakeQuiz');
    
    let currentQuestion = 1;
    const totalQuestions = quizQuestions.length;
    
    // Handle navigation buttons
    nextBtn.addEventListener('click', function() {
        if (currentQuestion < totalQuestions) {
            updateQuestionDisplay(currentQuestion + 1);
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 1) {
            updateQuestionDisplay(currentQuestion - 1);
        }
    });
    
    function updateQuestionDisplay(questionNum) {
        currentQuestion = questionNum;
        
        // Update question visibility
        quizQuestions.forEach(q => {
            q.classList.remove('active');
            if (parseInt(q.dataset.question) === currentQuestion) {
                q.classList.add('active');
            }
        });
        
        // Update button states
        prevBtn.disabled = currentQuestion === 1;
        if (currentQuestion === totalQuestions) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    // Submit quiz
    submitBtn.addEventListener('click', function() {
        // Calculate score
        let score = 0;
        const answers = {
            q1: 'b', // <p> tag
            q2: 'c', // color
            q3: 'c'  // Character
        };
        
        // Check answers
        for (const question in answers) {
            const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
            if (selectedOption && selectedOption.value === answers[question]) {
                score++;
            }
        }
        
        // Display results
        scoreDisplay.textContent = score;
        quizResults.style.display = 'block';
        
        // Hide questions and navigation
        quizQuestions.forEach(q => q.style.display = 'none');
        prevBtn.style.display = 'none';
        submitBtn.style.display = 'none';
        
        // Provide feedback based on score
        if (score === totalQuestions) {
            quizFeedback.innerHTML = '<p>Perfect score! You\'re a coding genius!</p>';
        } else if (score >= totalQuestions / 2) {
            quizFeedback.innerHTML = '<p>Good job! You\'re on the right track.</p>';
        } else {
            quizFeedback.innerHTML = '<p>Keep learning! Review the course materials and try again.</p>';
        }
        
        // Save result to localStorage
        localStorage.setItem('quizLastScore', score);
    });
    
    // Retake quiz
    retakeBtn.addEventListener('click', function() {
        // Reset form
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Hide results
        quizResults.style.display = 'none';
        
        // Show questions again
        quizQuestions.forEach(q => q.style.display = 'block');
        updateQuestionDisplay(1);
    });
    
    // -------------------- Newsletter Form --------------------
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value;
        
        if (email.trim() !== '') {
            // In a real app, this would submit to a server
            // For this demo, we'll just show a success message
            newsletterMessage.innerHTML = '<p style="color: white;">Thanks for subscribing! We\'ll keep you updated.</p>';
            newsletterForm.reset();
            
            // Store subscription in localStorage
            localStorage.setItem('subscribed', 'true');
            localStorage.setItem('subscribedEmail', email);
        }
    });
    
    // Show already subscribed message if applicable
    if (localStorage.getItem('subscribed')) {
        const email = localStorage.getItem('subscribedEmail');
        newsletterMessage.innerHTML = `<p style="color: white;">You're already subscribed with: ${email}</p>`;
    }
    
    // -------------------- Daily Coding Tips --------------------
    const tips = [
        "Always comment your code to make it more maintainable.",
        "Use semantic HTML elements like <header>, <footer>, and <nav> for better accessibility.",
        "Learn keyboard shortcuts for your code editor to improve productivity.",
        "Test your websites across different browsers and screen sizes.",
        "Keep your CSS organized using a consistent naming convention.",
        "Minify your CSS and JavaScript files for production to improve loading times.",
        "Use version control (like Git) to keep track of your code changes.",
        "Validate your HTML and CSS using official validators.",
        "Learn to use browser developer tools for debugging.",
        "Make your websites accessible to all users, including those with disabilities."
    ];
    
    const tipContent = document.getElementById('tipContent');
    const newTipBtn = document.getElementById('newTipBtn');
    
    // Display random tip
    function showRandomTip() {
        const randomIndex = Math.floor(Math.random() * tips.length);
        tipContent.innerHTML = `<p>${tips[randomIndex]}</p>`;
    }
    
    // Show initial tip (either from localStorage or random)
    const savedTip = localStorage.getItem('currentTip');
    if (savedTip) {
        tipContent.innerHTML = `<p>${savedTip}</p>`;
    } else {
        showRandomTip();
    }
    
    // New tip button
    newTipBtn.addEventListener('click', function() {
        showRandomTip();
        localStorage.setItem('currentTip', tipContent.querySelector('p').textContent);
    });
});
