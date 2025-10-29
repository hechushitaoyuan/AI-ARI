document.addEventListener('DOMContentLoaded', () => {
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
    const TIME_LIMIT = 10;
    
    let allQuestionsData = []; // Will be loaded from manifest.json
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let countdownInterval;
    let imagesClickable = true;

    // --- Initialization ---
    function initializeGame() {
        try {
            // Embed the manifest data directly to allow offline use
            allQuestionsData = [
              {
                "real": "01Real/上海世博展览馆.jpg",
                "ai": "02AI/上海世博展览馆.png",
                "intro": "上海世博展览馆，同济设计"
              },
              {
                "real": "01Real/上海吴淞口国际邮轮码头.jpg",
                "ai": "02AI/上海吴淞口国际邮轮码头.png",
                "intro": "上海吴淞口国际邮轮码头，同济设计"
              },
              {
                "real": "01Real/上海崇明体育训练基地一期项目（1、2、3号楼）.jpg",
                "ai": "02AI/上海崇明体育训练基地一期项目（1、2、3号楼）.png",
                "intro": "上海崇明体育训练基地一期项目（1、2、3号楼），同济设计"
              },
              {
                "real": "01Real/上海市第一人民医院改扩建工程.jpg",
                "ai": "02AI/上海市第一人民医院改扩建工程.png",
                "intro": "上海市第一人民医院改扩建工程，同济设计"
              },
              {
                "real": "01Real/上海棋院.jpg",
                "ai": "02AI/上海棋院.png",
                "intro": "上海棋院，同济设计"
              },
              {
                "real": "01Real/上海自然博物馆.jpg",
                "ai": "02AI/上海自然博物馆.png",
                "intro": "上海自然博物馆，同济设计"
              },
              {
                "real": "01Real/上音歌剧院.jpg",
                "ai": "02AI/上音歌剧院.png",
                "intro": "上音歌剧院，同济设计"
              },
              {
                "real": "01Real/二里头遗址博物馆.jpg",
                "ai": "02AI/二里头遗址博物馆.png",
                "intro": "二里头遗址博物馆，同济设计"
              },
              {
                "real": "01Real/保利大剧院.jpg",
                "ai": "02AI/保利大剧院.png",
                "intro": "保利大剧院，同济设计"
              },
              {
                "real": "01Real/北京建筑大学新校区图书馆.jpg",
                "ai": "02AI/北京建筑大学新校区图书馆.png",
                "intro": "北京建筑大学新校区图书馆，同济设计"
              },
              {
                "real": "01Real/南开大学新校区环境科学与工程学院.jpg",
                "ai": "02AI/南开大学新校区环境科学与工程学院.png",
                "intro": "南开大学新校区环境科学与工程学院，同济设计"
              },
              {
                "real": "01Real/南开大学津南校区学生活动中心.jpg",
                "ai": "02AI/南开大学津南校区学生活动中心.png",
                "intro": "南开大学津南校区学生活动中心，同济设计"
              },
              {
                "real": "01Real/南沙国际金融论坛（IFF）永久会址.jpg",
                "ai": "02AI/南沙国际金融论坛（IFF）永久会址.png",
                "intro": "南沙国际金融论坛（IFF）永久会址，同济设计"
              },
              {
                "real": "01Real/古北SOHO.jpg",
                "ai": "02AI/古北SOHO.png",
                "intro": "古北SOHO，同济设计"
              },
              {
                "real": "01Real/同济大学新建嘉定校区体育中心项目.jpg",
                "ai": "02AI/同济大学新建嘉定校区体育中心项目.png",
                "intro": "同济大学新建嘉定校区体育中心项目，同济设计"
              },
              {
                "real": "01Real/同济科技园A楼.jpg",
                "ai": "02AI/同济科技园A楼.png",
                "intro": "同济科技园A楼，同济设计"
              },
              {
                "real": "01Real/咸阳市市民文化中心.jpg",
                "ai": "02AI/咸阳市市民文化中心.png",
                "intro": "咸阳市市民文化中心，同济设计"
              },
              {
                "real": "01Real/哈大客专大连北站站房工程.jpg",
                "ai": "02AI/哈大客专大连北站站房工程.png",
                "intro": "哈大客专大连北站站房工程，同济设计"
              },
              {
                "real": "01Real/大同市北环路御河桥工程.jpg",
                "ai": "02AI/大同市北环路御河桥工程.png",
                "intro": "大同市北环路御河桥工程，同济设计"
              },
              {
                "real": "01Real/太原市摄乐大桥工程.jpg",
                "ai": "02AI/太原市摄乐大桥工程.png",
                "intro": "太原市摄乐大桥工程，同济设计"
              },
              {
                "real": "01Real/如东县体育中心体育馆.jpg",
                "ai": "02AI/如东县体育中心体育馆.png",
                "intro": "如东县体育中心体育馆，同济设计"
              },
              {
                "real": "01Real/宁波院士中心.jpg",
                "ai": "02AI/宁波院士中心.png",
                "intro": "宁波院士中心，同济设计"
              },
              {
                "real": "01Real/山东美术馆新馆.png",
                "ai": "02AI/山东美术馆新馆.png",
                "intro": "山东美术馆新馆，同济设计"
              },
              {
                "real": "01Real/援非盟会议中心.jpg",
                "ai": "02AI/援非盟会议中心.png",
                "intro": "援非盟会议中心，同济设计"
              },
              {
                "real": "01Real/无锡大剧院.jpg",
                "ai": "02AI/无锡大剧院.png",
                "intro": "无锡大剧院，同济设计"
              },
              {
                "real": "01Real/无锡阖闾城遗址博物馆.jpg",
                "ai": "02AI/无锡阖闾城遗址博物馆.png",
                "intro": "无锡阖闾城遗址博物馆，同济设计"
              },
              {
                "real": "01Real/日喀则桑珠孜宗堡修复工程.png",
                "ai": "02AI/日喀则桑珠孜宗堡修复工程.png",
                "intro": "日喀则桑珠孜宗堡修复工程，同济设计"
              },
              {
                "real": "01Real/昆山市专业足球场.png",
                "ai": "02AI/昆山市专业足球场.png",
                "intro": "昆山市专业足球场，同济设计"
              },
              {
                "real": "01Real/杨树浦电厂遗址公园.jpg",
                "ai": "02AI/杨树浦电厂遗址公园.png",
                "intro": "杨树浦电厂遗址公园，同济设计"
              },
              {
                "real": "01Real/椒江二桥.jpg",
                "ai": "02AI/椒江二桥.png",
                "intro": "椒江二桥，同济设计"
              },
              {
                "real": "01Real/江苏省苏州实验中学原址重建项目.jpg",
                "ai": "02AI/江苏省苏州实验中学原址重建项目.png",
                "intro": "江苏省苏州实验中学原址重建项目，同济设计"
              },
              {
                "real": "01Real/沃尔沃汽车（中国）研发中心建设项目（二期）.jpg",
                "ai": "02AI/沃尔沃汽车（中国）研发中心建设项目（二期）.png",
                "intro": "沃尔沃汽车（中国）研发中心建设项目（二期），同济设计"
              },
              {
                "real": "01Real/浙江省公安指挥中心.jpg",
                "ai": "02AI/浙江省公安指挥中心.png",
                "intro": "浙江省公安指挥中心，同济设计"
              },
              {
                "real": "01Real/深圳歌剧院.jpg",
                "ai": "02AI/深圳歌剧院.jpg",
                "intro": "深圳歌剧院，同济设计"
              },
              {
                "real": "01Real/滇海古渡大码头.jpg",
                "ai": "02AI/滇海古渡大码头.png",
                "intro": "滇海古渡大码头，同济设计"
              },
              {
                "real": "01Real/范曾艺术馆.jpg",
                "ai": "02AI/范曾艺术馆.png",
                "intro": "范曾艺术馆，同济设计"
              },
              {
                "real": "01Real/西安丝路国际会议中心.jpg",
                "ai": "02AI/西安丝路国际会议中心.png",
                "intro": "西安丝路国际会议中心，同济设计"
              },
              {
                "real": "01Real/重庆西站.jpg",
                "ai": "02AI/重庆西站.png",
                "intro": "重庆西站，同济设计"
              },
              {
                "real": "01Real/金融街海伦中心.jpg",
                "ai": "02AI/金融街海伦中心.png",
                "intro": "金融街海伦中心，同济设计"
              },
              {
                "real": "01Real/长沙国际会展中心 .jpg",
                "ai": "02AI/长沙国际会展中心 .png",
                "intro": "长沙国际会展中心 ，同济设计"
              },
              {
                "real": "01Real/闸北久光.jpg",
                "ai": "02AI/闸北久光.png",
                "intro": "闸北久光，同济设计"
              },
              {
                "real": "01Real/隋唐大运河文化博物馆.jpg",
                "ai": "02AI/隋唐大运河文化博物馆.png",
                "intro": "隋唐大运河文化博物馆，同济设计"
              }
            ];

            if (!allQuestionsData || allQuestionsData.length === 0) {
                 throw new Error('Embedded game data is empty or invalid!');
            }
            
            // Enable the start button only after data is loaded
            startGameBtn.addEventListener('click', startGame);
            restartBtn.addEventListener('click', startGame);
        } catch (error) {
            console.error('Failed to load game data:', error);
            // Display an error message to the user
            const startContent = document.querySelector('.start-content');
            startContent.innerHTML = '<p style="color: red;">游戏数据加载失败，请联系管理员。</p>';
        }
    }

    // --- Event Listeners ---
    image1.addEventListener('click', (event) => handleImageClick(image1, overlay1, overlayText1, event));
    image2.addEventListener('click', (event) => handleImageClick(image2, overlay2, overlayText2, event));

    // --- Game Flow ---
    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        if (countdownInterval) clearInterval(countdownInterval);
        imagesClickable = true;

        questions = shuffleArray(allQuestionsData).slice(0, TOTAL_QUESTIONS);
        
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        timerContainer.classList.remove('hidden');

        overlay1.classList.remove('show', 'correct', 'incorrect');
        overlay2.classList.remove('show', 'correct', 'incorrect');

        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex >= TOTAL_QUESTIONS) {
            endGame();
            return;
        }

        questionCounter.textContent = `${score}/${TOTAL_QUESTIONS}`;

        const currentQuestion = questions[currentQuestionIndex];
        const realImagePath = currentQuestion.real;
        const aiImagePath = currentQuestion.ai;
        const introContent = currentQuestion.intro;

        const isRealLeft = Math.random() < 0.5;

        image1.src = isRealLeft ? realImagePath : aiImagePath;
        image1.dataset.isReal = isRealLeft;
        
        image2.src = isRealLeft ? aiImagePath : realImagePath;
        image2.dataset.isReal = !isRealLeft;

        overlay1.classList.remove('show', 'correct', 'incorrect');
        overlay2.classList.remove('show', 'correct', 'incorrect');
        overlayText1.textContent = '';
        overlayText2.textContent = '';
        imagesClickable = true;

        introText.textContent = introContent;

        startTimer();
    }

    function handleImageClick(clickedImage, overlay, overlayText, event) {
        if (!imagesClickable) return;
        imagesClickable = false;

        clearInterval(countdownInterval);
        const isCorrect = clickedImage.dataset.isReal === 'false';
        
        userAnswers.push({
            question: questions[currentQuestionIndex],
            correct: isCorrect,
            selectedImage: clickedImage.id
        });

        if (isCorrect) {
            score++;
            overlayText.textContent = `正确~这是AI模仿的建筑图片~`;
            overlay.classList.add('correct');
        } else {
            overlayText.textContent = `抱歉猜错了~这是真实图片~`;
            overlay.classList.add('incorrect');
        }
        overlay.classList.add('show');

        const otherOverlay = clickedImage === image1 ? overlay2 : overlay1;
        otherOverlay.classList.remove('show', 'correct', 'incorrect');
        otherOverlay.querySelector('.overlay-text').textContent = '';

        questionCounter.textContent = `${score}/${TOTAL_QUESTIONS}`;

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 2000);
    }

    function startTimer() {
        let timeLeft = TIME_LIMIT;
        timerEl.textContent = timeLeft;

        countdownInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
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
        timerContainer.classList.add('hidden');

        if (score >= 3) {
            endMessageEl.textContent = `恭喜！您答对了${score}题，请去前台领奖`;
        } else {
            endMessageEl.textContent = `抱歉！您只答对了${score}题，继续努力`;
        }
    }

    function shuffleArray(array) {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }


    // Start the game initialization process
    initializeGame();
});
