let questions = CURRENT_QUIZ_DATA.questions;
let quizTitleText = CURRENT_QUIZ_DATA.title;

let currentQuestionIndex = 0;
let score = 0;
let dynamicCorrectAnswer = "";

// ⏱ タイマー用の変数
let startTime = Date.now();
let timerInterval = null;
let finalElapsedTime = 0;

const quizTitle = document.getElementById('quiz-title');
const levelBadge = document.getElementById('level-badge');
const qNumberText = document.getElementById('question-number');
const qText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const resultMessage = document.getElementById('result-message');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer-display');

// ランキング用の部品
const rankingSection = document.getElementById('ranking-section');
const registerScoreZone = document.getElementById('register-score-zone');
const playerNameInput = document.getElementById('player-name-input');
const saveScoreBtn = document.getElementById('save-score-btn');
const rankingTableBody = document.getElementById('ranking-table-body');

const urlParams = new URLSearchParams(window.location.search);
const rankingKey = `ranking_${urlParams.get('file') || 'data_shou1'}`;

quizTitle.innerText = quizTitleText;

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let seconds = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.innerText = `タイム: ${seconds}秒`;
    }, 1000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 🌟【最重要・軽量化】開いた時点ではなく、その問題が表示された瞬間にだけ計算する関数
function buildSingleQuestion(currentData) {
    let questionString = currentData.q;
    let finalChoices = [];

    if (currentData.isRandom) {
        if (currentData.pattern === "shou1_add") {
            let n1 = getRandomInt(1, 9), n2 = getRandomInt(1, 9);
            questionString = `${n1} ＋ ${n2} は なに？`;
            dynamicCorrectAnswer = String(n1 + n2);
            finalChoices = [dynamicCorrectAnswer, String(n1+n2+1), String(n1+n2-1), String(n1+n2+2)];
        } 
        else if (currentData.pattern === "shou1_sub") {
            let n1 = getRandomInt(5, 10), n2 = getRandomInt(1, 4);
            questionString = `${n1} － ${n2} は なに？`;
            dynamicCorrectAnswer = String(n1 - n2);
            finalChoices = [dynamicCorrectAnswer, String(n1-n2+1), String(n1-n2-1), String(n1-n2-2)];
        }
        else if (currentData.pattern === "shou2_kuku") {
            let n1 = getRandomInt(2, 9), n2 = getRandomInt(2, 9);
            questionString = `かけざん九九： ${n1} × ${n2} ＝ ❓`;
            dynamicCorrectAnswer = String(n1 * n2);
            finalChoices = [dynamicCorrectAnswer, String(n1*n2+2), String(n1*n2-2), String((n1+1)*n2)];
        }
        else if (currentData.pattern === "shou3_div") {
            let n2 = getRandomInt(2, 9), ans = getRandomInt(2, 9);
            let n1 = n2 * ans;
            questionString = `わり算： ${n1} ÷ ${n2} ＝ ❓`;
            dynamicCorrectAnswer = String(ans);
            finalChoices = [dynamicCorrectAnswer, String(ans+1), String(ans-1), String(ans+2)];
        }
        else if (currentData.pattern === "shou4_dec") {
            let n1 = (getRandomInt(11, 49) / 10), n2 = (getRandomInt(11, 49) / 10);
            questionString = `小数の計算： ${n1} ＋ ${n2} ＝ ❓`;
            dynamicCorrectAnswer = (n1 + n2).toFixed(1);
            finalChoices = [dynamicCorrectAnswer, (n1+n2+0.1).toFixed(1), (n1+n2-0.1).toFixed(1), (n1+n2+0.2).toFixed(1)];
        }
        else if (currentData.pattern === "shou5_mul") {
            let n1 = (getRandomInt(11, 39) / 10), n2 = (getRandomInt(2, 9) / 10);
            questionString = `小数のかけ算： ${n1} × ${n2} ＝ ❓`;
            dynamicCorrectAnswer = (n1 * n2).toFixed(2);
            finalChoices = [dynamicCorrectAnswer, (n1*n2+0.1).toFixed(2), (n1*n2-0.1).toFixed(2), (n1*n2+0.02).toFixed(2)];
        }
        else if (currentData.pattern === "shou6_ratio") {
            let n1 = getRandomInt(2, 5), n2 = getRandomInt(3, 6);
            let m = getRandomInt(2, 4);
            questionString = `比の計算： ${n1} : ${n2} ＝ ${n1*m} : ❓`;
            dynamicCorrectAnswer = String(n2 * m);
            finalChoices = [dynamicCorrectAnswer, String(n2*m+1), String(n2*m-1), String(n2*m+2)];
        }
        else if (currentData.pattern === "chu1_calc") {
            let n1 = getRandomInt(2, 9), n2 = getRandomInt(3, 9);
            questionString = `${n1} ＋ (-${n2}) ＝ ❓`;
            dynamicCorrectAnswer = String(n1 - n2);
            finalChoices = [dynamicCorrectAnswer, String(n1+n2), String(-n1-n2), String(n1-n2+1)];
        }
        else if (currentData.pattern === "chu3_q1") {
            let a = getRandomInt(3, 9), b = getRandomInt(4, 8), c = getRandomInt(2, 5);
            questionString = `【静岡県入試・類題】 ${a} ＋ ${b} × (-${c}) を計算しなさい。`;
            dynamicCorrectAnswer = String(a + (b * -c));
            finalChoices = [dynamicCorrectAnswer, String((a+b)*-c), String(a - (b * c)), String(a + b * c)];
        }
        else if (currentData.pattern === "chu3_q2") {
            let z = getRandomInt(2, 3), f1 = getRandomInt(3, 5), f2 = getRandomInt(2, 4);
            questionString = `【静岡県入試・類題】 (${z*f1}a² － ${z*f2}ab) ÷ ${z}a を計算しなさい。`;
            dynamicCorrectAnswer = `${f1}a - ${f2}b`;
            finalChoices = [dynamicCorrectAnswer, `${z*f1}a - ${f2}b`, `${f1}a + ${f2}b`, `${f1}a² - ${f2}b`];
        }
        finalChoices = shuffleArray(finalChoices);
    } else {
        questionString = currentData.q;
        dynamicCorrectAnswer = currentData.a;
        finalChoices = currentData.c;
    }

    return { questionString, finalChoices };
}

function showQuestion() {
    resultMessage.classList.add('hide');
    choicesContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        let currentData = questions[currentQuestionIndex];
        
        levelBadge.innerText = `${currentData.type}ステージ`;
        if (currentData.type === "応用") levelBadge.className = "badge advanced";
        else if (currentData.type === "記述") levelBadge.className = "badge shoumei-badge";
        else levelBadge.className = "badge basic";

        qNumberText.innerText = `第 ${currentQuestionIndex + 1} 問 / 全 ${questions.length} 問`;

        // 🌟 ここで今必要な1問だけを生成・構築する
        let buildResult = buildSingleQuestion(currentData);
        qText.innerText = buildResult.questionString;

        if (currentData.type === "記述") {
            const textarea = document.createElement('textarea');
            textarea.placeholder = "ここに証明を書いてみよう！";
            textarea.classList.add('shoumei-input');
            choicesContainer.appendChild(textarea);

            const submitBtn = document.createElement('button');
            submitBtn.innerText = "完成！答え合わせをする";
            submitBtn.classList.add('btn');
            submitBtn.style.marginTop = "15px";
            submitBtn.onclick = () => {
                textarea.disabled = true;
                submitBtn.disabled = true;
                feedbackText.innerHTML = `<span style="color:#2b6cb0;">👇模範解答と見比べて自己採点しよう！</span>`;
                const answerBox = document.createElement('div');
                answerBox.classList.add('model-answer-box');
                answerBox.innerText = currentData.modelAnswer;
                feedbackText.appendChild(answerBox);
                resultMessage.classList.remove('hide');
            };
            choicesContainer.appendChild(submitBtn);
        } else {
            buildResult.finalChoices.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice;
                button.classList.add('choice-btn');
                button.onclick = () => checkAnswer(button, choice, dynamicCorrectAnswer);
                choicesContainer.appendChild(button);
            });
        }
    } else {
        clearInterval(timerInterval);
        finalElapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.innerText = `クリアタイム: ${finalElapsedTime}秒`;

        levelBadge.style.display = 'none';
        qNumberText.innerText = "終了";
        qText.innerText = "全問クリア！";
        feedbackText.innerHTML = `あなたの結果: <strong>${questions.length}問中 ${score}問正解</strong> 🌟`;
        
        rankingSection.classList.remove('hide');
        displayRanking();

        nextBtn.innerText = "トップページにもどる";
        nextBtn.onclick = () => window.location.href = "index.html";
        resultMessage.classList.remove('hide');
    }
}

function checkAnswer(selectedButton, selectedChoice, correctChoice) {
    const allButtons = choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => btn.disabled = true);
    if (selectedChoice === correctChoice) {
        selectedButton.classList.add('correct');
        feedbackText.innerText = "⭕ 正解！"; score++;
    } else {
        selectedButton.classList.add('wrong');
        feedbackText.innerText = `❌ 不正解！ 正解は「${correctChoice}」`;
        allButtons.forEach(btn => { if (btn.innerText === correctChoice) btn.classList.add('correct'); });
    }
    resultMessage.classList.remove('hide');
}

function displayRanking() {
    let rankingData = JSON.parse(localStorage.getItem(rankingKey)) || [];
    rankingTableBody.innerHTML = "";
    if (rankingData.length === 0) {
        rankingTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#a0aec0;">まだ記録はありません</td></tr>`;
        return;
    }
    rankingData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${index + 1}位</strong></td><td>${record.name}</td><td>${record.score}問</td><td>${record.time}秒</td>`;
