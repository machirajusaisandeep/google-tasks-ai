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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

  const handleDeleteList = () => {
    if (tasks.length > 0) {
      setDeleteConfirmOpen(true);
    } else {
      onDeleteList();
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  const uncompletedTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  const showCrownIcon = completedTasks.length >= 10;

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
              <IconButton aria-label="delete" onClick={handleDeleteList}>
                <DeleteIcon />
              </IconButton>
            </>
          }
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {showCrownIcon && (
                <EmojiEventsIcon
                  color="primary"
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
              )}
              {isRenaming ? (
                <InputBase
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onBlur={handleRename}
                  onKeyPress={(e) => e.key === "Enter" && handleRename()}
                  autoFocus
                />
              ) : (
                title
              )}
            </Box>
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
          {uncompletedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              onEdit={(newTitle) => onEditTask(task.id, newTitle)}
              onTogglePin={() => onTogglePinTask(task.id)}
              searchText={searchText}
            />
          ))}
          {completedTasks.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Completed Tasks
              </Typography>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                  onEdit={(newTitle) => onEditTask(task.id, newTitle)}
                  onTogglePin={() => onTogglePinTask(task.id)}
                  searchText={searchText}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this list? It contains tasks.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onDeleteList();
              setDeleteConfirmOpen(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TaskList;
