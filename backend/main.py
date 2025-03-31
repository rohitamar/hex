import random
import time
import math
import os 
from pathlib import Path
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import FileResponse       
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from websocket import router as websocket_router 

from utils import parse_grid_string, check_endgame
from minimax import minimax_alg
from mcts import MCTS

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "frontend/pages")) 

app = FastAPI()
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "frontend/static")), name="static")

origins = [
    "*"  # might need to change this for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get('/api/ping')
async def route_ping():
    return {
        'status_code': 200,
        'message': 'API works.'
    }

@app.get('/api/endgame')
async def route_endgame(
    grid_string: str | None = Query(default='none', alias='grid') 
):
    if grid_string is None:
        raise HTTPException(status_code=400, detail="Query parameter 'grid' is required.")
        
    grid = parse_grid_string(grid_string)
    end_state = check_endgame(grid)
    return {
        'status_code': 200,
        'end_state': end_state
    }

@app.get('/api/makeMove')
async def route_algo(
    grid_string: str | None = Query(default=None), 
    alg_type: str | None = Query(default=None)    
):
    if grid_string is None:
        raise HTTPException(status_code=400, detail="Missing required query parameter: grid")
    
    if alg_type is None:
        raise HTTPException(status_code=400, detail="Missing required query parameter: alg")

    grid = parse_grid_string(grid_string)
    coord = None

    if alg_type == 'random':
        coords = [[i, j] for i in range(len(grid)) for j in range(len(grid[0])) if grid[i][j] == "W"]
        if not coords: 
            raise HTTPException(status_code=400, detail="No valid 'W' moves available for random choice.")
        coord = random.choice(coords)
        time.sleep(1)
    elif alg_type == 'minimax':
        # Assuming minimax_alg is synchronous. If it's CPU-bound and long,
        # consider running it in a thread pool executor with run_in_executor
        px, py, _ = minimax_alg(grid, 2, True, -math.inf, math.inf)
        coord = [px, py]
    elif alg_type == 'mcts':
        # Same consideration for MCTS if it's CPU-bound
        m = MCTS(grid)
        px, py = m.run()
        coord = [px, py]
    else:
        raise HTTPException(
            status_code=400,
            detail=f'{alg_type} is not a supported algorithm. Possible options: random, minimax, mcts'
        )

    return {
        'status_code': 200,
        'pair': coord
    }

@app.get('/', response_class=FileResponse, include_in_schema=False)
async def serve_index():
    index_path = os.path.join(STATIC_DIR, 'pages', 'start.html')
    print(index_path)
    print(STATIC_DIR)
    if not os.path.exists(index_path):
        raise HTTPException(status_code=404, detail="start.html not found")
    return FileResponse(index_path)

@app.get("/game/{room_id}/")
def serve_game_page(request: Request, room_id: str):
    return templates.TemplateResponse("index.html", { 
        "request": request,
        "room_id": room_id
    })

@app.get('/{path:path}', response_class=FileResponse, include_in_schema=False)
async def serve_static(path: str):
    file_path = os.path.join(STATIC_DIR, path)

    if ".." in path or path.startswith("/"):
        raise HTTPException(status_code=404, detail="File not found")

    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        if path == 'index.html' and os.path.exists(os.path.join(STATIC_DIR, 'index.html')):
            return FileResponse(os.path.join(STATIC_DIR, 'index.html'))
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)

app.include_router(websocket_router)