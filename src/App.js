import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";

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
        description: newTaskDescription,
      };
      updatedColumns.requested.items.push(newTask);
      setColumns(updatedColumns);
      setNewTaskContent("");
      setNewTaskDescription("");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000000",
        color: "white",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          bgcolor: "#222327",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <TextField
          variant="outlined"
          type="text"
          placeholder="Add a new task"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          sx={{ color: "white", m: 5, bgcolor: "white", borderRadius: "10px" }}
        />
        <TextField
          variant="outlined"
          type="text"
          placeholder="Add task description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          sx={{ color: "white", m: 5, bgcolor: "white", borderRadius: "10px" }}
        />
        <Button
          variant="outlined"
          onClick={addNewTask}
          sx={{
            color: "#FAFAFA",
            fontWeight: "bold",
            fontSize: 12,
            m: 5,
          }}
        >
          Add Task
        </Button>
      </Box>

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
                            backgroundColor: "#222327",
                            padding: 15,
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

                                        backgroundColor:
                                          "rgba(255, 255, 255,0.2)",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {editingTask === item.id ? (
                                        <Box>
                                          <Stack alignItems="flex-start">
                                            <Typography
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                              }}
                                            >
                                              Title:{" "}
                                            </Typography>
                                            <div>
                                              <TextField
                                                variant="outlined"
                                                size="small"
                                                value={editedTaskData.content}
                                                onChange={(e) => {
                                                  setEditedTaskData({
                                                    ...editedTaskData,
                                                    content: e.target.value,
                                                  });
                                                }}
                                                sx={{ bgcolor: "white", my: 1 }}
                                              />
                                            </div>

                                            <Typography
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                              }}
                                            >
                                              Description:{" "}
                                            </Typography>
                                            <div>
                                              <TextField
                                                variant="outlined"
                                                size="small"
                                                value={
                                                  editedTaskData.description
                                                }
                                                onChange={(e) => {
                                                  setEditedTaskData({
                                                    ...editedTaskData,
                                                    description: e.target.value,
                                                  });
                                                }}
                                                sx={{ bgcolor: "white", my: 1 }}
                                              />
                                            </div>

                                            <div>
                                              <Button
                                                variant="text"
                                                onClick={cancelEditingData}
                                                sx={{
                                                  color: "#FAFAFA",
                                                  fontWeight: "bold",
                                                  fontSize: 12,
                                                  m: 1,
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                variant="text"
                                                onClick={() => {
                                                  saveEditedTaskData(columnId);
                                                }}
                                                sx={{
                                                  color: "#FAFAFA",
                                                  fontWeight: "bold",
                                                  fontSize: 12,
                                                  m: 1,
                                                }}
                                              >
                                                Save
                                              </Button>
                                            </div>
                                          </Stack>
                                        </Box>
                                      ) : (
                                        <div>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              direction: "column",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                wordWrap: "break-word",
                                                m: 1,
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: "16px",
                                                }}
                                              >
                                                Title:{" "}
                                              </Typography>
                                              {item.content}
                                            </Typography>
                                          </Box>
                                          <div>
                                            <Typography
                                              sx={{
                                                wordWrap: "break-word",
                                                m: 1,
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: "16px",
                                                }}
                                              >
                                                Description:{" "}
                                              </Typography>
                                              {item.description}
                                            </Typography>
                                            <Button
                                              variant="text"
                                              onClick={() => {
                                                deleteTask(columnId, item.id);
                                              }}
                                              sx={{
                                                color: "#FAFAFA",
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                m: 1,
                                              }}
                                            >
                                              Delete
                                            </Button>
                                            <Button
                                              variant="text"
                                              onClick={() => {
                                                startEditingTask(
                                                  item.id,
                                                  item.content,
                                                  item.description
                                                );
                                              }}
                                              sx={{
                                                color: "#FAFAFA",
                                                fontWeight: "bold",
                                                fontSize: 12,
                                                m: 1,
                                              }}
                                            >
                                              Edit
                                            </Button>
                                          </div>
                                        </div>
                                      )}
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
