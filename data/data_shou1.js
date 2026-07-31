const CURRENT_QUIZ_DATA = {
    title: "🎒 小学1年生 算数（無限ランダム・ボリューム版）",
    questions: [
        // くりあがりのない たし算
        { type: "基礎", isRandom: true, pattern: "shou1_add" },
        { type: "基礎", isRandom: true, pattern: "shou1_add" },
        { type: "基礎", isRandom: true, pattern: "shou1_add" },
        // くりさがりのない ひき算
        { type: "基礎", isRandom: true, pattern: "shou1_sub" },
        { type: "基礎", isRandom: true, pattern: "shou1_sub" },
        { type: "基礎", isRandom: true, pattern: "shou1_sub" },
        // 10をともなう計算
        { type: "基礎", q: "10 ＋ 7 は なに？", c: ["15", "16", "17", "18"], a: "17" },
        { type: "基礎", q: "14 － 4 は なに？", c: ["9", "10", "11", "12"], a: "10" },
        // 3つの数の計算
        { type: "基礎", q: "3 ＋ 2 ＋ 4 は なに？", c: ["8", "9", "10", "7"], a: "9" },
        { type: "基礎", q: "8 － 3 ＋ 2 は なに？", c: ["5", "6", "7", "8"], a: "7" },
        { type: "基礎", q: "10 － 4 － 2 は なに？", c: ["4", "5", "6", "3"], a: "4" },
        // くりあがり・くりさがり（文章題含む）
        { type: "基礎", q: "8 ＋ 6 は なに？", c: ["13", "14", "15", "16"], a: "14" },
        { type: "基礎", q: "9 ＋ 5 は なに？", c: ["13", "14", "15", "12"], a: "14" },
        { type: "基礎", q: "12 － 4 は なに？", c: ["7", "8", "9", "6"], a: "8" },
        { type: "基礎", q: "15 － 7 は なに？", c: ["6", "7", "8", "9"], a: "8" }
    ]
};
