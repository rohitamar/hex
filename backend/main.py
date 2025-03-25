from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import random 

app = Flask(__name__, static_folder='../frontend')  # Point to frontend folder directly
CORS(app)

@app.route('/')
def serve_index():
    print('??')
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/random', methods=['GET'])
def hello():
    return jsonify({
        'pair': [random.randint(0, 11), random.randint(0, 11)]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Debug mode for local dev