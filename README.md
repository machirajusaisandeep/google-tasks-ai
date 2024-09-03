# 📋 TasksBoard Application

A modern, responsive task management application built with React and Material-UI.

Demo link : https://google-tasks-ai.vercel.app/

## 🌟 Features

- 🌓 Dark mode support with toggle button
- 💾 IndexedDB for local storage of tasks and lists
- 📊 Create up to 4 task lists
- ✅ Add, complete, and delete tasks within each list
- ✏️ Rename lists
- 🔍 Search bar to filter tasks across all lists
- 🖥️ Responsive design for various screen sizes
- ⌨️ Keyboard shortcut (Cmd+K on Mac, Ctrl+K on Windows) to focus the search bar
- 🗑️ Delete entire lists
- 🎭 Animations using Framer Motion for adding new lists or tasks
- 🏆 Display count of completed tasks for each list

## 🚀 Key Requirements

- Clean, modern UI with a focus on usability and performance
- Real-time data synchronization between UI and IndexedDB storage
- No duplicate list names allowed
- Start with no initial lists; users add lists as needed
- Center-aligned search bar in the app bar
- Highlight tasks that match the search text

## 💻 Technical Stack

- React
- Material-UI
- IndexedDB
- Framer Motion

## 🎨 UI/UX Considerations

- Implement a clean, intuitive interface
- Ensure smooth animations for better user experience
- Optimize performance for handling multiple lists and tasks

## 🔧 Development Guidelines

- Follow React best practices and conventions
- Implement proper error handling and data validation
- Write clean, maintainable, and well-documented code
- Ensure cross-browser compatibility

## 📈 Future Enhancements

- Implement user authentication and cloud synchronization
- Add drag-and-drop functionality for tasks between lists
- Integrate with calendar applications for task scheduling
- Implement task prioritization and sorting options

## Step by Step Prompts

1. Create a TasksBoard application with the specified features and requirements.
2. Implement dark mode support with a toggle button.
3. Use IndexedDB for storage of tasks and lists.
4. Allow creation of up to 4 lists.
5. Enable adding, completing, and deleting tasks within each list.
6. Implement list renaming functionality.
7. Add a search bar to filter tasks across all lists.
8. Highlight tasks that match the search text.
9. Center-align the search bar in the app bar.
10. Implement keyboard shortcut (Cmd+K on Mac, Ctrl+K on Windows) to focus the search bar.
11. Allow deleting entire lists.
12. Ensure no two lists have the same name.
13. Remove unnecessary icons (refresh, menu, view week).
14. Start with no initial lists; users should be able to add lists as needed.
15. Use Framer Motion for animations when adding new lists or tasks.
16. Display a count of completed tasks for each list.
17. Implement responsive design for various screen sizes.
18. Implement the new task ID format and use it for all operations.
19. Update the TaskList component to use task.id instead of index for all task-related functions.
