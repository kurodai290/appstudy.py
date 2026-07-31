// クイズのデータ（問題集）
const quizData = {
    // 小学生・算数のデータ
    shou_sansu: [
        { type: "基礎", q: "8 + 7 は なに？", c: ["13", "14", "15", "16"], a: "15" },
        { type: "基礎", q: "15 - 9 は なに？", c: ["4", "5", "6", "7"], a: "6" },
        { type: "基礎", q: "3 × 4 は なに？", c: ["12", "14", "16", "18"], a: "12" },
        { type: "基礎", q: "20 ＋ 30 は なに？", c: ["40", "50", "60", "70"], a: "50" },
        { type: "基礎", q: "120 － 30 は なに？", c: ["80", "90", "100", "110"], a: "90" }
    ],
    // 中学生・数学のデータ
    chu_suugaku: [
        // 前半3問は基礎
        { type: "基礎", q: " 5 + (-3) の計算結果は？", c: ["2", "-2", "8", "-8"], a: "2" },
        { type: "基礎", q: " (-4) × 3 の計算結果は？", c: ["12", "-12", "7", "-7"], a: "-12" },
        { type: "基礎", q: " 2x = 10 のとき、xの値は？", c: ["2", "3", "4", "5"], a: "5" },
        // 後半2問は応用（自動で切り替わります）
        { type: "応用", q: "【応用】 3(x - 2) = 9 のとき、xの値は？", c: ["3", "4", "5", "6"], a: "5" },
        { type: "応用", q: "【応用】 2つの数があり、足すと10、引くと4になります。大きい方の数は？", c: ["5", "6", "7", "8"], a: "7" }
    ]
};

// URLから「学年(grade)」と「教科(subject)」を読み取る
const urlParams = new URLSearchParams(window.location.search);
const grade = urlParams.get('grade');
const subject = urlParams.get('subject');
const quizKey = `${grade}_${subject}`;

// 使う問題をセット
const questions = quizData[quizKey] || [];
let currentQuestionIndex = 0;
let score = 0;

// 画面のパーツを取得
const quizTitle = document.getElementById('quiz-title');
const levelBadge = document.getElementById('level-badge');
const qNumberText = document.getElementById('question-number');
const qText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const resultMessage = document.getElementById('result-message');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');

// クイズ画面のタイトルを書き換える
if (grade === 'shou') quizTitle.innerText = "🎒 小学生 算数クイズ";
if (grade === 'chu') quizTitle.innerText = "✍ 中学生 数学クイズ";

// 問題を表示する関数
function showQuestion() {
    resultMessage.classList.add('hide'); // 次の判定が出るまで隠す
    choicesContainer.innerHTML = ''; // 前の選択肢を消す

    if (currentQuestionIndex < questions.length) {
        const currentData = questions[currentQuestionIndex];
        
        // 基礎か応用かのバッジを切り替える
        levelBadge.innerText = `${currentData.type}ステージ`;
        if (currentData.type === "応用") {
            levelBadge.className = "badge advanced";
        } else {
            levelBadge.className = "badge basic";
        }

        qNumberText.innerText = `第 ${currentQuestionIndex + 1} 問 / 全${questions.length}問`;
        qText.innerText = currentData.q;

        // 選択肢ボタンを作る
        currentData.c.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.classList.add('choice-btn');
            button.onclick = () => checkAnswer(button, choice, currentData.a);
            choicesContainer.appendChild(button);
        });
    } else {
        // 全問終わったときの結果発表
        levelBadge.style.display = 'none';
        qNumberText.innerText = "終了！";
        qText.innerText = "おつかれさまでした！";
        feedbackText.innerHTML = `あなたの点数: <strong>${questions.length}問中 ${score}問正解</strong> 🌟`;
        nextBtn.innerText = "トップページに戻る";
        nextBtn.onclick = () => window.location.href = "index.html";
        resultMessage.classList.remove('hide');
    }
}

// 答え合わせの関数
function checkAnswer(selectedButton, selectedChoice, correctChoice) {
    // 1度クリックしたら他のボタンを押せなくする
    const allButtons = choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedChoice === correctChoice) {
        selectedButton.classList.add('correct');
        feedbackText.innerText = "⭕ 正解！ すごい！";
        score++;
    } else {
        selectedButton.classList.add('wrong');
        feedbackText.innerText = `❌ 残念！ 正解は「${correctChoice}」でした。`;
        
        // 正解のボタンを緑色にする
        allButtons.forEach(btn => {
            if (btn.innerText === correctChoice) btn.classList.add('correct');
        });
    }

    resultMessage.classList.remove('hide');
}

// 「次へ」ボタンを押したとき
nextBtn.onclick = () => {
    currentQuestionIndex++;
    showQuestion();
};

// 最初に1問目を表示
showQuestion();
