from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import random 
import ast 

app = Flask(__name__, static_folder='../frontend') 
CORS(app)

def parse_grid_string(grid_string):
    grid_string = grid_string.replace('W', '"W"').replace('B', '"B"').replace('R', '"R"')
    return ast.literal_eval(grid_string)

@app.route('/')
def serve_index():
    print('??')
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/random', methods=['GET'])
def random_play():
    grid_string = request.args.get('grid', default='none')
    grid = parse_grid_string(grid_string)
    coords = [[i, j] for i in range(len(grid)) for j in range(len(grid[0])) if grid[i][j] == "W"]
    rand_coord = random.choice(coords)

    return jsonify({
        'pair': rand_coord,
        'endgame': True
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Debug mode for local dev