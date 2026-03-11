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
    
    def test_updating_noneistent_todo(self):
        fake_id = 9999999
        
        res = self.app.patch(
            f"todos/{fake_id}", json= {'status': "In Progress"})
        data = res.get_json()
        
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["error"], "Item does not exist")
    
    def test_expects_todo_strings_not_numbers(self):
        res = self.app.post(
            '/todos',
            json = {"description": 42})
        data = res.get_json()
        
        self.assertEqual(data["error"], "You cannot create todos with numbers")
        self.assertEqual(res.status_code, 400)
    
if __name__ == "__main__":
    unittest.main()
