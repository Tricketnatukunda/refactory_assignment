
Create an application that allows us to track the stuff that we need to do


GET /todos/
POST /todos/
PATCH /todos/:id
DELETE /todo/:id

[
    { 'description': 'go to the market', status: 'planned'},
    { 'description': 'go to the garage', status: 'completed'},
    { 'description': 'learn tdd', status: 'inprogress'}
]


# What todo
1. Create a new folder todo list
1. Create a virtual environment `python -m venv .venv` or `python3 -m venv .venv`
1. Checkout [flask](https://flask.palletsprojects.com/en/stable/)
1. Create src
    1. create_app.py
    1. create todo.py
1. Create tests
    1. __init__.py
    1. test_todo.py
1. Create app.py
1. Create folders `mkdir src tests`
