document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const logo = document.getElementById('logo');
    const headerControls = document.getElementById('header-controls');
    const headerRestartBtn = document.getElementById('header-restart-btn');
    const questionCounter = document.getElementById('question-counter');
    const timerEl = document.getElementById('timer');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const introText = document.getElementById('intro-text');
    const finalScoreEl = document.getElementById('final-score');
    const resultsContainer = document.getElementById('results-container');
    const restartBtn = document.getElementById('restart-btn');

    // Game State
    const TOTAL_QUESTIONS = 5;
    const TIME_LIMIT = 30;
    const allImageNames = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
    
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let countdownInterval;

    // --- Event Listeners ---
    logo.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    headerRestartBtn.addEventListener('click', startGame);
    image1.addEventListener('click', () => handleImageClick(image1));
    image2.addEventListener('click', () => handleImageClick(image2));

    // --- Game Flow ---

    function startGame() {
        // 1. Reset state
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        if (countdownInterval) clearInterval(countdownInterval);

        // 2. Prepare questions
        questions = shuffleArray(allImageNames).slice(0, TOTAL_QUESTIONS);
        
        // 3. Update UI
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        headerControls.classList.remove('hidden');

        // 4. Display first question
        displayQuestion();
    }

    async function displayQuestion() {
        if (currentQuestionIndex >= TOTAL_QUESTIONS) {
            endGame();
            return;
        }

        questionCounter.textContent = `第 ${currentQuestionIndex + 1}/${TOTAL_QUESTIONS} 题`;

        const imageName = questions[currentQuestionIndex];
        const realImagePath = `01Real/${imageName}.png`;
        const aiImagePath = `02AI/${imageName}.png`;

        const isRealLeft = Math.random() < 0.5;

        image1.src = isRealLeft ? realImagePath : aiImagePath;
        image1.dataset.isReal = isRealLeft;
        
        image2.src = isRealLeft ? aiImagePath : realImagePath;
        image2.dataset.isReal = !isRealLeft;

        // Fetch and display intro text
        try {
            const response = await fetch(`03Intro/${imageName}.txt`);
            if (response.ok) {
                introText.textContent = await response.text();
            } else {
                introText.textContent = '';
            }
        } catch (error) {
            console.error('Error fetching introduction:', error);
            introText.textContent = '';
        }

        startTimer();
    }

    function handleImageClick(clickedImage) {
        clearInterval(countdownInterval);
        const isCorrect = clickedImage.dataset.isReal === 'true';
        
        userAnswers.push({
            question: questions[currentQuestionIndex],
            correct: isCorrect
        });

        if (isCorrect) {
            score++;
        }

        currentQuestionIndex++;
        displayQuestion();
    }

    function startTimer() {
        let timeLeft = TIME_LIMIT;
        timerEl.textContent = timeLeft;

        countdownInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                // Time's up, count as incorrect and move to next
                userAnswers.push({
                    question: questions[currentQuestionIndex],
                    correct: false,
                    timeout: true
                });
                currentQuestionIndex++;
                displayQuestion();
            }
        }, 1000);
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        headerControls.classList.add('hidden');
        endScreen.classList.remove('hidden');

        finalScoreEl.textContent = `你的得分: ${score} / ${TOTAL_QUESTIONS}`;

        resultsContainer.innerHTML = '<h3>答题详情:</h3>';
        userAnswers.forEach((answer, index) => {
            const result = answer.correct ? '正确' : (answer.timeout ? '超时' : '错误');
            resultsContainer.innerHTML += `<p>第 ${index + 1} 题 (图片 ${answer.question}): ${result}</p>`;
        });
    }

    // --- Utility Functions ---
    function shuffleArray(array) {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }
});