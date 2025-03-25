from flask import Flask, jsonify
from flask_cors import CORS  # Add this import
import aws_lambda_wsgi

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Python API!'})

def handler(event, context):
    return aws_lambda_wsgi.response(app, event, context)