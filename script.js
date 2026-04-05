document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const ballsContainer = document.getElementById('balls-container');
    
    // Set up clean initial placeholders
    function resetPlaceholders() {
        ballsContainer.innerHTML = '';
        
        // 6 main numbers
        for (let i = 0; i < 6; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'ball placeholder';
            placeholder.textContent = '?';
            ballsContainer.appendChild(placeholder);
        }
        
        // Plus sign separation
        const plusSign = document.createElement('div');
        plusSign.className = 'ball bonus-placeholder placeholder';
        plusSign.textContent = '+';
        ballsContainer.appendChild(plusSign);
        
        // 1 bonus number
        const bonusPlaceholder = document.createElement('div');
        bonusPlaceholder.className = 'ball placeholder';
        bonusPlaceholder.textContent = '?';
        ballsContainer.appendChild(bonusPlaceholder);
    }
    
    resetPlaceholders();

    function getRandomNumbers() {
        const numbers = new Set();
        while (numbers.size < 7) { 
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        
        const numbersArray = Array.from(numbers);
        const mainNumbers = numbersArray.slice(0, 6).sort((a, b) => a - b);
        const bonusNumber = numbersArray[6];
        
        return { mainNumbers, bonusNumber };
    }

    function getColorClass(number) {
        if (number <= 10) return 'color-1'; // Yellow
        if (number <= 20) return 'color-2'; // Blue
        if (number <= 30) return 'color-3'; // Red
        if (number <= 40) return 'color-4'; // Purple
        return 'color-5';                   // Green
    }

    async function drawLotto() {
        // Disable button during drawing
        drawBtn.disabled = true;
        drawBtn.textContent = '운명 확인 중...';
        
        // Clear container
        ballsContainer.innerHTML = '';
        
        const { mainNumbers, bonusNumber } = getRandomNumbers();
        
        const spawnBall = (number, isBonus = false, delay) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const ball = document.createElement('div');
                    // Bonus ball can use its own distinct color or rely on range, 
                    // we'll keep the distinct bonus color for wow factor
                    const colorClass = isBonus ? 'color-bonus' : getColorClass(number);
                    ball.className = `ball ${colorClass}`;
                    ball.textContent = number;
                    ballsContainer.appendChild(ball);

                    if (!isBonus && ballsContainer.children.length === 6) {
                        setTimeout(() => {
                            const plusSign = document.createElement('div');
                            plusSign.className = 'ball bonus-placeholder placeholder';
                            plusSign.textContent = '+';
                            plusSign.style.animation = 'popIn 0.3s ease forwards';
                            ballsContainer.appendChild(plusSign);
                        }, 400); 
                    }
                    
                    resolve();
                }, delay);
            });
        };

        // Draw main numbers with a nice suspenseful delay
        for (let i = 0; i < mainNumbers.length; i++) {
            await spawnBall(mainNumbers[i], false, i === 0 ? 0 : 800);
        }

        // Wait a bit more dramatically before the bonus number
        await new Promise(r => setTimeout(r, 600));
        await spawnBall(bonusNumber, true, 800);

        // Allow redrawing after completion
        setTimeout(() => {
            drawBtn.disabled = false;
            drawBtn.textContent = '다시 추첨하기';
        }, 1000);
    }

    drawBtn.addEventListener('click', drawLotto);
});
