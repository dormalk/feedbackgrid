const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
function simulateMouseClick(element){
  mouseClickEvents.forEach(mouseEventType => {
    if(!element) return;
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
      })
    )}
  );
}   

function simulateChangeInput(input, value){
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  nativeInputValueSetter.call(input, value);
  var inputEvent = new Event('input', { bubbles: true});
  input.dispatchEvent(inputEvent);
}

function simulateCreateNewFeedback(){
  return new Promise((resolve,reject) => {
    const btnIndex = Math.floor(Math.random() * 4);
    simulateMouseClick(document.querySelectorAll('.new-btn')[btnIndex]);
    setTimeout(() => {
      simulateChangeInput(document.querySelectorAll('.c-input')[btnIndex],'Test')
      setTimeout(() => {
        simulateMouseClick(document.querySelector('.send-btn'));
        setTimeout(() => {
        const inputWrapper =  document.querySelector('.input-wrapper.open');
        if(inputWrapper) inputWrapper.classList.remove('open');
          const sendBtn = document.querySelector('.send-btn')
          if(sendBtn){
              sendBtn.classList.remove('send-btn');
              sendBtn.classList.add('new-btn');
              sendBtn.src = '/assets/icons/plus.png'
          }
          resolve();
        },1500)
      }, 1500);
    },2000)
  })
}


function simulateRemoveFeedback(){
  return new Promise((resolve,reject) => {
    const closeBtns = document.querySelectorAll('.card-remove')
    if(closeBtns.length === 0) resolve();
    const btnIndex = Math.floor(Math.random() * closeBtns.length);
    setTimeout(() => {
      simulateMouseClick(closeBtns[btnIndex]);
      resolve();
    },1000)
  })
}

function simulateClickReaction(){
  return new Promise((resolve,reject) => {
    const closeBtns = document.querySelectorAll('.reaction')
    if(closeBtns.length === 0) resolve();
    const btnIndex = Math.floor(Math.random() * closeBtns.length);
    setTimeout(() => {
      simulateMouseClick(closeBtns[btnIndex]);
      resolve();
    },1000)
  })
}


let breakSimulate = false;
async function runSimulator(){
  breakSimulate = false;
  while(!breakSimulate){
    const opIndex = Math.floor(Math.random() * 4);
    switch(opIndex){
        case 0:
            await simulateCreateNewFeedback();
            break;
        case 1:
            await simulateRemoveFeedback();
        break;
        case 2:
            await simulateClickReaction();
            break;
        default:
            await simulateClickReaction();
    }
  }
}

function stopSimulator(){
  breakSimulate = true;
}


window.addEventListener('play-simulator', () => {
  runSimulator();
})

window.addEventListener('stop-simulator', () => {
  stopSimulator();
})