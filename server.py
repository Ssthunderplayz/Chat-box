import socketio
import eventlet
import numpy as np

from socketio.asyncio import AsyncServer

sio = AsyncServer()

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

@sio.event
def join_room(sid, room):
    sio.enter_room(sid, room)
    print(f'User {sid} joined room {room}')

@sio.event
def leave_room(sid, room):
    sio.leave_room(sid, room)
    print(f'User {sid} left room {room}')

@sio.event
def send_message(sid, data):
    print(f'Received message from {sid}: {data}')
    sio.emit('receive_message', data, room=data['room'])

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 4000)), app)
