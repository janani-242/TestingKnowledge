/* ==========================================
   QUIZORA RESULT PAGE JS
========================================== */


// ===============================
// CATEGORY NAMES
// ===============================

const categoryNames = {

    "general-knowledge": "🧠 General Knowledge",

    "current-affairs": "📰 Current Affairs",

    "science": "🔬 Science & Technology",

    "computer-science": "💻 Computer Science",

    "aptitude": "📊 Aptitude",

    "mathematics": "🧮 Mathematics",

    "logical-reasoning": "🤔 Logical Reasoning",

    "riddles": "🧩 Riddles",

    "sports": "🏆 Sports",

    "mixed": "🎯 Ultimate Challenge"

};


// ===============================
// GET DATA
// ===============================

let score =
    Number(
        localStorage.getItem("score")
    ) || 0;


let questions =
    JSON.parse(
        localStorage.getItem("questions")
    ) || [];


let userAnswers =
    JSON.parse(
        localStorage.getItem("userAnswers")
    ) || [];


let category =
    localStorage.getItem("category")
    ||
    "Quizora Quiz";


// ===============================
// ELEMENTS
// ===============================

const scoreElement =
    document.getElementById("score");


const percentageElement =
    document.getElementById("percentage");


const correctElement =
    document.getElementById("correct");


const wrongElement =
    document.getElementById("wrong");


const totalElement =
    document.getElementById("total");


const categoryElement =
    document.getElementById("categoryName");


const statusElement =
    document.getElementById("resultStatus");


const certificateBtn =
    document.getElementById("certificateBtn");


// ===============================
// CATEGORY DISPLAY
// ===============================

if (categoryElement) {

    categoryElement.innerHTML =
        categoryNames[category]
        ||
        category;

}


// ===============================
// SCORE CALCULATION
// ===============================

let total =
    questions.length || 10;


let percentage =
    Math.round(
        (score / total) * 100
    );


// ===============================
// SCORE DISPLAY
// ===============================

if (scoreElement) {

    scoreElement.innerHTML =
        `${score}/${total}`;

}


if (percentageElement) {

    percentageElement.innerHTML =
        percentage + "%";

}


if (totalElement) {

    totalElement.innerHTML =
        total;

}


// ===============================
// CORRECT / WRONG
// ===============================

let correct = 0;


questions.forEach(
    (q, index) => {

        if (
            userAnswers[index] === q.answer
        ) {

            correct++;

        }

    }
);


let wrong =
    total - correct;


if (correctElement) {

    correctElement.innerHTML =
        correct;

}


if (wrongElement) {

    wrongElement.innerHTML =
        wrong;

}


// ===============================
// RESULT STATUS
// ===============================

if (statusElement) {

    if (percentage === 100) {

        statusElement.innerHTML =
            "🏆 Perfect Score! Champion";

    }

    else if (percentage >= 80) {

        statusElement.innerHTML =
            "🥇 Excellent Performance";

    }

    else if (percentage >= 60) {

        statusElement.innerHTML =
            "🥈 Good Job! Keep Improving";

    }

    else {

        statusElement.innerHTML =
            "🥉 Keep Practicing";

    }

}


// ===============================
// CERTIFICATE BUTTON
// 60% AND ABOVE
// ===============================

if (certificateBtn) {

    if (percentage >= 60) {

        certificateBtn.style.display =
            "block";

    }

    else {

        certificateBtn.style.display =
            "none";

    }

}


// ===============================
// CERTIFICATE FUNCTION
// ===============================

function generateCertificate() {


    // ===============================
    // CERTIFICATE NAME
    // ===============================

    localStorage.setItem(
        "certificateName",

        localStorage.getItem("userName")
        ||
        "Quiz Participant"
    );


    // ===============================
    // CERTIFICATE CATEGORY
    // ===============================

    localStorage.setItem(
        "certificateCategory",

        categoryNames[category]
        ||
        category
    );


    // ===============================
    // CERTIFICATE SCORE
    // ===============================

    localStorage.setItem(
        "certificateScore",

        `${score}/${total}`
    );


    // ===============================
    // SAVE RAW SCORE
    // FOR LEAGUE
    // ===============================

    localStorage.setItem(
        "score",
        String(score)
    );


    // ===============================
    // SAVE TOTAL
    // ===============================

    localStorage.setItem(
        "certificateTotal",
        String(total)
    );


    // ===============================
    // SAVE PERCENTAGE
    // ===============================

    localStorage.setItem(
        "certificatePercentage",
        String(percentage)
    );


    // ===============================
    // OPEN CERTIFICATE
    // ===============================

    window.location.href =
        "certificate.html";

}