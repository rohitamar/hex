from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import random 
import time 
import math 

from utils import parse_grid_string, check_endgame
from minimax import minimax_alg 

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

@app.route('/api/endgame', methods = ['GET'])
def route_endgame():
    grid_string = request.args.get('grid', default='none')
    grid = parse_grid_string(grid_string)

    end_state = check_endgame(grid)
    
    return jsonify({
        'status_code': 200,
        'end_state': end_state
    })
     
@app.route('/api/makeMove', methods = ['GET'])
def route_algo():
    grid_string = request.args.get('grid', default=None)
    grid = parse_grid_string(grid_string)

    alg_type = request.args.get('alg', default=None)
    print(alg_type)
    coord = None 

    if alg_type == 'random':
        coords = [[i, j] for i in range(len(grid)) for j in range(len(grid[0])) if grid[i][j] == "W"]
        coord = random.choice(coords)
        time.sleep(1)
    elif alg_type == 'minimax':
        px, py, _ = minimax_alg(grid, 2, True, -math.inf, math.inf)
        coord = [px, py]
    
    return jsonify({
        'status_code': 200,
        'pair': coord
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)