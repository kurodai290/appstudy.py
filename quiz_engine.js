// URLからクイズのID（例: shou1_sansu）をゲットする
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id');

// 該当するクイズデータを取得
const currentQuizContainer = ALL_QUIZ_DATA[quizId];

let questions = [];
let quizTitleText = "クイズ";

if (currentQuizContainer) {
    questions = currentQuizContainer.questions;
    quizTitleText = currentQuizContainer.title;
}

let currentQuestionIndex = 0;
let score = 0;

// 画面の部品を取得
const quizTitle = document.getElementById('quiz-title');
const levelBadge = document.getElementById('level-badge');
const qNumberText = document.getElementById('question-number');
const qText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const resultMessage = document.getElementById('result-message');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');

// タイトルをセット
quizTitle.innerText = quizTitleText;

function showQuestion() {
    resultMessage.classList.add('hide');
    choicesContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const currentData = questions[currentQuestionIndex];
        
        // 基礎か応用かでバッジの色を変える
        levelBadge.innerText = `${currentData.type}ステージ`;
        if (currentData.type === "応用") {
            levelBadge.className = "badge advanced";
        } else {
            levelBadge.className = "badge basic";
        }

        qNumberText.innerText = `第 ${currentQuestionIndex + 1} 問 / 全 ${questions.length} 問`;
        qText.innerText = currentData.q;

        // 選択肢ボタンを自動作成
        currentData.c.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.classList.add('choice-btn');
            button.onclick = () => checkAnswer(button, choice, currentData.a);
            choicesContainer.appendChild(button);
        });
    } else {
        // すべて解き終わったとき
        levelBadge.style.display = 'none';
        qNumberText.innerText = "クリア！";
        qText.innerText = "全問終了しました！";
        feedbackText.innerHTML = `スコア: <strong>${questions.length}問中 ${score}問正解</strong> 🎉`;
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
        feedbackText.innerText = "⭕ 正解！すばらしい！";
        score++;
    } else {
        selectedButton.classList.add('wrong');
        feedbackText.innerText = `❌ 残念！正解は「${correctChoice}」でした。`;
        allButtons.forEach(btn => {
            if (btn.innerText === correctChoice) btn.classList.add('correct');
        });
    }
    resultMessage.classList.remove('hide');
}

nextBtn.onclick = () => {
    currentQuestionIndex++;
    showQuestion();
};

// クイズ開始！
if (questions.length > 0) {
    showQuestion();
} else {
    qText.innerText = "エラー：問題が見つかりませんでした。";
}
