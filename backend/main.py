from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import random 
import time 

from utils import bfs, parse_grid_string

app = Flask(__name__, static_folder='../frontend') 
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/ping', methods = ['GET'])
def route_ping():
    return jsonify({
        'status_code': 200,
        'message': 'API works.'
    })

@app.route('/api/random', methods=['GET'])
def route_random():
    time.sleep(1)
    grid_string = request.args.get('grid', default='none')
    grid = parse_grid_string(grid_string)
    coords = [[i, j] for i in range(len(grid)) for j in range(len(grid[0])) if grid[i][j] == "W"]
    rand_coord = random.choice(coords)

    return jsonify({
        'pair': rand_coord,
    })

@app.route('/api/endgame', methods = ['GET'])
def route_endgame():
    pass 

@app.route('/api/minimax', methods = ['GET'])
def route_minimax():
    pass 

@app.route('/api/mcts', methods = ['GET'])
def route_mcts():
    pass 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)  