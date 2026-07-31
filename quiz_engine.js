let questions = CURRENT_QUIZ_DATA.questions;
let quizTitleText = CURRENT_QUIZ_DATA.title;

let currentQuestionIndex = 0;
let score = 0;
let dynamicCorrectAnswer = "";

const quizTitle = document.getElementById('quiz-title');
const levelBadge = document.getElementById('level-badge');
const qNumberText = document.getElementById('question-number');
const qText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const resultMessage = document.getElementById('result-message');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');

quizTitle.innerText = quizTitleText;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
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

        let questionString = currentData.q;
        let finalChoices = [];

        if (currentData.isRandom) {
            // 各パターンの乱数計算
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
                let multiplier = getRandomInt(2, 4);
                let x = n1 * multiplier;
                questionString = `比の計算： ${n1} : ${n2} ＝ ${x} : ❓`;
                dynamicCorrectAnswer = String(n2 * multiplier);
                finalChoices = [dynamicCorrectAnswer, String(n2*multiplier+1), String(n2*multiplier-1), String(n2*multiplier+2)];
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

        qText.innerText = questionString;

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
            finalChoices.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice;
                button.classList.add('choice-btn');
                button.onclick = () => checkAnswer(button, choice, dynamicCorrectAnswer);
                choicesContainer.appendChild(button);
            });
        }
    } else {
        levelBadge.style.display = 'none';
        qNumberText.innerText = "終了";
        qText.innerText = "全問クリア！素晴らしい集中力です！";
        feedbackText.innerHTML = `スコア: <strong>${questions.length}問中 ${score}問正解</strong> 🌟`;
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

nextBtn.onclick = () => { currentQuestionIndex++; showQuestion(); };
showQuestion();
