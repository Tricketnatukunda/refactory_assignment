from flask import Flask, jsonify, request
import time

def create_app():
    app = Flask(__name__)
    todos = []

    @app.get("/todos")
    def get_todos():
        '''
            Return the list of todos
        '''
        return jsonify(todos)
    
    
    @app.post("/todos")
    def add_todo():
        body = request.get_json()
        
        if not isinstance(body['description'], str):
            return jsonify({'error': "You cannot create todos with numbers"}), 400
        
        new_item = {
            "id": int(time.time()*100),
            "description": body['description'],
            "status": "Planned"
        }
        todos.append(new_item)
        return jsonify (new_item), 201

    @app.patch("/todos/<id>")
    def update_todo(id):
        body = request.get_json()
        id = int(id)
        for item in todos:
            if item['id'] == id:
                item['status'] = body['status']
                return jsonify(item)
        
        return jsonify({"error": "Item does not exist"}), 404        
    
    return app
