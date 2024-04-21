from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

API_KEY = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=API_KEY)

@app.route("/", methods=["POST"])
def hello_world():
    data = request.get_json()
    if data is None or 'message' not in data:
        return jsonify({'msg':"No message provided"}), 400, {'ContentType':'application/json'}

    print(data)
    message = data['message']

    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You are a helpful assistant and should answer questions concisely. Do not be verbose. Optimize your answers to be listened to spoken"},
        {"role": "user", "content": message}
      ]
    )

    response = jsonify({'msg': completion.choices[0].message.content})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response, 200, {'ContentType':'application/json'}
