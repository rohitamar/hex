import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from ConnectionManager import ConnectionManager
import json 

from utils import parse_grid_string, check_endgame

manager = ConnectionManager()

router = APIRouter()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    try:
        await manager.connect(websocket, room_id)
    except WebSocketDisconnect as e:
        return 
    
    if manager.len_room(room_id) == 1:
        print('Waiting for the other player')
        await websocket.send_text(json.dumps({'message': 'wait'}))
        while manager.len_room(room_id) < 2:
            await asyncio.sleep(0.01)
    
    for socket, color in manager.active[room_id]:
        if color == 'red':
            await socket.send_text(json.dumps({'message': '1'}))
        elif color == 'blue':
            await socket.send_text(json.dumps({'message': '2'}))
    
    while True:
        try:
            data = await websocket.receive_json() 
            grid = parse_grid_string(data['grid'])
            result = check_endgame(grid)
            if result == 0:
                for socket, color in manager.active[room_id]:
                    if socket == websocket: 
                        continue 
                    await socket.send_text(json.dumps(data))
            else:
                for socket, _ in manager.active[room_id]:
                    await socket.send_text(json.dumps({
                        'message': f'{result} won.'
                    }))
                    await socket.close() 
                break 
        except Exception as e:
            break 
    