const socket = io()
let name;

let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.msg_area');

do{
 name = prompt('please enter yor name: ');
}while(!name);

textarea.addEventListener('keyup',(e)=>{
if(e.key === 'Enter'){
    sendMessage(e.target.value)
}
})


function sendMessage(message){
    let msg = {
        user : name,
        message : message.trim()
    }
    // append
    appendMessage(msg,'outgoing')
    textarea.value = "";
    scrolltobottom();

    // send server

    socket.emit('message',msg)
}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className,'msg')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `

    mainDiv.innerHTML= markup;
    messageArea.appendChild(mainDiv);
}

socket.on('message', (msg)=>{
    appendMessage(msg,'incoming')
    scrolltobottom();
  })

  function scrolltobottom(){
    messageArea.scrollTop = messageArea.scrollHeight
  }