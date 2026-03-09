import unittest
from src.create_app import create_app


class TodoTests(unittest.TestCase):
    
    def setUp(self):
        self.app = create_app().test_client()
        
    
    def test_todos_initial_empty(self):
        res = self.app.get('/todos')
        self.assertEqual(res.get_json(), [])
        self.assertEqual(res.status_code, 200)
        
    
    def test_creating_todo_updates_list(self):
        res = self.app.post(
            '/todos',
            json = { "description": 'Buy chicken'})
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        
        self.assertEqual(data['description'], 'Buy chicken')
        self.assertEqual(data['status'], 'Planned')
        self.assertIsNotNone(data['id'])
   

     
    def test_updating_todos(self):
        res = self.app.post(
            '/todos',
            json = { "description": 'Buy vegetable'})
        data = res.get_json()
        
        todo_id = data['id']
        update_req = self.app.patch(
            f"todos/{todo_id}", json= {'status': "In Progress"})
        data2 = update_req.get_json()
        
        self.assertEqual(data2['id'], todo_id)
        self.assertEqual(data2['status'], 'In Progress')
        self.assertEqual(update_req.status_code, 200)
    
    ## What happens when you patch an item that doesn't exit
    
    
if __name__ == "__main__":
    unittest.main()
