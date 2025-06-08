import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseurl from '../BaseUrl';
import { getAuthHeaders } from '../utils/authHeaders';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TouchSensor } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

function SortableTask({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.task);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(task._id, editedText);
      setIsEditing(false);
    }
  };

  // Generate a random pastel color for the task
  const getRandomColor = () => {
    const colors = [
      'bg-gradient-to-r from-pink-100 to-pink-200 border-l-4 border-pink-400',
      'bg-gradient-to-r from-blue-100 to-blue-200 border-l-4 border-blue-400',
      'bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-400',
      'bg-gradient-to-r from-purple-100 to-purple-200 border-l-4 border-purple-400',
      'bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-400',
      'bg-gradient-to-r from-indigo-100 to-indigo-200 border-l-4 border-indigo-400',
      'bg-gradient-to-r from-teal-100 to-teal-200 border-l-4 border-teal-400',
    ];
    // Use task ID to consistently get the same color for the same task
    const index = task._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const taskColor = getRandomColor();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 mb-3 rounded-xl shadow-sm cursor-grab ${taskColor} hover:shadow-md transition-all`}
    >
      {isEditing ? (
        <div className="flex items-center w-full">
          <input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 p-2 rounded-lg border mr-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-lg text-sm shadow-sm hover:shadow transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="font-medium">{task.task}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:bg-blue-100 p-1 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-500 hover:bg-red-100 p-1 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const TaskManager = () => {
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [newListName, setNewListName] = useState('');
  const [taskInputs, setTaskInputs] = useState({});
  const [showListInput, setShowListInput] = useState(false);

  const getLists = async () => {
    try {
      const res = await axios.get(`${baseurl}/list/getalllists`, getAuthHeaders());
      setLists(res.data.list || res.data.data);
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    }
  };

  const getTasks = async () => {
    try {
      const res = await axios.get(`${baseurl}/task/showtasks`, getAuthHeaders());
      const grouped = {};
      for (let task of res.data.data) {
        const listId = task.listId;
        if (!grouped[listId]) grouped[listId] = [];
        grouped[listId].push(task);
      }
      setTasksByList(grouped);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const addList = async () => {
    if (!newListName.trim()) return;
    try {
      const res = await axios.post(`${baseurl}/list/addinglist`, { list: newListName }, getAuthHeaders());
      setLists(prev => [...prev, res.data.list]);
      setNewListName('');
      setShowListInput(false);
    } catch (err) {
      console.error('Failed to add list:', err);
    }
  };

  const deleteTask = async (listId, taskId) => {
    try {
      await axios.delete(`${baseurl}/task/deletetask/${taskId}`, getAuthHeaders());
      setTasksByList(prev => {
        const updatedList = prev[listId]?.filter(task => task._id !== taskId);
        return {
          ...prev,
          [listId]: updatedList,
        };
      });
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const editTask = async (listId, taskId, newText) => {
    try {
      await axios.put(`${baseurl}/task/updatetask/${taskId}`, { task: newText }, getAuthHeaders());
      setTasksByList(prev => {
        const updatedTasks = prev[listId]?.map(task =>
          task._id === taskId ? { ...task, task: newText } : task
        );
        return {
          ...prev,
          [listId]: updatedTasks,
        };
      });
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteList = async (id) => {
    try {
      await axios.delete(`${baseurl}/list/deletelist/${id}`, getAuthHeaders());
      setLists(prev => prev.filter(list => list._id !== id));
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  const addTask = async (listId) => {
    const text = taskInputs[listId]?.trim();
    if (!text) return;

    try {
      const res = await axios.post(`${baseurl}/task/addtask`, { listId, task: text }, getAuthHeaders());
      setTasksByList(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), res.data.data]
      }));
      setTaskInputs(prev => ({ ...prev, [listId]: '' }));
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id;
    const overTaskId = over.id;

    if (!activeId || !overTaskId) return;

    let sourceListId = null;
    let destinationListId = null;
    let movedTask = null;

    for (const [listId, tasks] of Object.entries(tasksByList)) {
      if (tasks.find(t => t._id === activeId)) {
        sourceListId = listId;
      }
      if (tasks.find(t => t._id === overTaskId)) {
        destinationListId = listId;
      }
    }

    if (!sourceListId || !destinationListId) return;
    if (sourceListId === destinationListId) return;

    movedTask = tasksByList[sourceListId].find(t => t._id === activeId);

    try {
      await axios.put(`${baseurl}/task/updatelist/${activeId}`, { listId: destinationListId }, getAuthHeaders());

      setTasksByList(prev => {
        const newSourceTasks = prev[sourceListId].filter(t => t._id !== activeId);
        const newDestinationTasks = [...(prev[destinationListId] || []), { ...movedTask, listId: destinationListId }];
        return {
          ...prev,
          [sourceListId]: newSourceTasks,
          [destinationListId]: newDestinationTasks,
        };
      });
    } catch (err) {
      console.error("Error updating task listId:", err);
    }
  };

  useEffect(() => {
    getLists();
    getTasks();
  }, []);

  // Get a color for each list based on its ID
  const getListColor = (listId) => {
    const colors = [
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-pink-500 to-purple-500',
      'from-indigo-500 to-blue-500',
    ];

    // Use list ID to consistently get the same color for the same list
    const index = listId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">List of tasks</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {lists.map(list => {
            const listColor = getListColor(list._id);

            return (
              <div key={list._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className={`bg-gradient-to-r ${listColor} p-4 text-white flex justify-between items-center`}>
                  <h2 className="font-bold text-lg">{list.list}</h2>
                  <button
                    onClick={() => deleteList(list._id)}
                    className="bg-white bg-opacity-20 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-opacity-30 transition"
                  >
                    ×
                  </button>
                </div>

                <div className="p-4">
                  <SortableContext
                    id={list._id}
                    items={(tasksByList[list._id] || []).map(task => task._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {(tasksByList[list._id] || []).length > 0 ? (
                      (tasksByList[list._id] || []).map(task => (
                        <SortableTask
                          key={task._id}
                          task={task}
                          onEdit={(taskId, newText) => editTask(list._id, taskId, newText)}
                          onDelete={(taskId) => deleteTask(list._id, taskId)}
                        />
                      ))
                    ) : (
                      <div className="text-center p-4 text-gray-400">No tasks yet</div>
                    )}
                  </SortableContext>

                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={taskInputs[list._id] || ''}
                      placeholder="Add a new task..."
                      onChange={(e) => setTaskInputs({ ...taskInputs, [list._id]: e.target.value })}
                      className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    <button
                      onClick={() => addTask(list._id)}
                      className={`bg-gradient-to-r ${listColor} text-white px-4 rounded-xl hover:opacity-90 shadow-sm`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add new list */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {!showListInput ? (
              <div className="p-6 flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl">
                <button
                  onClick={() => setShowListInput(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl hover:opacity-90 transition shadow-md"
                >
                  + Create New List
                </button>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-purple-600">Create New List</h3>
                <input
                  type="text"
                  value={newListName}
                  placeholder="List name"
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mb-4"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={addList}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl hover:opacity-90 transition shadow-md"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowListInput(false)}
                    className="flex-1 bg-gray-200 p-3 rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default TaskManager;

