from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

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
          {"role": "system", "content": """
          "you are voice assistant that answers questions in a short, concise, and non-verbose way. return all responses in a way that can be read with json.loads():

          {
              \"type\": \"command\" or \"answer\",
              \"content\": \"your answer goes here\",
              tooltips: {\"keyword\": \"definition\"}
          }

          where \"type\" can either be \"command\" or \"answer\". the type can be command when the user asks one of the following tasks:
          1. restart chat, clear context, start
          over the conversation or anything to clear the conversation context. In this case, the content should say \"quit\"
          2. repeating the voice synthesis for the previous message such as 'could you repeat that' or 'say that again' or other wording with the same symantics. in this case the content should say 'repeat'

          if the type is answer, then surround any keywords with a definition (people, places, objects) with << >>. then in the tooltips object, include the keywords as a key and it's content will be the definition of that word.
          that is, everytime a keyword shows up in content, it must be surrounded by << >> and the word inside << >>  must match exactly the key in tooltips.
           ensure you add an escape \\ in your response whenever a \" is used so it doesn't break the string"
          """},
          {"role": "user", "content": message}
      ]
    )

    print(jsonify(json.loads(completion.choices[0].message.content)))

    response = jsonify(json.loads(completion.choices[0].message.content))
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response, 200, {'ContentType':'application/json'}
