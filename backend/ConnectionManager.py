from fastapi import WebSocket 
from typing import Dict, Tuple

class ConnectionManager:
    def __init__(self):
        self.active = {}
    
    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()

        if room_id not in self.active:
            self.active[room_id] = []
        
        if len(self.active[room_id]) == 0:
            self.active[room_id].append((websocket, 'red'))
        elif len(self.active[room_id]) == 1:
            self.active[room_id].append((websocket, 'blue'))
        else:
            self.active[room_id].append((websocket, 'spec'))
        
    def len_room(self, room_id):
        return len(self.active[room_id])
    