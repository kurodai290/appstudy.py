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
        
        // 基礎・応用・記述でバッジを切り替える
        levelBadge.innerText = `${currentData.type}ステージ`;
        if (currentData.type === "応用") {
            levelBadge.className = "badge advanced";
        } else if (currentData.type === "記述") {
            levelBadge.className = "badge shoumei-badge";
            levelBadge.innerText = "記述式証明";
        } else {
            levelBadge.className = "badge basic";
        }

        qNumberText.innerText = `第 ${currentQuestionIndex + 1} 問 / 全 ${questions.length} 問`;
        qText.innerText = currentData.q;

        // もし記述式（図形の証明など）の問題だったら
        if (currentData.type === "記述") {
            // テキストエリア（文字入力エリア）を作る
            const textarea = document.createElement('textarea');
            textarea.placeholder = "ここにあなたの証明を書いてみよう！\n\n（例：△ABMと△ACMにおいて〜）";
            textarea.classList.add('shoumei-input');
            choicesContainer.appendChild(textarea);

            // 決定ボタンを作る
            const submitBtn = document.createElement('button');
            submitBtn.innerText = "完成！答え合わせをする";
            submitBtn.classList.add('btn');
            submitBtn.style.marginTop = "15px";
            submitBtn.onclick = () => {
                textarea.disabled = true;
                submitBtn.disabled = true;
                
                feedbackText.innerHTML = `<span style="color:#2b6cb0;">👇下の模範解答と自分の書いた文章を見比べてみよう！</span>`;
                
                const answerBox = document.createElement('div');
                answerBox.classList.add('model-answer-box');
                answerBox.innerText = currentData.modelAnswer;
                feedbackText.appendChild(answerBox);
                
                resultMessage.classList.remove('hide');
            };
            choicesContainer.appendChild(submitBtn);

        } else {
            // 通常の4択問題だったらボタンを自動作成
            currentData.c.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice;
                button.classList.add('choice-btn');
                button.onclick = () => checkAnswer(button, choice, currentData.a);
                choicesContainer.appendChild(button);
            });
        }
    } else {
        // すべて解き終わったとき
        levelBadge.style.display = 'none';
        qNumberText.innerText = "クリア！";
        qText.innerText = "全問終了しました！";
        feedbackText.innerHTML = `よくがんばりました！すべての証明・問題をマスターしたぞ！ 🌟`;
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
