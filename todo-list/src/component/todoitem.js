import React, { useState } from 'react';

const TodoItem = ({ todo, toggleTodo, editTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.taskDescription);

  const handleSaveEdit = () => {
    if(editText.trim()){
      editTodo(todo._id, editText);
      setIsEditing(false);
    } else{
      alert('Task cannot be empty');
    }
  }; 

  return (
    <div className={`todo-item ${todo.completion ? 'completed' : ''}`}>
      {isEditing ? (<input type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}/>
                    ) : (<span className='item-text' onClick={() => toggleTodo(todo._id, todo.completion)}>{todo.taskDescription}</span>)
        }
      <div>
        {isEditing ? (<button className='save' style={{ fontSize: '24px' }} onClick={handleSaveEdit}>Save</button>
                      ) : (!todo.completion && (<button className='edit' onClick={() => setIsEditing(true)}><i className="bi bi-pencil-square" style={{ fontSize: '24px' }}></i></button>))
        }
        <button className='delete' onClick={() => deleteTodo(todo._id)}><i className="bi bi-trash-fill" style={{ fontSize: '24px' }}></i></button>
      </div>
    </div>
  );
};

export default TodoItem;
