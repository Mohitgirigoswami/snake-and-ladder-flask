game_state = {
            'started': 0,
            'turn_no': 1,
            'win_pos': [0, 0, 0, 0],
            'ply_pos': [0, 0, 0, 0],
            'is_playing': [1, 1, 0, 0],
            'ply_name': ["", "", "", ""],
            'ply_turn':1
        }

socket.emit('request_local', { 'message': 'requested current position local' });

socket.on('local_game_state', (data) => {
    console.log('local game state recived');
    game_state= data;
    update_game_state();
})

socket.on("confirmation", (data) => {
    console.log("confirmed server side");
})

function raise_error(error) {
    document.getElementById('error').style.display = "block";
    document.getElementById('error').innerHTML = error;
    setTimeout(function () {
        document.getElementById('error').style.display = "none";
    }, 20000);
}

function start_local() {
    console.log('start local');
    document.getElementById('start_game_local').disabled = true;
    document.getElementById('restart_game_local').disabled = false;
    document.getElementById('start_game_local').style.display = "none";
    document.getElementById('restart_game_local').style.display = "block";
    socket.emit('start_local', { 'message': 'start local' });
}

function restart_local() {
    console.log('restart local');
    document.getElementById('start_game_local').disabled = false;
    document.getElementById('start_game_local').style.display = "block";
    document.getElementById('restart_game_local').style.display = "none";
    document.getElementById('restart_game_local').disabled = true;
    socket.emit('restart_local', { 'message': 'restart local' });
}

function add_player() {
    for (i = 3; i <= 4; i++) {
        if (game_state['is_playing'][i - 1] == 0) {
            game_state['is_playing'][i - 1] = 1;
            socket.emit('send_local', { 'message': 'add player', 'game_state': game_state });
            document.getElementById('ply_lcl_' + i).style.display = "block";
            break;
        }
        if (i == 4) {
            raise_error('No more players can be added');
        }
    }
    console.log(game_state['is_playing']);
}
function remove_player() {
    for (i = 4; i >= 3; i--) {
        if (game_state['is_playing'][i - 1] == 1) {
            game_state['is_playing'][i - 1] = 0;
            socket.emit('send_local', { 'message': 'remove player', 'game_state': game_state });
            document.getElementById('ply_lcl_' + i).style.display = "none";
            break;
        }
        if (i == 3) {
            raise_error('No more players can be removed');
        }
    }
    console.log(game_state['is_playing']);
}

function update_game_state() {
    // Update player UI based on game_state
    for (let i = 1; i <= 4; i++) {
        const playerDiv = document.getElementById('ply_lcl_' + i);
        if (playerDiv) {
            if (game_state['is_playing'][i - 1]) {
                playerDiv.style.display = "block";
                playerDiv.classList.remove('inactive');
            } else {
                playerDiv.style.display = "none";
                playerDiv.classList.add('inactive');
            }
            // Update player name if available
            const nameSpan = document.getElementById('ply_name_' + i);
            if (nameSpan && game_state['ply_name'][i - 1]) {
                nameSpan.textContent = game_state['ply_name'][i - 1];
            }
            // Highlight current turn
            if (game_state['ply_turn'] === i) {
                playerDiv.classList.add('current-turn');
            } else {
                playerDiv.classList.remove('current-turn');
            }
        }
    }

    // Update start/restart buttons
    document.getElementById('start_game_local').disabled = game_state['started'];
    document.getElementById('restart_game_local').disabled = !game_state['started'];
    document.getElementById('start_game_local').style.display = game_state['started'] ? "none" : "block";
    document.getElementById('restart_game_local').style.display = game_state['started'] ? "block" : "none";
}