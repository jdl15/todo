import React, { useState, useEffect, useCallback } from 'react';
import TodoList from './component/todolist';
import Login from './component/login';
import Register from './component/register';
import './style.css';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // track user authentication
  const [showLogin, setShowLogin] = useState(true); // show login form

  const fetchTodos = useCallback(async (token) => {
    try{
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if(response.status === 401 || response.status === 400){
        handleLogout();
        throw new Error('Please login again');
      }
      if(!response.ok){
        throw new Error('Error fetching');
      }
      const data = await response.json();
      console.log('fetched tasks:', data);
      setTodos(data);
    } catch (error){
      console.error('Error fetching: ', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token'); // get token from local storage
    if (token) {
      setIsAuthenticated(true);
      fetchTodos(token); // fetch tasks after login
    }
  }, [fetchTodos]);

  const addTodo = async(text) => {
    const token = localStorage.getItem('token');
    try{
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ taskDescription: text }),
    });
    const newTodo = await response.json();
    if(response.ok){
      setTodos([...todos, newTodo]);
      fetchTodos(token);
    } else{
      console.error('Error adding: ', newTodo.message);
    }} catch (error){
      console.error('Error adding: ', error);
    }
  };

  const toggleTodo = async (id, currentCompletion) => {
    const token = localStorage.getItem('token');
    try{
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ completion: !currentCompletion }),
    });
    const updatedTodo = await response.json();
    if(response.ok){
      setTodos((todos) => todos.map(todo => (
        todo._id === id ? updatedTodo : todo)));
    } else{
      console.error('Error updating: ', updatedTodo.message);
    }} catch (error){
      console.error('Error updating: ', error);
    }
  };

  const editTodo = async (taskId, newText) => {
    const token = localStorage.getItem('token');
    try{
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskDescription: newText }),
    });
    // const updatedTodo = await response.json();
    if(response.ok){
      const updatedTodo = await response.json();
      setTodos((todos) => todos.map((task) => (
        task._id === taskId ? updatedTodo : task)));
    } else{
      const updatedTodo = await response.json();
      console.error('Error updating: ', updatedTodo.message);
    }} catch (error){
      console.error('Error updating: ', error);
    }
  };

  const deleteTodo = async (taskId) => {
    const token = localStorage.getItem('token');
    try{
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    if(response.ok){
      setTodos(todos.filter(todo => todo._id !== taskId));
    } else{
      console.error('Error deleting: ', response.message);
    }}
    catch (error){
      console.error('Error deleting: ', error);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token); // save token to local storage
    setIsAuthenticated(true);
    fetchTodos(token); // fetch tasks after login
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove token from local storage
    setIsAuthenticated(false);
    setShowLogin(true);
  }

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      {!isAuthenticated ? (
        <div>
          {showLogin ? (
            <Login onLogin = {handleLogin} toggle = {() => setShowLogin(false)} />) : 
            (<Register onRegister={() => setIsAuthenticated(true)} toggle = {() => setShowLogin(true)} />)}
        </div>) : (
            <TodoList
              todos={todos}
              addTodo={addTodo}
              toggleTodo={toggleTodo}
              editTodo={editTodo}
              deleteTodo={deleteTodo}
            />
        )}
        </div>
        );
};

export default Todo;
