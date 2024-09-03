import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  InputBase,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PushPinIcon from "@mui/icons-material/PushPin";
import { motion } from "framer-motion";

const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onTogglePin,
  searchText,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    if (editedTitle.trim() !== task.title) {
      onEdit(editedTitle.trim());
    }
    setIsEditing(false);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts
          .filter(String)
          .map((part, i) =>
            regex.test(part) ? (
              <mark key={i}>{part}</mark>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Checkbox checked={task.completed} onChange={onToggle} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body2"
            sx={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            {highlightText(task.title, searchText)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {task.date}
          </Typography>
        </Box>
        <IconButton onClick={() => onTogglePin()} size="small">
          <PushPinIcon
            fontSize="small"
            color={task.pinned ? "primary" : "action"}
          />
        </IconButton>
        <IconButton onClick={() => setIsEditing(true)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {isEditing && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <InputBase
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyPress={(e) => e.key === "Enter" && handleEdit()}
            autoFocus
            fullWidth
            sx={{ mr: 1 }}
          />
          <Button onClick={handleEdit} variant="contained" size="small">
            Save
          </Button>
        </Box>
      )}
    </motion.div>
  );
};

export default TaskItem;
