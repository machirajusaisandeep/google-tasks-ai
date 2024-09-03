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
  Button,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import TaskList from "./TaskList";

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

const GoogleTasks = () => {
  const [mode, setMode] = useState("light");
  const [lists, setLists] = useState([]);
  const [db, setDB] = useState(null);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = React.useRef(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

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
          background: {
            default: mode === "light" ? "#f0f0f0" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
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
              {
                title: newTaskTitle,
                date: "Today",
                completed: false,
                pinned: false,
              },
            ],
          }
        : list
    );
    setLists(updatedLists);
    updateListInDB(updatedLists.find((list) => list.id === listId));
  };

  const addNewList = () => {
    if (lists.length < 6) {
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

  const handleDeleteList = (id) => {
    const listToDelete = lists.find((list) => list.id === id);
    if (listToDelete.tasks.length > 1) {
      setListToDelete(listToDelete);
      setDeleteConfirmOpen(true);
    } else {
      deleteList(id);
    }
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

  const editTask = (listId, taskIndex, newTitle) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map((task, index) =>
              index === taskIndex ? { ...task, title: newTitle } : task
            ),
          }
        : list
    );
    setLists(updatedLists);
    updateListInDB(updatedLists.find((list) => list.id === listId));
  };

  const togglePinTask = (listId, taskIndex) => {
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map((task, index) =>
              index === taskIndex
                ? { ...task, pinned: !task.pinned }
                : { ...task, pinned: false }
            ),
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
              Google Tasks
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
              <Typography
                variant="caption"
                sx={{ ml: 1, color: "text.secondary" }}
              >
                {navigator.platform.indexOf("Mac") > -1 ? "⌘K" : "Ctrl+K"}
              </Typography>
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
                onDeleteList={() => handleDeleteList(list.id)}
                onDeleteTask={(index) => deleteTask(list.id, index)}
                onEditTask={(index, newTitle) =>
                  editTask(list.id, index, newTitle)
                }
                onTogglePinTask={(index) => togglePinTask(list.id, index)}
                searchText={searchText}
              />
            ))}
            {lists.length < 6 && (
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
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this list? It contains multiple
            tasks.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              deleteList(listToDelete.id);
              setDeleteConfirmOpen(false);
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default GoogleTasks;
