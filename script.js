document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    // DOM Elements
    const logo = document.getElementById('logo'); // Footer logo
    const questionCounter = document.getElementById('question-counter');
    const timerEl = document.getElementById('timer');
    const timerContainer = document.getElementById('timer-container'); // Get the timer container
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const introText = document.getElementById('intro-text');
    const finalScoreEl = document.getElementById('final-score');
    const resultsContainer = document.getElementById('results-container');
    const restartBtn = document.getElementById('restart-btn');
    const startGameBtn = document.getElementById('start-game-btn'); // New start button
    const endMessageEl = document.getElementById('end-message'); // New end message element

    const overlay1 = document.getElementById('overlay1');
    const overlay2 = document.getElementById('overlay2');
    const overlayText1 = overlay1.querySelector('.overlay-text');
    const overlayText2 = overlay2.querySelector('.overlay-text');

    // Game State
    const TOTAL_QUESTIONS = 5;
    const TIME_LIMIT = 30;
    const allImageNames = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
    
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let countdownInterval;
    let imagesClickable = true; // Control image clickability

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', startGame); // Use new start button
    restartBtn.addEventListener('click', startGame); // Restart button on end screen
    image1.addEventListener('click', () => handleImageClick(image1, overlay1, overlayText1));
    image2.addEventListener('click', () => handleImageClick(image2, overlay2, overlayText2));

    // Adjust overlays whenever an image loads
    image1.onload = () => adjustOverlaySize(image1, overlay1);
    image2.onload = () => adjustOverlaySize(image2, overlay2);
    // Also adjust on window resize to handle responsive changes
    window.addEventListener('resize', () => {
        if (!gameScreen.classList.contains('hidden')) {
            adjustOverlaySize(image1, overlay1);
            adjustOverlaySize(image2, overlay2);
        }
    });

    // --- Game Flow ---

    function startGame() {
        // 1. Reset state
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        if (countdownInterval) clearInterval(countdownInterval);
        imagesClickable = true;

        // 2. Prepare questions
        questions = shuffleArray(allImageNames).slice(0, TOTAL_QUESTIONS);
        
        // 3. Update UI
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        timerContainer.classList.remove('hidden'); // Show timer

        // Hide overlays
        overlay1.classList.remove('show', 'correct', 'incorrect');
        overlay2.classList.remove('show', 'correct', 'incorrect');

        // 4. Display first question
        displayQuestion();
    }

    async function displayQuestion() {
        if (currentQuestionIndex >= TOTAL_QUESTIONS) {
            endGame();
            return;
        }

        questionCounter.textContent = `${score}/${currentQuestionIndex + 1}`; // Update score display: correct answers / current question number

        const imageName = questions[currentQuestionIndex];
        const realImagePath = `01Real/${imageName}.png`;
        const aiImagePath = `02AI/${imageName}.png`;

        const isRealLeft = Math.random() < 0.5;

        image1.src = isRealLeft ? realImagePath : aiImagePath;
        image1.dataset.isReal = isRealLeft;
        
        image2.src = isRealLeft ? aiImagePath : realImagePath;
        image2.dataset.isReal = !isRealLeft;

        // Reset overlays for new question
        overlay1.classList.remove('show', 'correct', 'incorrect');
        overlay2.classList.remove('show', 'correct', 'incorrect');
        overlayText1.textContent = '';
        overlayText2.textContent = '';
        // Reset overlay styles
        overlay1.style.width = '100%';
        overlay1.style.height = '100%';
        overlay1.style.top = '0';
        overlay1.style.left = '0';
        overlay2.style.width = '100%';
        overlay2.style.height = '100%';
        overlay2.style.top = '0';
        overlay2.style.left = '0';
        imagesClickable = true; // Re-enable clicks

        // Fetch and display intro text
        try {
            const response = await fetch(`03Intro/${imageName}.txt`);
            if (response.ok) {
                const text = await response.text();
                introText.textContent = text;
            } else {
                // Handle cases where the file might not be found on the server
                introText.textContent = '介绍文本加载失败。';
            }
        } catch (error) {
            console.error('Error fetching introduction:', error);
            // This error often happens when opening the file directly in the browser
            // instead of using a local server.
            introText.textContent = '无法加载介绍文本。请确认您是否通过HTTP服务器运行本项目。';
        }

        startTimer();
    }

    function handleImageClick(clickedImage, overlay, overlayText) {
        if (!imagesClickable) return; // Prevent multiple clicks
        imagesClickable = false; // Disable clicks after first selection

        clearInterval(countdownInterval);
        const isCorrect = clickedImage.dataset.isReal === 'true';
        
        userAnswers.push({
            question: questions[currentQuestionIndex],
            correct: isCorrect,
            selectedImage: clickedImage.id // Store which image was clicked
        });

        if (isCorrect) {
            score++;
            overlayText.textContent = `正确
这是真实照片`;
            overlay.classList.add('correct');
        } else {
            overlayText.textContent = `抱歉
这是AI生成的`;
            overlay.classList.add('incorrect');
        }
        overlay.classList.add('show');

        // Hide the other overlay
        const otherOverlay = clickedImage === image1 ? overlay2 : overlay1;
        otherOverlay.classList.remove('show', 'correct', 'incorrect');
        otherOverlay.querySelector('.overlay-text').textContent = '';

        // IMMEDIATELY UPDATE SCORE DISPLAY AFTER ANSWERING
        questionCounter.textContent = `${score}/${currentQuestionIndex + 1}`;

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 2000); // Show feedback for 2 seconds
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
        endScreen.classList.remove('hidden');
        timerContainer.classList.add('hidden'); // Hide timer

        // Determine end message based on score
        if (score >= 3) { // Assuming 3 correct answers for "win"
            endMessageEl.textContent = `恭喜！你答对了${score}题，请去前台领奖`;
        } else {
            endMessageEl.textContent = `抱歉！你只答对了${score}题，继续努力`;
        }

        // Optionally show detailed results
        // finalScoreEl.textContent = `你的得分: ${score} / ${TOTAL_QUESTIONS}`;
        // resultsContainer.innerHTML = '<h3>答题详情:</h3>';
        // userAnswers.forEach((answer, index) => {
        //     const result = answer.correct ? '正确' : (answer.timeout ? '超时' : '错误');
        //     resultsContainer.innerHTML += `<p>第 ${index + 1} 题 (图片 ${answer.question}): ${result}</p>`;
        // });
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

    function adjustOverlaySize(img, overlay) {
        const container = img.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let renderedWidth, renderedHeight, top, left;

        if (imageAspectRatio > containerAspectRatio) {
            // Image is wider than the container, so it's constrained by width
            renderedWidth = containerWidth;
            renderedHeight = containerWidth / imageAspectRatio;
            top = (containerHeight - renderedHeight) / 2;
            left = 0;
        } else {
            // Image is taller than or same aspect ratio as the container, so it's constrained by height
            renderedHeight = containerHeight;
            renderedWidth = containerHeight * imageAspectRatio;
            left = (containerWidth - renderedWidth) / 2;
            top = 0;
        }

        overlay.style.width = `${renderedWidth}px`;
        overlay.style.height = `${renderedHeight}px`;
        overlay.style.top = `${top}px`;
        overlay.style.left = `${left}px`;
    }
});
