document.addEventListener('DOMContentLoaded', () => {
    // Theme switching logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    let savedTheme = localStorage.getItem('pomodoro-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        
        if (isLight) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        localStorage.setItem('pomodoro-theme', isLight ? 'light' : 'dark');
    });

    // Timer Logic
    let isRunning = false;
    let timer;
    let timeRemaining = 25 * 60; // 25 mins
    let totalTime = 25 * 60;
    
    const timeDisplay = document.getElementById('time-display');
    const playPauseBtn = document.getElementById('btn-play-pause');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const resetBtn = document.getElementById('btn-reset');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const modeText = document.getElementById('mode-text');
    const circle = document.querySelector('.progress-ring__circle');
    const bellSound = document.getElementById('bell-sound');
    
    // Calculate circumference
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = 0;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeRemaining);
        document.title = `${formatTime(timeRemaining)} - Focus`;
        
        // Update ring
        const offset = circumference - (timeRemaining / totalTime) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    function setMode(duration, text, btn) {
        // Stop timer if running
        if (isRunning) toggleTimer();
        
        // Update active button
        modeBtns.forEach(b => {
             b.classList.remove('active');
             b.style.backgroundColor = "";
             b.style.boxShadow = "none";
        });
        btn.classList.add('active');
        
        // Update ring color based on mode
        if (text.includes("Break")) {
            circle.style.stroke = "var(--accent)";
            btn.style.backgroundColor = "var(--accent)";
            btn.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
            
            // Adjust linear gradients of play button to accent
            playPauseBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
            playPauseBtn.style.boxShadow = "0 10px 20px rgba(16, 185, 129, 0.3)";
        } else {
            circle.style.stroke = "var(--primary)";
            playPauseBtn.style.background = ""; // Fallback to css
            playPauseBtn.style.boxShadow = "";
        }

        modeText.textContent = text;
        totalTime = duration * 60;
        timeRemaining = totalTime;
        updateDisplay();
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.getAttribute('data-time'));
            let text = "Time to work";
            if (minutes === 5) text = "Short Break";
            else if (minutes === 15) text = "Long Break";
            
            setMode(minutes, text, btn);
        });
    });

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timer);
            playPauseIcon.classList.replace('fa-pause', 'fa-play');
            // Remove pulse animation
            circle.style.transition = "stroke-dashoffset 0.1s linear";
        } else {
            // Restore smooth transition
            circle.style.transition = "stroke-dashoffset 1s linear, stroke 0.5s ease";
            
            timer = setInterval(() => {
                timeRemaining--;
                updateDisplay();
                
                if (timeRemaining <= 0) {
                    clearInterval(timer);
                    playPauseIcon.classList.replace('fa-pause', 'fa-play');
                    isRunning = false;
                    try {
                        bellSound.play();
                    } catch(e) {}
                }
            }, 1000);
            playPauseIcon.classList.replace('fa-play', 'fa-pause');
        }
        isRunning = !isRunning;
    }

    playPauseBtn.addEventListener('click', toggleTimer);

    resetBtn.addEventListener('click', () => {
        if (isRunning) toggleTimer();
        timeRemaining = totalTime;
        updateDisplay();
    });

    // Initialize
    updateDisplay();
});
