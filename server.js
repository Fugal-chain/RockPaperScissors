const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { log } = console;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let waiting = null;

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public/Assignment.html'))
})

io.on('connection', (socket) => {
    log('Player connected:', socket.id);

    if (waiting) {
        socket.opponent = waiting;
        waiting.opponent = socket;

        socket.emit('startGame', 'You are player 2');
        waiting.emit('startGame', 'you are player 1');

        waiting = null;
    } else {
        waiting = socket;
        socket.emit('waiting', 'waiting for the other player to join')
    }

    socket.on('move', (choice) => {
        if(!socket.opponent){
            return;
        } 

        if(socket.choice){
            return;
        }
        socket.choice = choice;

        if(socket.opponent && socket.opponent.choice){
            const result = findWinner(socket.choice, socket.opponent.choice);

            socket.emit('result',{
                yourChoice: socket.choice,
                opponentChoice: socket.opponent.choice,
                result: result.you
            });

            socket.opponent.emit('result',{
                yourChoice: socket.opponent.choice,
                opponentChoice: socket.choice,
                result: result.opponent
            });

            socket.choice = null;
            socket.opponent.choice = null;
        }
    });

    socket.on('disconnect', () => {
        if(waiting == socket){
            waiting = null;
        }

        if(socket.opponent){
            socket.opponent.emit('opponentLeft');
        }
    })
});

function findWinner(choice1, choice2) {
    if (choice1 == choice2) {
        return { you: 'Draw', opponent: 'Draw' };
    }

    const gameRules = {
        rock: ['scissors', 'lizard'],
        paper: ["rock", "spock"],
        scissors: ["paper", "lizard"],
        lizard: ["spock", "paper"],
        spock: ["scissors", "rock"]
    }

    if(gameRules[choice1].includes(choice2)){
        return {you: 'You win', opponent: 'You lose'};
    }else{
        return {you: 'You loss', opponent: 'You win'};
    }
}

server.listen(3020, (err) => {
    if(err){
        log('Error starting the server!');
    }else{
        log('server running in the port 3020')
    }
});