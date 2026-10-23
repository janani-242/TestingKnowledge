/* ==========================================
   QUIZORA'26 CERTIFICATE JS
   REAL TIME DATA + AUTO PDF DOWNLOAD
   + HASURA CERTIFICATE STATUS UPDATE
   + ACHIEVEMENT LEAGUE
========================================== */


// ===============================
// ELEMENTS
// ===============================

const studentName =
    document.getElementById("studentName");

const category =
    document.getElementById("category");

const certificateId =
    document.getElementById("certificateId");

const issueDate =
    document.getElementById("issueDate");


// ===============================
// CATEGORY NAME FORMAT
// ===============================

const categoryNames = {

    "general-knowledge": "General Knowledge",

    "current-affairs": "Current Affairs",

    "science": "Science & Technology",

    "computer-science": "Computer Science",

    "aptitude": "Aptitude",

    "mathematics": "Mathematics",

    "logical-reasoning": "Logical Reasoning",

    "riddles": "Riddles",

    "sports": "Sports",

    "mixed": "Ultimate Challenge"

};


// ===============================
// GET REAL TIME DATA
// ===============================

let name =
    localStorage.getItem("userName") ||
    localStorage.getItem("certificateName") ||
    "Participant";


let quizCategory =
    localStorage.getItem("category") ||
    "Quiz Winner";


quizCategory =
    categoryNames[quizCategory] ||
    localStorage.getItem("certificateCategory") ||
    quizCategory;


// ===============================
// CERTIFICATE ID
// ===============================

let certID =
    localStorage.getItem("certificateId") ||
    "QZ26-000000";


// ===============================
// ISSUE DATE
// ===============================

let date =
    localStorage.getItem("issueDate") ||
    new Date().toLocaleDateString();


// ===============================
// GET SCORE
// ===============================

// Result page saves the raw score
// in localStorage

let score =
    Number(
        localStorage.getItem("score")
    ) || 0;


// ===============================
// DISPLAY DATA
// ===============================

if (studentName) {

    studentName.textContent =
        name;

}


if (category) {

    category.textContent =
        quizCategory;

}


if (certificateId) {

    certificateId.textContent =
        certID;

}


if (issueDate) {

    issueDate.textContent =
        date;

}


// ===============================
// LEAGUE
// 6 - 10 MARKS ONLY
// ===============================

function getLeague(score) {

    const leagues = {

        10: "DIAMOND LEAGUE",

        9: "PLATINUM LEAGUE",

        8: "GOLD LEAGUE",

        7: "SILVER LEAGUE",

        6: "BRONZE LEAGUE"

    };

    return leagues[Number(score)] || "";

}


// ===============================
// SHOW LEAGUE
// ===============================

function showLeague(score) {

    const leagueBox =
        document.getElementById("leagueBox");

    const league =
        document.getElementById("league");


    // If HTML elements don't exist,
    // stop safely

    if (!leagueBox || !league) {

        return;

    }


    const leagueName =
        getLeague(score);


    // ===============================
    // SHOW LEAGUE
    // ===============================

    if (leagueName !== "") {

        league.textContent =
            leagueName;

        leagueBox.style.display =
            "block";

    }

    // ===============================
    // HIDE LEAGUE
    // ===============================

    else {

        league.textContent =
            "";

        leagueBox.style.display =
            "none";

    }

}


// ===============================
// DISPLAY LEAGUE
// ===============================

showLeague(score);


// ===============================
// UPDATE CERTIFICATE STATUS
// ===============================

let certificateSaved = false;


async function updateCertificateStatus() {

    const attemptId =
        Number(
            localStorage.getItem("attemptId")
        );


    if (
        !attemptId ||
        certificateSaved
    ) {

        return;

    }


    certificateSaved = true;


    try {

        await gql(`

            mutation($a:Int!,$c:String!) {

                insert_certificates_one(

                    object:{

                        attempt_id:$a,

                        certificate_code:$c,

                        downloaded:true

                    }

                ){

                    id

                }

            }

        `, {

            a: attemptId,

            c: certID

        });


        console.log(
            "Certificate saved"
        );


    }

    catch (err) {

        console.log(
            "Certificate save:",
            err.message
        );

    }

}


// ===============================
// FIT CERTIFICATE TO ANY SCREEN
// (mobile / tablet / laptop)
// ===============================

const CERT_W = 1120;
const CERT_H = 790;

function fitCertificate() {

    const stage = document.getElementById("certStage");
    const cert  = document.getElementById("certificate");

    if (!stage || !cert) return;

    const avail = Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth) - 24;
    const scale = Math.min(1, avail / CERT_W);

    cert.style.transform = "scale(" + scale + ")";
    stage.style.width  = Math.round(CERT_W * scale) + "px";
    stage.style.height = Math.round(CERT_H * scale) + "px";
}

window.addEventListener("resize", fitCertificate);
window.addEventListener("orientationchange", fitCertificate);
document.addEventListener("DOMContentLoaded", fitCertificate);


// ===============================
// AUTO PDF DOWNLOAD
// ===============================

window.onload = function () {

    setTimeout(() => {

        downloadPDF();

    }, 1500);

};


// ===============================
// DOWNLOAD PDF
// ===============================

async function downloadPDF() {

    const certificate =
        document.getElementById("certificate");


    const button =
        document.querySelector(".download-btn");


    // capture at full size (remove screen scaling)
    const stage = document.getElementById("certStage");
    const prevTransform = certificate ? certificate.style.transform : "";
    const prevW = stage ? stage.style.width : "";
    const prevH = stage ? stage.style.height : "";

    function restoreFit() {
        if (!certificate) return;
        certificate.style.transform = prevTransform;
        if (stage) { stage.style.width = prevW; stage.style.height = prevH; }
        window.scrollTo(0, 0);
    }

    if (certificate) {
        certificate.style.transform = "none";
        if (stage) { stage.style.width = CERT_W + "px"; stage.style.height = CERT_H + "px"; }
    }

    if (!certificate) {

        console.error(
            "Certificate element not found"
        );

        return;

    }


    // Hide download button
    // while generating PDF

    if (button) {

        button.style.display =
            "none";

    }


    html2canvas(

        certificate,

        {

            scale: 3,

            useCORS: true,

            allowTaint: true,

            backgroundColor: "#ffffff",

            scrollX: 0,

            scrollY: 0,

            windowWidth: CERT_W + 100

        }

    )

    .then(async canvas => {


        const imageData =
            canvas.toDataURL(
                "image/png"
            );


        const { jsPDF } =
            window.jspdf;


        const pdf =
            new jsPDF(

                "landscape",

                "mm",

                "A4"

            );


        const pdfWidth =
            pdf.internal.pageSize.getWidth();


        const pdfHeight =
            pdf.internal.pageSize.getHeight();


        pdf.addImage(

            imageData,

            "PNG",

            0,

            0,

            pdfWidth,

            pdfHeight

        );


        pdf.save(
            "Quizora_26_Certificate.pdf"
        );


        // ===============================
        // UPDATE DATABASE
        // ===============================

        await updateCertificateStatus();


        // Show button again

        restoreFit();

        if (button) {

            button.style.display =
            "block";

        }

    })


    .catch(error => {

        console.log(
            "PDF Error:",
            error
        );


        alert(
            "PDF Download Failed"
        );


        restoreFit();


        if (button) {

            button.style.display =
            "block";

        }

    });

}


// ===============================
// GLOBAL DOWNLOAD FUNCTION
// ===============================

window.downloadPDF =
    downloadPDF;