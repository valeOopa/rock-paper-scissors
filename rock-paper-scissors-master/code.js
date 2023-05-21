"use strict";

const options = document.querySelectorAll('.options');
const gameContainer = document.getElementById("game");

const picked = document.getElementById("game__picked");
const resultContainer = document.getElementById('game__result-container');
const randomPickedContainer = document.getElementById("game__random-picked");
const scoreHTML = document.getElementById('score-number');
const resultMobile = document.createElement("SECTION");
if(localStorage.getItem('score') == NaN || localStorage.getItem('score') == null) localStorage.setItem('score',0)
else scoreHTML.innerHTML = localStorage.getItem('score');

let selectedOption;

let newWidth

function handleResolutionChange() {
    newWidth = window.innerWidth;
    if(newWidth <= 660){
        resultMobile.id = 'section-result-mobile';
        document.getElementById("article").appendChild(resultMobile);
        try{
            gameContainer.removeChild(resultContainer);
        }catch{

        }
        let verification = resultMobile.querySelector('#game__result-container');
        if(!(verification)) resultMobile.appendChild(resultContainer);
        picked.classList.add('rz');
        randomPickedContainer.classList.add('rz');
    }
  };
  
// Asignar el evento resize al objeto window
window.addEventListener('load',()=>{
    window.addEventListener("resize", handleResolutionChange);
    handleResolutionChange();
});

const verifyWin = (opSelected,e) => {
    
    const resultText = document.getElementById('result-text');

    const options = [{
        name: 'papel',
        HTML: document.querySelector('.papel-border')
    },{
        name: 'tijera',
        HTML: document.querySelector('.tijera-border')
    },{
        name: 'piedra',
        HTML: document.querySelector('.piedra-border')
    }];
    const optionRandom = options[Math.floor(Math.random()*3)];
    optionRandom.HTML.classList.remove('disappear-animation-class');
    const editScore = scoreResult  => {
        let score = localStorage.getItem('score');
        score = parseInt(score);
        
        if(score === 0 && scoreResult === -1) scoreResult = 0;
        let scoreNumber = score + scoreResult;
        localStorage.setItem('score',scoreNumber);
        setTimeout(()=>scoreHTML.textContent = scoreNumber,1500);
    }
    const addResult = result => {
        const addAnimation = (element,animation) =>{
        element.style.animationName = animation;
        element.style.animationDuration = '1.5s';
        element.style.animationDelay = '1s';
        element.style.animationFillMode = 'forwards';
        }
        setTimeout(()=>{
            document.getElementById("random-border-option").remove();
            randomPickedContainer.innerHTML += optionRandom.HTML.outerHTML;
            document.getElementById('move-top').style.top = '0px'
        },1500);
        resultContainer.style.display = 'flex';

        if(newWidth > 660) {
            resultText.textContent = result;
            
        }else resultMobile.children[0].children[0].textContent = result;
        
        setTimeout(()=>{
            if(newWidth > 660){
                
                addAnimation(picked,'movePickedOption');
                addAnimation(randomPickedContainer,'moveRandomOption');
            }
            
        },1000)
    }
    if(opSelected === optionRandom.name) {
        addResult("TIE");
        resultContainer.children[1].classList.add('brightnessTie-class');
        picked.classList.add('l');
        randomPickedContainer.classList.add('r');

    }else if ((opSelected === "papel" && optionRandom.name === "piedra")||
              (opSelected === "tijera" && optionRandom.name === "papel")||
              (opSelected === "piedra" && optionRandom.name === "tijera")){
        addResult("YOU WIN");
        editScore(1);
        e.classList.add('brightnessWin-class');
    }else {
        addResult("YOU LOSE");
        editScore(-1);
        setTimeout(()=>{
            randomPickedContainer.children[1].classList.add('brightnessLose-class');
            console.log(randomPickedContainer.children[1]);
            randomPickedContainer.children[1].style.zIndex = '-1';
            picked.style.zIndex = '15';
        },1500);
        
    };
}

const startGame = (opSelected) => {
    document.getElementById("game-selection").style.display = "none";
    gameContainer.style.display = 'flex';
    gameContainer.classList.add('appear-animation');
    
    const result = document.getElementById("game__result-container");
    //ctrl+k ctrl+shift+k

    opSelected.classList.remove('disappear-animation-class-selected');
    picked.appendChild(opSelected);
    opSelected.style.display = 'inline-block';
    verifyWin(opSelected.children[0].id,opSelected);
};


const disappear = opSelected => {
    //*Contenedor de las opciones(y el triangulo)
    const disappearElements =  document.querySelectorAll('.disappear-elements');
    const gameSelection = document.getElementById("game-selection");
    for(let i = 0;i < disappearElements.length; i++){
        if(opSelected.id === disappearElements[i].children[0].id) opSelected.parentNode.classList.add('disappear-animation-class-selected');
        else {
            disappearElements[i].classList.add('disappear-animation-class');
        };
    };
    setTimeout(()=>{
        gameSelection.style.display = 'none';
        startGame(opSelected.parentNode);
    },1800);
};

//*Se evalua la opción seleccionada
for(let option of options){
    option.addEventListener("click",()=>{
        if(selectedOption == null) {
            selectedOption = option;
            //*Ejecutamos la funcion que hace desaparecer los botones
            disappear(selectedOption);
        };
    });
};


document.getElementById('btn-play').addEventListener("click",()=>location.reload());

const btnRules = document.getElementById('footer__rules-btn');
//* Desktop rules
const rulesDesktop = document.getElementById('rules-desktop');
const darkBackground = document.getElementById('dark-background');

//* Mobile rules
const rulesMobile = document.getElementById('rules-mobile');

document.getElementById("close-desktop").addEventListener("click",()=>{
    rulesDesktop.classList.add('closeRules-class');
    rulesDesktop.classList.remove('openRules-class');
    darkBackground.classList.remove('showDarkBackground');
    darkBackground.style.display = 'none';
    setTimeout(()=>rulesDesktop.style.display = 'none',400);
});

document.getElementById("close-mobile").addEventListener("click",()=>rulesMobile.style.display = 'none');

btnRules.addEventListener("click",()=>{
    if(newWidth > 660){
        if(rulesDesktop.classList.contains('closeRules-class')) rulesDesktop.classList.remove('closeRules-class');
        rulesDesktop.style.display = 'block';
        rulesDesktop.classList.add('showRules-class');
        darkBackground.style.display = 'block';
        darkBackground.classList.add('showDarkBackground');
    }else rulesMobile.style.display = 'flex';
});

//!To optimize the code, you would have to use promises
//!Para optimizar el código, tendría que usar promesas