from flask import render_template, Flask,url_for,session
from flask_socketio import SocketIO,emit
app = Flask(__name__)
socketio = SocketIO(app, manage_session=True)
app.config['SECRET_KEY']="hjehhhrbhjrbhnjvvjhnbrvbv"
app.config['PERMANENT_SESSION_LIFETIME'] = 2678400  # 31 days in seconds

@app.before_request
def make_session_permanent():
    session.permanent = True

#app routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/local')
def local():
    if 'local_game' not in session:
        print("initialising data")
        session['local_game'] = {
            'started': 0,
            'turn_no': 1,
            'win_pos': [0, 0, 0, 0],
            'ply_pos': [0, 0, 0, 0],
            'is_playing': [1, 1, 0, 0],
            'ply_name': ["", "", "", ""],
            'ply_turn':1
        }
    else:
        print("game exists")
    print(session['local_game'])
    return render_template('local.html')

#socket routes
@socketio.on("connect")
def connect():
    emit("connected" , { "message" : "connected to server(server side confirmation)"})
    
@socketio.on("connected")
def connected(data):
    print(data['message'])

@socketio.on('request_local')
def handle_request_local(data):
    print('data sent')
    emit('local_game_state',session['local_game'])

@socketio.on('send_local')
def handle_send_local(data):
    print(session['local_game'])
    session['local_game']=data['game_state']
    session.modified = True
    print(session['local_game'])
    print(data)
    emit("confirmation")

if __name__ == '__main__':
    socketio.run(app, debug=True)