import aws_lambda_wsgi
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import random 
import time 
import math 

from utils import parse_grid_string, check_endgame
from minimax import minimax_alg 
from mcts import MCTS

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
    coord = None 

    if alg_type == 'random':
        coords = [[i, j] for i in range(len(grid)) for j in range(len(grid[0])) if grid[i][j] == "W"]
        coord = random.choice(coords)
        time.sleep(1)
    elif alg_type == 'minimax':
        px, py, _ = minimax_alg(grid, 2, True, -math.inf, math.inf)
        coord = [px, py]
    elif alg_type == 'mcts':
        m = MCTS(grid)
        px, py = m.run()
        coord = [px, py]
    else:
        return jsonify({
            'status_code': 400,
            'message': f'{alg_type} is not a supported algorithm. Possible options: random, minimax, mcts'
        })
    
    return jsonify({
        'status_code': 200,
        'pair': coord
    })

def handler(event, context):
    return aws_lambda_wsgi.response(app, event, context)