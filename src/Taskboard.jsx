import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Card,
  CardHeader,
  CardContent,
  Button,
  Checkbox,
  Grid,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

const dbName = "TasksDB";
const dbVersion = 1;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) =>
      reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("lists", { keyPath: "id", autoIncrement: true });
    };
  });
};

const TasksBoard = () => {
  const [mode, setMode] = useState("light");
  const [lists, setLists] = useState([]);
  const [db, setDB] = useState(null);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = React.useRef(null);

  useEffect(() => {
    initDB().then((database) => {
      setDB(database);
      loadLists(database);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadLists = (database) => {
    const transaction = database.transaction(["lists"], "readonly");
    const objectStore = transaction.objectStore("lists");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      setLists(event.target.result);
    };
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const toggleTaskCompletion = (listId, taskIndex) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map((task, index) =>
              index === taskIndex
                ? { ...task, completed: !task.completed }
                : task
            ),
          }
        : list
    );
    setLists(updatedLists);
    updateListInDB(updatedLists.find((list) => list.id === listId));
  };

  const addTask = (listId, newTaskTitle) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            tasks: [
              ...list.tasks,
              { title: newTaskTitle, date: "Today", completed: false },
            ],
          }
        : list
    );
    setLists(updatedLists);
    updateListInDB(updatedLists.find((list) => list.id === listId));
  };

  const addNewList = () => {
    if (lists.length < 4) {
      let newTitle = "New List";
      let counter = 1;
      while (lists.some((list) => list.title === newTitle)) {
        newTitle = `New List ${counter}`;
        counter++;
      }
      const newList = { title: newTitle, tasks: [] };
      const transaction = db.transaction(["lists"], "readwrite");
      const objectStore = transaction.objectStore("lists");
      const request = objectStore.add(newList);

      request.onsuccess = (event) => {
        newList.id = event.target.result;
        setLists([...lists, newList]);
      };
    }
  };

  const renameList = (id, newTitle) => {
    if (lists.some((list) => list.title === newTitle && list.id !== id)) {
      alert(
        "A list with this name already exists. Please choose a different name."
      );
      return;
    }
    const updatedLists = lists.map((list) =>
      list.id === id ? { ...list, title: newTitle } : list
    );
    setLists(updatedLists);
    updateListInDB(updatedLists.find((list) => list.id === id));
  };

  const deleteList = (id) => {
    const updatedLists = lists.filter((list) => list.id !== id);
    setLists(updatedLists);
    const transaction = db.transaction(["lists"], "readwrite");
    const objectStore = transaction.objectStore("lists");
    objectStore.delete(id);
  };

  const deleteTask = (listId, taskIndex) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.filter((_, index) => index !== taskIndex),
          }
        : list
    );
    setLists(updatedLists);
    updateListInDB(updatedLists.find((list) => list.id === listId));
  };

  const updateListInDB = (updatedList) => {
    const transaction = db.transaction(["lists"], "readwrite");
    const objectStore = transaction.objectStore("lists");
    objectStore.put(updatedList);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              TasksBoard
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "background.paper",
                borderRadius: 1,
                px: 1,
                flexGrow: 1,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <InputBase
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                inputRef={searchInputRef}
                fullWidth
              />
            </Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Main Board
          </Typography>
          <Grid container spacing={3}>
            {lists.map((list) => (
              <TaskList
                key={list.id}
                listId={list.id}
                title={list.title}
                tasks={list.tasks}
                onToggleTask={(index) => toggleTaskCompletion(list.id, index)}
                onAddTask={(title) => addTask(list.id, title)}
                onRename={(newTitle) => renameList(list.id, newTitle)}
                onDeleteList={() => deleteList(list.id)}
                onDeleteTask={(index) => deleteTask(list.id, index)}
                searchText={searchText}
              />
            ))}
            {lists.length < 4 && (
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 2, color: "primary.main" }}
                    onClick={addNewList}
                  >
                    + Add new list
                  </Button>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const TaskList = ({
  listId,
  title,
  tasks,
  onToggleTask,
  onAddTask,
  onRename,
  onDeleteList,
  onDeleteTask,
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
                <MoreVertIcon />
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
            <Button onClick={handleAddTask} variant="contained" size="small">
              Add
            </Button>
          </Box>
          {tasks.map((task, index) => (
            <TaskItem
              key={index}
              task={task}
              onToggle={() => onToggleTask(index)}
              onDelete={() => onDeleteTask(index)}
              searchText={searchText}
            />
          ))}
          <Button color="inherit" sx={{ mt: 2, fontSize: "0.875rem" }}>
            Completed ({tasks.filter((t) => t.completed).length})
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

const TaskItem = ({ task, onToggle, onDelete, searchText }) => {
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
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </motion.div>
  );
};

export default TasksBoard;
