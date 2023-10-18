import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const initialTasks = [];

const taskStatus = {
  requested: {
    name: "Requested",
    items: initialTasks,
  },
  toDo: {
    name: "To do",
    items: [],
  },
  inProgress: {
    name: "In Progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

function App() {
  const [columns, setColumns] = useState(taskStatus);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [editedTaskData, setEditedTaskData] = useState({
    taskId: null,
    content: "",
    description: "",
  });

  const [newTaskDescription, setNewTaskDescription] = useState("");

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const deleteTask = (columnId, taskId) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns(updatedColumns);
  };

  const startEditingTask = (taskId, content, description) => {
    setEditingTask(taskId);
    setEditedTaskData({ taskId, content, description });
  };

  const saveEditedTaskData = (columnId) => {
    const updatedColumns = { ...columns };
    const taskIndex = updatedColumns[columnId].items.findIndex(
      (item) => item.id === editedTaskData.taskId
    );

    if (taskIndex !== -1) {
      updatedColumns[columnId].items[taskIndex].content =
        editedTaskData.content;
      updatedColumns[columnId].items[taskIndex].description =
        editedTaskData.description;
      setColumns(updatedColumns);
      setEditingTask(null);
      setEditedTaskData({ taskId: null, content: "", description: "" });
    }
  };

  const cancelEditingData = () => {
    setEditingTask(null);
    setEditedTaskData({ taskId: null, content: "", description: "" });
  };

  const addNewTask = () => {
    if (newTaskContent.trim() !== "") {
      const updatedColumns = { ...columns };
      const newTask = {
        id: (Math.random() * 100).toString(),
        content: newTaskContent,
        description: newTaskDescription, // Use the description from the state
      };
      updatedColumns.requested.items.push(newTask);
      setColumns(updatedColumns);
      setNewTaskContent("");
      setNewTaskDescription(""); // Clear the description input field
    }
  };

  return (
    <div
      style={{ backgroundColor: "#000000", color: "white", height: "100vh" }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Add a new task"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Add task description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button onClick={addNewTask}>Add Task</button>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  // backgroundColor: "#222327",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>

                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 350,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {editingTask === item.id ? (
                                        <div>
                                          <input
                                            type="text"
                                            value={editedTaskData.content}
                                            onChange={(e) => {
                                              setEditedTaskData({
                                                ...editedTaskData,
                                                content: e.target.value,
                                              });
                                            }}
                                          />
                                          <input
                                            type="text"
                                            value={editedTaskData.description}
                                            onChange={(e) => {
                                              setEditedTaskData({
                                                ...editedTaskData,
                                                description: e.target.value,
                                              });
                                            }}
                                          />
                                          <button onClick={cancelEditingData}>
                                            Cancel
                                          </button>
                                          <button
                                            onClick={() => {
                                              saveEditedTaskData(columnId);
                                            }}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          <div>
                                            {item.content}
                                            <button
                                              onClick={() => {
                                                startEditingTask(
                                                  item.id,
                                                  item.content,
                                                  item.description
                                                );
                                              }}
                                            >
                                              Edit
                                            </button>
                                          </div>
                                          <div>{item.description}</div>
                                        </div>
                                      )}
                                      <button
                                        onClick={() => {
                                          deleteTask(columnId, item.id);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
