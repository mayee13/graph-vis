from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route('/data', methods=['GET'])
def get_data():
    sample_data = {"nodes": [{"id": "A"}, {"id": "B"}], "links": [{"source": "A", "target": "B"}]}
    return jsonify(sample_data)

if __name__ == '__main__':
    app.run(debug=True)
