from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import random 
import ast 
import aws_lambda_wsgi

app = Flask(__name__) 
CORS(app)

def parse_grid_string(grid_string):
    grid_string = grid_string.replace('W', '"W"').replace('B', '"B"').replace('R', '"R"')
    return ast.literal_eval(grid_string)

@app.route('/api/ping', methods = ['GET'])
def ping():
    return jsonify({
        'status_code': 200,
        'message': 'API works.'
    })

@app.route('/api/random', methods=['GET'])
def random_play():
    grid_string = request.args.get('grid', default='none')
    grid = parse_grid_string(grid_string)
    coords = [[i, j] for i in range(len(grid)) for j in range(len(grid[0])) if grid[i][j] == "W"]
    rand_coord = random.choice(coords)

    return jsonify({
        'pair': rand_coord,
        'endgame': True
    })

def handler(event, context):
    return aws_lambda_wsgi.response(app, event, context)