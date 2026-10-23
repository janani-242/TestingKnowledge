
/* ==========================================
   QUIZORA'26
   login.js
   FIRST NAME EXPERIENCE + HASURA LOGIN SAVE
========================================== */


/*====================================
        HASURA CONFIG
====================================*/









const loginForm = document.getElementById("loginForm");

const toast = document.getElementById("toast");





/*====================================
        ELEMENTS
====================================*/


const page = document.querySelector(".login-page");

const firstNameInput =
document.getElementById("firstName");





/*====================================
        FIRST NAME TYPE EXPERIENCE
====================================*/


firstNameInput.addEventListener("input",()=>{


    if(firstNameInput.value.trim() !== ""){


        page.classList.add("expand");


    }


});







/*====================================
        TOAST FUNCTION
====================================*/


function showToast(message,color="#0F172A"){



    toast.innerText = message;


    toast.style.background=color;


    toast.style.opacity="1";


    toast.style.visibility="visible";



    setTimeout(()=>{


        toast.style.opacity="0";


        toast.style.visibility="hidden";



    },2500);



}









/*====================================
        SAVE USER TO HASURA
====================================*/


async function saveLoginUser(firstName,lastName,dob){
    try{
        const data = await gql(`
        mutation($f:String!,$l:String!,$d:date!){
          insert_participants_one(object:{first_name:$f,last_name:$l,dob:$d}){ id }
        }`,{f:firstName,l:lastName,d:dob});
        localStorage.setItem("participantId",data.insert_participants_one.id);
        return true;
    }catch(err){
        console.error(err);
        showToast("Database Error","#DC2626");
        return false;
    }
}

/*====================================
        LOGIN SUBMIT
====================================*/


loginForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();




const firstName =
document.getElementById("firstName")
.value.trim();



const lastName =
document.getElementById("lastName")
.value.trim();



const dob =
document.getElementById("dob")
.value;







/* VALIDATION */


if(firstName===""){


showToast(
"Please enter your First Name",
"#DC2626"
);


return;


}



if(lastName===""){


showToast(
"Please enter your Last Name",
"#DC2626"
);


return;


}



if(dob===""){


showToast(
"Please select your Date of Birth",
"#DC2626"
);


return;


}








/*====================================
        LOCAL STORAGE
====================================*/


const fullName =
firstName+" "+lastName;



const user={


firstName,

lastName,

fullName,

dob


};



localStorage.setItem(
"quizUser",
JSON.stringify(user)
);



localStorage.setItem(
"userName",
fullName
);



localStorage.setItem(
"firstName",
firstName
);



localStorage.setItem(
"lastName",
lastName
);



localStorage.setItem(
"dob",
dob
);







/* CERTIFICATE ID */


const certificateID =

"QZ26-" +

Math.floor(
100000+
Math.random()*900000
);



localStorage.setItem(
"certificateId",
certificateID
);







/* ISSUE DATE */


const today = new Date();



const issueDate =

today.getDate()
+
"/"
+
(today.getMonth()+1)
+
"/"
+
today.getFullYear();



localStorage.setItem(
"issueDate",
issueDate
);








/*====================================
        HASURA SAVE
====================================*/


const saved =
await saveLoginUser(
firstName,
lastName,
dob
);




if(!saved){

return;

}






showToast(
"Welcome "+firstName+"!",
"#16A34A"
);







/*====================================
        PAGE EXIT
====================================*/


page.classList.add("page-exit");



setTimeout(()=>{


window.location.href=
"categories.html";



},1000);



});