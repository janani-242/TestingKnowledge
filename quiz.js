/* ==========================================
   QUIZORA QUIZ ENGINE
   PART 1
   HASURA + UPDATE RESULT VERSION
========================================== */





let params = new URLSearchParams(window.location.search);

let selectedCategory =
params.get("category");

if (!selectedCategory) {
    selectedCategory =
    localStorage.getItem("selectedCategory");
}

if (selectedCategory) {
    localStorage.setItem(
        "selectedCategory",
        selectedCategory
    );
}

if(!localStorage.getItem("participantId")){
    window.location.href = "login.html";
}

let selectedQuestions = [];
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 120;
let timer = null;

/* ==========================
   CATEGORY NAMES
========================== */

const categoryNames = {

    "general-knowledge":
    "🧠 General Knowledge",

    "current-affairs":
    "📰 Current Affairs",

    "science":
    "🔬 Science & Technology",

    "computer-science":
    "💻 Computer Science",

    "riddles":
    "🧩 Riddles"

};

/* ==========================
   QUESTION DATABASE
========================== */

const quizDatabase = {

    "general-knowledge":

    typeof gkQuestions !== "undefined"
    ? gkQuestions
    : [],

    "current-affairs":

    typeof currentAffairs !== "undefined"
    ? currentAffairs
    : [],

    "science":

    typeof scienceQuestions !== "undefined"
    ? scienceQuestions
    : [],

    "computer-science":

    typeof computerQuestions !== "undefined"
    ? computerQuestions
    : [],

    "riddles":

    typeof riddlesQuestions !== "undefined"
    ? riddlesQuestions
    : []

};

/* ==========================
   SHUFFLE
========================== */

function shuffle(array){

    let arr = [...array];

    for(let i=arr.length-1;i>0;i--){

        let j =
        Math.floor(
            Math.random()*(i+1)
        );

        [arr[i],arr[j]] =
        [arr[j],arr[i]];

    }

    return arr;

}

/* ==========================
   PAGE LOAD
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

    let title =
    categoryNames[selectedCategory]
    ||
    "Quizora Quiz";

    document.getElementById(
        "startTitle"
    ).innerHTML =
    title+" Quiz";

    document.getElementById(
        "categoryTitle"
    ).innerHTML =
    title;

    document.getElementById(
        "startBtn"
    ).onclick=function(){

        document.getElementById(
            "startScreen"
        ).style.display="none";

        document.getElementById(
            "quizArea"
        ).style.display="block";

        loadQuiz();

        startTimer();

    };

});

/* ==========================
   LOAD QUIZ
========================== */

function loadQuiz(){

    let questions =
    quizDatabase[selectedCategory];

    if(!questions || questions.length===0){

        alert(
            "Questions not found : "
            + selectedCategory
        );

        return;

    }

    selectedQuestions =
    shuffle(questions).slice(0,10);

    document.getElementById(
        "totalQuestions"
    ).innerHTML =
    selectedQuestions.length;

    showQuestion();

}

/* ==========================
   SHOW QUESTION
========================== */

function showQuestion(){

    let q =
    selectedQuestions[currentQuestion];

    if(!q) return;

    document.getElementById(
        "currentQuestion"
    ).innerHTML =
    currentQuestion+1;

    document.getElementById(
        "question"
    ).innerHTML =
    `${currentQuestion+1}. ${q.question}`;

    let html="";

    q.options.forEach(
    (option,index)=>{

        let selected="";

        if(
            userAnswers[currentQuestion]
            ===
            index
        ){
            selected="selected";
        }

        html += `
        <button
        class="option-btn ${selected}"
        onclick="selectAnswer(${index},this)">
        ${option}
        </button>
        `;

    });

    document.getElementById(
        "options"
    ).innerHTML = html;

    updateProgress();

}
/* ==========================
   PART 2
========================== */

/* ==========================
   SELECT ANSWER
========================== */

function selectAnswer(answer,button){

    userAnswers[currentQuestion] = answer;

    document
    .querySelectorAll(".option-btn")
    .forEach(btn=>{
        btn.classList.remove("selected");
    });

    button.classList.add("selected");

}

/* ==========================
   NEXT BUTTON
========================== */

document.getElementById(
"nextBtn"
).onclick = function(){

    if(
        currentQuestion <
        selectedQuestions.length-1
    ){

        currentQuestion++;

        showQuestion();

    }

    else{

        finishQuiz();

    }

};

/* ==========================
   PREVIOUS BUTTON
========================== */

document.getElementById(
"previousBtn"
).onclick = function(){

    if(currentQuestion>0){

        currentQuestion--;

        showQuestion();

    }

};

/* ==========================
   PROGRESS BAR
========================== */

function updateProgress(){

    let percent =
    (
        (currentQuestion+1)
        /
        selectedQuestions.length
    )*100;

    document.getElementById(
        "progress"
    ).style.width =
    percent+"%";

}

/* ==========================
   TIMER
========================== */

function startTimer(){
    window.__quizRunning = true;

    timer = setInterval(()=>{

        timeLeft--;

        document.getElementById(
            "timer"
        ).innerHTML =
        timeLeft;

        if(timeLeft<=10){

            document
            .getElementById("timer")
            .classList
            .add("timer-warning");

        }

        if(timeLeft<=0){

            clearInterval(timer);

            finishQuiz();

        }

    },1000);

}

/* ==========================
   UPDATE RESULT TO HASURA
========================== */

async function saveQuizResult(score){
    try{
        const data = await gql(`
        mutation($p:Int!,$c:String!,$s:Int!,$t:Int!,$time:Int!){
          insert_quiz_attempts_one(object:{participant_id:$p,category_slug:$c,
            score:$s,total:$t,time_taken:$time}){ id }
        }`,{
            p:Number(localStorage.getItem("participantId")),
            c:selectedCategory, s:score,
            t:selectedQuestions.length, time:120-timeLeft
        });
        localStorage.setItem("attemptId",data.insert_quiz_attempts_one.id);
        localStorage.setItem("certificateId","QZ26-"+Math.floor(100000+Math.random()*900000));
        const d=new Date();
        localStorage.setItem("issueDate",d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

/* ==========================
   PART 3
========================== */

/* ==========================
   FINISH QUIZ
========================== */

async function finishQuiz(){
    window.__quizRunning = false;

    if(window.quizFinished) return;
    window.quizFinished = true;

    if(timer){
        clearInterval(timer);
    }

    let score = 0;

    selectedQuestions.forEach((q,index)=>{

        if(userAnswers[index] === q.answer){
            score++;
        }

    });

    /* ==========================
       SAVE LOCAL STORAGE
    ========================== */

    localStorage.setItem(
        "score",
        score
    );

    localStorage.setItem(
        "questions",
        JSON.stringify(selectedQuestions)
    );

    localStorage.setItem(
        "userAnswers",
        JSON.stringify(userAnswers)
    );

    localStorage.setItem(
        "category",
        selectedCategory
    );

    localStorage.setItem(
        "result",
        score
    );

    localStorage.setItem(
        "totalQuestions",
        selectedQuestions.length
    );

    localStorage.setItem(
        "completedAt",
        new Date().toLocaleString()
    );

    /* ==========================
       SAVE RESULT TO HASURA
    ========================== */

    const saved =
    await saveQuizResult(score);

    if(saved){

        console.log(
            "✅ Quiz Result Updated Successfully"
        );

    }else{

        console.log(
            "⚠️ Result not saved to Hasura"
        );

    }

    /* ==========================
       GO TO RESULT PAGE
    ========================== */

    window.location.href =
    "result.html";

}

/* ==========================
   PREVENT BACK AFTER FINISH
========================== */

window.addEventListener(
    "beforeunload",
    function(){

        if(timer){

            localStorage.setItem(
                "quizInProgress",
                "true"
            );

        }

    }
);

/* ==========================
   END OF FILE
========================== */