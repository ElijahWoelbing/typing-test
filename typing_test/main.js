
const textContainer = document.querySelector(".text-container");
const errorInfo = document.querySelector(".errors");
const timerInfo = document.querySelector(".timer");
const wordsPerMinuteInfo = document.querySelector(".words-per-minute");
const gererateTextButton = document.querySelector(".new-test-btn")
const buttons = document.querySelectorAll(".button");
let cursor;
let paragraphElm;
let text;
let letterIndex = 0;
let started = false;
let errors = 0;
let error = false;


function generateNewTest(){
    fetch("http://www.randomtext.me/api/gibberish/p-1/200").then((response)=>{
        return response.json();
    }).then((json)=>{
        textContainer.innerHTML = json.text_out;
    }).then(()=>{
        textContainer.firstChild.classList.add("text")
        paragraphElm = document.querySelector(".text");
        text = document.querySelector(".text").innerText
        paragraphElm.innerText = text;
    })
}

generateNewTest();

document.addEventListener("keypress", (event)=>{
    if(!started){
        started = true;
        timer();
    }
    checkTyping(event);
    cursor.scrollIntoView();
    animateTyping(event)
   
})

function styleText(activeIndex, correct){
    let textLeft = text.substring(0, activeIndex);
    let textRight = text.substring(activeIndex + 1);
    paragraphElm.innerHTML = `<span class = "typed">${textLeft}</span><span class = " active ${correct ? '' : 'error'}">${text[activeIndex]}</span>${textRight}`
    cursor = document.querySelector(".active");
}

function checkTyping(event){
    if(event.keyCode != 123 && event.keyCode != 16 ){
        if(event.keyCode === text.charCodeAt(letterIndex)){
            error = false;
            letterIndex++;
            styleText(letterIndex, true);
    
        } else {
            if(error === false){
                error = true;
                errors++
                errorInfo.innerText = `Errors: ${errors}`;
            }
            
            styleText(letterIndex, false);
        }
        if(event.keyCode === 32){
            event.preventDefault()
        }
    }
}

function timer(){
    let startTime = Date.now();
    let delta;
    let seconds;
    let minutes;
    let intervalId = setInterval(()=>{
        
        delta = Date.now() - startTime;
        seconds = ((( delta ) % 60000) / 1000).toFixed(0);
        minutes = Math.floor(delta / 60000);
        timerInfo.innerText = `Timer: ${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
        if(started === false){
            clearInterval(intervalId);
            timerInfo.innerText = "Timer: 0"
        }
        calcWordsPerMinute(minutes, seconds);
    }, 500)
}

function endTest() {
    started = false;
    letterIndex = 0;
    errors = 0;
    error = false;
    wordsPerMinuteInfo.innerText = "WPM: 0"
    errorInfo.innerText = "Errors: 0"
    generateNewTest();
}

function calcWordsPerMinute(minutes,seconds){
    const wordsTyped =  document.querySelector(".typed").innerText.split(" ").length;
    wordsPerMinuteInfo.innerText = "WPM: " + (60 / (minutes > 0 ? minutes * 60 + parseInt(seconds) : parseInt(seconds)) * wordsTyped).toFixed(2);
    
}

gererateTextButton.addEventListener("click", ()=>{
    endTest();
})

// removes focus it caused buttons to be activated by space bar 
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click",(e)=>{
        e.target.blur();
    })
}


(()=>{
    const toggle = document.querySelector(".toggle-mode-btn")
    let darkMode = false;
    toggle.addEventListener("click",()=>{
    if(darkMode){
        paragraphElm.classList.remove("dark")
        toggle.innerText = "DARK"
        darkMode = false;

    } else {
        paragraphElm.classList.add("dark");
        toggle.innerText = "LIGHT"
        darkMode = true;
    }    
    })
})()


function animateTyping(event){
    let char = String.fromCharCode(event.keyCode).toLowerCase();
    const key = document.querySelector(`.key-code-${char.charCodeAt(0)}`)
    key.classList.add("pressed")
    setTimeout(()=>{
        key.classList.remove("pressed")
    },200)
}