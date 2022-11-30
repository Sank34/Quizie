/* TO DO LIST
    -bug with calculating the points
    -list.html
    -responsive phone bug with the text
*/

// bar fill percentage variable
function setProgress(percentage) {
    document.getElementById("progress").style.width = `${percentage}%`;
}
let correctGuesses = 0;

//redirect to home on close
function BtnClose() {
    window.open("list.html", '_parent');
} 
//close modal function
function close_modal() {
    let modal = document.querySelector("#modal");
    modal.classList.add("closed");
    setTimeout(function () {
        modal.style.display = 'none';
    }, 500); // wait for the animation
}
//open modal function
function open_modal(title, num_of_stars, text, btn_click, btn_text) {
    let txt = document.getElementById("switch")
    txt.innerText = btn_text
    btn_modal_clicked = btn_click;
    let modal = document.querySelector("#modal")
    let modal_title = document.querySelector("#modal > div.content > div.headerModal > h1"); 
    modal_title.innerText = title;
    modal.style.display = 'flex';
    let maintext = document.querySelector("#modal > div.content > div.mainModal > h3");
    maintext.innerText = text;
    stars(num_of_stars);
    setTimeout(function () {
        modal.classList.remove("closed");
    }, 50);
}
//select stars function
function stars(number) {
    if (number < 0) number = 0;
    if (number > 5) number = 5;
    // step 1. get the stars div from the html (querySelector)
    let star_arr = [
        document.getElementById("star1"), 
        document.getElementById("star2"), 
        document.getElementById("star3"), 
        document.getElementById("star4"), 
        document.getElementById("star5"), 
    ];
    // set the stars accordingly
    for (let i = 0; i < star_arr.length; i++) {
        star_arr[i].style.display = 'none';
    }
    for (let i = 0; i < number; i++) {
        star_arr[i].style.display = 'block';
    }
}
//current question
let currentquestion = 0;
//switch question function
function switch_question() {
    //to finish
    /* algorithm to switch question 
    ==============================================
        Step 1: Gather the question div
        Step 2: Gather the next question
        Step 3: Get the button from the modal
        Step 4: Set the event
        Step 5: Make a fancy animation transition ⭐️
        Step 6: Display the question 
    ==============================================
    */ 
    let question_text = document.querySelector("body > div.main > div.content > div.questionWrapper > p")
    let button = document.getElementById("switch")
        $.get('data.json', function(data) {
            questions = data.questions
            // increment currentquestion
            currentquestion += 1; 
            let question = questions[currentquestion]; 
            load_question(question); //load it on the webpage 
        })
    
 
}

// wait for page to be ready
addEventListener('DOMContentLoaded', (e) => {
    //close modal on bg click
    let modalcontent = document.querySelector("#modal > div.content");
    // add the same event, then stop the propagation
    modalcontent.addEventListener('click', (event) => {
        event.stopPropagation()  
    })

    //click sound effect 
    let audio = new Audio('/audios/fancyclick.wav')
    let buttons = document.querySelectorAll('div.main div.content div.AnswerButtonWrapper button');
    for (button of buttons) {
        button.addEventListener('click', () => {
            audio.play(); 
            checkanswers()
        });
    }
    //close btn sound effect
    let butn = document.querySelector('body > div.header > div.closeButtonWrapper');
    butn.addEventListener('click', () => {
        audio.play(); 
    });
    startup()
}); 

/* QUIZ ALGORITHM 
    System algorithm for the quiz xd
        ===== Startup ======
        1.Gather the questions.
        2.Display the first question
            -Grab data from the first question. 
            -Put the data onto the webpage.
            -We display it.
        === Answer button pressed event === 
        1.We check the button pressed
        —> if the button is the right one: 
                —> if it’s the last question: 
                        1.1. Display the congrats page
                —>else:
                        1.1.Get to the next question 
                        1.2.Display a congrats animation or smth

        —> if the button is not the right one:
                1.1.Send a msg saying that the answer is not correct
                1.2.Play a sad turtle animation 😭🐢
*/

//startup
var btn_modal_clicked = function () { }
var questions;

function startup() {
    //Gather the questions
    $.get('data.json', function (data) {
        questions = data.questions
        //Grab data from the first question
        let q1 = questions[0]
        //Put the data onto the webpage.
        load_question(q1)
    });
    //select "next question btn"
    let button = document.getElementById("switch")//yep, very correct
    button.addEventListener('click', () => {
        btn_modal_clicked(); 
    });
}
//load question function 

function load_question(qst) {
    //Gather the questions
        //Put the data onto the webpage.
        let qText = document.querySelector('body > div.main > div.content > div.questionWrapper > p')
        qText.innerText = qst.text
        let btns = document.querySelectorAll('body > div.main > div.content > div.AnswerButtonWrapper > button')
        let random = Math.floor(Math.random() * 4)
        let correctAnsw = qst.correct_answer
        let wrongAnsw1 = qst.wrong_answers[0]
        let wrongAnsw2 = qst.wrong_answers[1]
        let wrongAnsw3 = qst.wrong_answers[2]
        let answers = [
            { text: correctAnsw, click: () => { checkanswers(true,  currentquestion); } }, 
            { text:wrongAnsw1,   click: () => { checkanswers(false, currentquestion); }} , 
            { text:wrongAnsw2,   click: () => { checkanswers(false, currentquestion); }} ,  
            { text:wrongAnsw3,   click: () => { checkanswers(false, currentquestion); }} , 
        ];
        answers = shuffle(answers)
        btns[0].innerText = answers[0].text;
        btns[0].onclick = answers[0].click;
        btns[1].innerText = answers[1].text;
        btns[1].onclick = answers[1].click;
        btns[2].innerText = answers[2].text;
        btns[2].onclick = answers[2].click;
        btns[3].innerText = answers[3].text;
        btns[3].onclick = answers[3].click;
}

//shufle arrays function
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
//condition for text limit
let correctanswers = 5;
//check answers function
function checkanswers(correct, index) {
    if (correct == true && index == questions.length - 1) {
        // correct answer, and final answer 
        /*open_modal(
            "correct answer, and final answer",
            0,//stars
            "You’ve managed to complete this quiz with a score of",
            function () {
                window.open('list.html', '_blank') 
            },
            "Awesome!" //this thingy doesn t work, i think the problem is here
        ); */
        if (correctanswers < 0) {
            correctanswers = 0;
        }
        if (correctanswers <= 2) {
            open_modal(
                "Sadly..",
                correctanswers,
                `You got just ${correctanswers} out of 5..Maybe try again?`,
                function () {
                    window.location.reload();
                },
                'Try again' //add another button in the future that returns to the main page
            );
            correctGuesses += 100/questions.length
            setProgress(correctGuesses)
            return; 
        } else if (correctanswers > 2 && correctanswers <= 5) {
            open_modal(
                "Congrats!",
                correctanswers,
                "You’ve managed to complete this quiz with a score of",
                function () {
                    window.open('list.html', '_blank')
                },
                'Awesome'
            )
            correctGuesses += 100/questions.length
            setProgress(correctGuesses)
        }
    } else if (correct==true && index!=questions.length-1) {
        // right answer & not the last one
        open_modal(
            "Correct!",
            0,//stars
            "Awesome! You got this one correct. Great job!", 
            function () {
                switch_question();
                close_modal(); 
            },
            "Next question" 
        );
        correctGuesses += 100/questions.length
        setProgress(correctGuesses);
        let check = false 
        
    } else if (correct==false){
        //if it's incorrect
        open_modal(
            "Wrong!",
            0,//stars
            "Seems like you didn't answered correctly. No worries, you can always try again!", 
            function () {
                close_modal() 
            },
            "Try again"
        );
        //decrement the x variable
        correctanswers -= 1;
    }
}
