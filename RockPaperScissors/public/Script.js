let chosen = false;
const socket = io();
const rock = document.getElementById('rock1');
const paper = document.getElementById('paper1');
const scissors = document.getElementById('Scissor1');
const spock = document.getElementById('spock1');
const lizard = document.getElementById('Lizard1');

rock.addEventListener("click", function(){
    sendMoveToServer('rock');
    rock.style.backgroundColor = 'green';
})
paper.addEventListener("click", function(){
    sendMoveToServer('paper');
    paper.style.backgroundColor = 'green';
})
scissors.addEventListener("click", function(){
    sendMoveToServer('scissors');
    scissors.style.backgroundColor = 'green';
})
spock.addEventListener("click", function(){
    sendMoveToServer('spock');
    spock.style.backgroundColor = 'green';
})
lizard.addEventListener("click", function(){
    sendMoveToServer('lizard');
    lizard.style.backgroundColor = 'green';
})

function sendMoveToServer(choice){
    if(chosen){
        alert('your turn is over');
        return;
    }
    chosen = true;
    socket.emit('move',choice);
}

function removeColor(){
    rock.style.backgroundColor = 'white';
    paper.style.backgroundColor = 'white';
    scissors.style.backgroundColor = 'white';
    spock.style.backgroundColor = 'white';
    lizard.style.backgroundColor = 'white';
}

socket.on('result', (data) => {
    console.log('Server data')
    document.getElementById('winner').textContent = `You chose: ${data.yourChoice}, opponent chose: ${data.opponentChoice} ${data.result}`;
    chosen = false;
    // setTimeout(() => {
    //     document.getElementById('winner').textContent = '';
    //     removeColor();
    // },3000);
});

socket.on('waiting', (msg) => {
    document.getElementById('winner').textContent = `${msg}`;
});

socket.on('disconnect', (msg) => {
    document.getElementById('winner').textContent = `${msg}`;
});

socket.on('startGame', (msg) => {
    document.getElementById('winner').textContent = `${msg}`;
});