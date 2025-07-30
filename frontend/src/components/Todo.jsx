// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Todo = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');
//   const [editingTask, setEditingTask] = useState(null);
//   const [editingText, setEditingText] = useState('');

//   const client = axios.create({
//     baseURL: "http://localhost:4000/task",
//   });

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await client.get('/all');
//       //axios se jab bhi data manganege toh .data lagana padhega kyu {asdf,sadf,sdf} json se hamko hamara tasks chaie
//       setTasks(response.data.tasks);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       toast.error('Failed to fetch tasks');
//     }
//   };

//   const addTask = async () => {
//     if (newTask.trim() === '') return; // new task khali toh nahi
//     try {
//       const response = await client.post('/create', { task: newTask });
//       setTasks([response.data.task, ...tasks]); // ...tasks baad mai hain amtlab hamara taskstarting mai dalega
//       setNewTask('');
//       toast.success('Task added successfully');
//     } catch (error) {
//       console.error('Error adding task:', error);
//       toast.error('Failed to add task');
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await client.delete(`/delete/${id}`);
//       setTasks(tasks.filter(task => task._id !== id));
//       toast.success('Task deleted successfully');
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       toast.error('Failed to delete task');
//     }
//   };

//   const startEditing = (task) => {
//     setEditingTask(task._id); // jab bhi edit button dabenge tab yeh call hojaega
//     setEditingText(task.task);
//   };

//   const saveTask = async (id) => {
//     try {
//       const response = await client.put(`/update/${id}`, { task: editingText });
//       setTasks(tasks.map(task => (task._id === id ? response.data.task : task)));
//       setEditingTask(null);
//       setEditingText('');
//       toast.success('Task updated successfully');
//     } catch (error) {
//       console.error('Error updating task:', error);
//       toast.error('Failed to update task');
//     }
//   };

//   const toggleCompletion = async (id) => {
//     try {
//       const response = await client.patch(`/toggle/${id}`);
//       setTasks(tasks.map(task => (task._id === id ? response.data.task : task)));
//       toast.success('Task status updated');
//     } catch (error) {
//       console.error('Error updating task status:', error);
//       toast.error('Failed to update task status');
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto mt-10 bg-slate-800 rounded-lg shadow-lg p-6">
//       <h1 className="text-3xl font-bold text-center text-white mb-6">Todo List</h1>
//       <div className="flex mb-4">
//         <input
//           type="text"
//           className="flex-grow p-2 rounded-l-lg bg-slate-700 text-white focus:outline-none"
//           placeholder="Add a new task..."
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && addTask()}
//         />
//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg"
//           onClick={addTask}
//         >
//           Add
//         </button>
//       </div>
//       <ul>
//         {tasks.map(task => (
//           <li
//             key={task._id}
//             className={`flex items-center justify-between p-3 mb-2 rounded-lg ${task.completed ? 'bg-slate-700' : 'bg-slate-600'}`}
//           >
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={task.completed}
//                 onChange={() => toggleCompletion(task._id)}
//                 className="mr-3 h-5 w-5 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500"
//               />
//               {editingTask === task._id ? (
//                 <input
//                   type="text"
//                   value={editingText}
//                   onChange={(e) => setEditingText(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && saveTask(task._id)}
//                   className="bg-slate-700 text-white p-1 rounded"
//                 />
//               ) : (
//                 <span className={`text-lg ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
//                   {task.task}
//                 </span>
//               )}
//             </div>
//             <div className="flex gap-2">
//               {editingTask === task._id ? (
//                 <button onClick={() => saveTask(task._id)} className="text-green-500 hover:text-green-400">
//                   Save
//                 </button>
//               ) : (
//                 <button onClick={() => startEditing(task)} className="text-yellow-500 hover:text-yellow-400">
//                   Edit
//                 </button>
//               )}
//               <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-400">
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Todo;
