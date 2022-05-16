from flask import Flask, render_template, jsonify, request, make_response
import sys, json, os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/api/quotes", methods=['GET'])
def quoteList():
    print("getting quotes on api")
  
    root_path = os.path.realpath(os.path.dirname(__file__))
    file_path = os.path.join(root_path,"data","quotes.json")
  
    with open(file_path,'r') as file:
      file_contents = json.load(file)
      response = make_response(
        file_contents,
        200
      )
      return response;

    return "Error reading file"
    


@app.route("/api/quotes", methods=['PUT'])
def save():
    print('saving quotes on api')

    json_data = request.json
  
    root_path = os.path.realpath(os.path.dirname(__file__))
    file_path = os.path.join(root_path,"data","quotes.json")
  
    with open(file_path,'w') as file:
      json.dump(json_data,file);
      return make_response("Complete",200)

    return "Error reading file",500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)