/* ==========================================
   QUIZORA
   categories.js
========================================== */


document.addEventListener("DOMContentLoaded",()=>{


    const cards = document.querySelectorAll(".category-card");



    cards.forEach(card=>{


        card.addEventListener("click",()=>{


            const category = card.dataset.category;



            if(!category){

                console.error("Category not found");

                return;

            }



            console.log("Selected Category:", category);



            // Save selected category

            localStorage.setItem(
                "selectedCategory",
                category
            );



            // Redirect to quiz page

            window.location.href =
            "quiz.html?category=" + encodeURIComponent(category);



        });


    });


});