import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import socketIOClient from "socket.io-client";
import "./App.css";

const API_URL = "http://localhost:5000"; 
const SOCKET_URL = "http://localhost:5001";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const socket = socketIOClient(SOCKET_URL);

  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then((response) => {
      setTasks(response.data);
    });

    socket.on("addTask", (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    socket.on("updateTask", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    });

    socket.on("deleteTask", (deletedTaskId) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deletedTaskId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddTask = (newTask) => {
    axios.post(`${API_URL}/tasks`, newTask).then((response) => {
      socket.emit("addTask", response.data);
    });
  };

  const handleTaskStatusChange = (taskId, completed) => {

    axios
      .patch(`${API_URL}/tasks/${taskId}`, { completed })
      .then((response) => {
        socket.emit("updateTask", response.data);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`${API_URL}/tasks/${taskId}`).then(() => {
      socket.emit("deleteTask", taskId);
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  };

  return (
    <div>
      <h1>Task Management System</h1>
      <TaskForm addTask={handleAddTask} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              <TaskList
                tasks={tasks}
                onTaskStatusChange={handleTaskStatusChange}
                onDeleteTask={handleDeleteTask}
              />
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
