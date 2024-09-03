import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  InputBase,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskItem from "./TaskItem";

const TaskList = ({
  listId,
  title,
  tasks,
  onToggleTask,
  onAddTask,
  onRename,
  onDeleteList,
  onDeleteTask,
  onEditTask,
  onTogglePinTask,
  searchText,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newListTitle, setNewListTitle] = useState(title);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleRename = () => {
    if (newListTitle.trim() && newListTitle !== title) {
      onRename(newListTitle.trim());
    }
    setIsRenaming(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  const uncompletedTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardHeader
          action={
            <>
              <IconButton
                aria-label="rename"
                onClick={() => setIsRenaming(true)}
              >
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={onDeleteList}>
                <DeleteIcon />
              </IconButton>
            </>
          }
          title={
            isRenaming ? (
              <InputBase
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onBlur={handleRename}
                onKeyPress={(e) => e.key === "Enter" && handleRename()}
                autoFocus
              />
            ) : (
              title
            )
          }
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
        />
        <CardContent>
          <Box sx={{ display: "flex", mb: 2 }}>
            <InputBase
              placeholder="New task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <Button
              onClick={handleAddTask}
              variant="contained"
              size="small"
              disabled={!newTaskTitle.trim()}
            >
              Add
            </Button>
          </Box>
          {uncompletedTasks.map((task, index) => (
            <TaskItem
              key={index}
              task={task}
              onToggle={() => onToggleTask(index)}
              onDelete={() => onDeleteTask(index)}
              onEdit={(newTitle) => onEditTask(index, newTitle)}
              onTogglePin={() => onTogglePinTask(index)}
              searchText={searchText}
            />
          ))}
          {completedTasks.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Completed Tasks
              </Typography>
              {completedTasks.map((task, index) => (
                <TaskItem
                  key={index + uncompletedTasks.length}
                  task={task}
                  onToggle={() => onToggleTask(index + uncompletedTasks.length)}
                  onDelete={() => onDeleteTask(index + uncompletedTasks.length)}
                  onEdit={(newTitle) =>
                    onEditTask(index + uncompletedTasks.length, newTitle)
                  }
                  onTogglePin={() =>
                    onTogglePinTask(index + uncompletedTasks.length)
                  }
                  searchText={searchText}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TaskList;
