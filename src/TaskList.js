import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskList = ({ tasks, onTaskStatusChange, onDeleteTask }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
              </div>
              <div>
                {task.completed ? (
                  <button onClick={() => onTaskStatusChange(task.id, false)}>Incomplete</button>
                ) : (
                  <button onClick={() => onTaskStatusChange(task.id, true)}>Completed</button>
                )}
                <button onClick={() => onDeleteTask(task.id)}>Delete</button>
              </div>
            </li>
          )}
        </Draggable>
      ))}
    </ul>
  );
};

export default TaskList;
