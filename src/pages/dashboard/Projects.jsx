import React, { useEffect, useState, useMemo } from "react";
import "./Projects.css";
import Sidebar from "../../components/sidebar/SideBar";
import MiniStats from "../../components/MiniStats/MiniStats";
import { getAllUsers } from "../../api/userApi";
import { getAllTasks, createTask, updateTask, deleteTask } from "../../api/tasksApi";
import TaskModalForm from "../../components/TaskModal/TaskModalForm";
import Loader from "../../components/Loader/Loader";

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            setIsLoadingEmployees(true);
            try {
                const response = await getAllUsers();
                setEmployees(response.data);
                console.log("Employees fetched successfully");
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setIsLoadingEmployees(false);
            }
        };
        const fetchAllTasks = async () => {
            setIsLoadingTasks(true);
            try {
                const response = await getAllTasks();
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setIsLoadingTasks(false);
            }
        }
        fetchAllTasks();
        fetchAllEmployees();
    }, []);

    const currentUserId = Number(localStorage.getItem("currentEmp"));
    const currentEmpInfo = employees.find(user => user.id === currentUserId);

    const [showAllTasks, setShowAllTasks] = useState(false);
    const toggleTasksView = () => setShowAllTasks(prev => !prev);

    const filteredTasks = useMemo(() => {
        if (showAllTasks) {
            return tasks;
        } else {
            return tasks.filter(task => {
                // Check both assignee_id and assigneeId to handle both formats
                const taskAssigneeId = task.assignee_id || task.assigneeId;
                return String(taskAssigneeId) === String(currentUserId);
            });
        }
    }, [showAllTasks, tasks, currentUserId]);

    const taskStats = useMemo(() => {
        return filteredTasks.reduce((acc, task) => {
            switch (task.status) {
                case "To Do":
                    acc.toDo++;
                    break;
                case "Started":
                    acc.started++;
                    break;
                case "On Hold":
                    acc.onHold++;
                    break;
                case "Done":
                    acc.done++;
                    break;
                default:
                    break;
            }
            return acc;
        }, { toDo: 0, started: 0, onHold: 0, done: 0 });
    }, [filteredTasks]);

    const pendingTasksCount = taskStats.toDo + taskStats.started + taskStats.onHold;

    if (!currentEmpInfo) {
        return <Loader size="medium" />;
    }

    // Open modal for creating a new task
    const handleCreateTask = () => {
        setCurrentTask(null); // No task means create mode
        setIsModalOpen(true);
    };

    // Open modal for editing an existing task
    const handleEditTask = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    // Handle deleting a task
    const handleDeleteTask = async (id, e) => {
        e.stopPropagation(); // Prevent opening the edit modal
        
        if (window.confirm('Are you sure you want to delete this task?')) {
            setIsLoadingTasks(true);
            try {
                await deleteTask(id);
                // Update local state
                setTasks(tasks.filter(task => task.id !== id));
                console.log('Task deleted:', id);
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('There was an error deleting the task. Please try again.');
            } finally {
                setIsLoadingTasks(false);
            }
        }
    };

    // Handle saving task (create or update)
    const handleSaveTask = async (taskData) => {
        setIsLoadingTasks(true);
        try {
            if (currentTask) {
                // Update existing task
                const response = await updateTask(taskData.id, taskData);
                const updatedTask = response.data;
                
                // Update local state
                const updatedTasks = tasks.map(t => 
                    t.id === updatedTask.id ? updatedTask : t
                );
                setTasks(updatedTasks);
                console.log('Task updated:', updatedTask);
            } else {
                // Create new task
                const taskToCreate = {
                    ...taskData,
                    project_id: taskData.project_id || 1, // Default project ID if not provided
                };
                
                const response = await createTask(taskToCreate);
                const newTask = response.data;
                
                // Update local state
                setTasks([...tasks, newTask]);
                console.log('New task created:', newTask);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving task:', error);
            alert('There was an error saving the task. Please try again.');
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const renderTaskBoard = (status, displayTitle) => {
        const filtered = filteredTasks.filter(task => task.status === status);
        return (
            <div className="task-board" key={status}>
                <div className="task-board-header">
                    <h2>{displayTitle}</h2>
                </div>
                <div className="task-board-body">
                    {isLoadingTasks ? (
                        <Loader size="medium" />
                    ) : filtered.length === 0 ? (
                        <div className="no-tasks-message">No tasks in this category</div>
                    ) : (
                        filtered.map(task => {
                            const assignee = employees.find(user => user.id === task.assignee_id);
                            const isOtherAssignee = task.assigneeId !== currentUserId;
                            return (
                                <div 
                                    className="task-card" 
                                    key={task.id}
                                    onClick={() => handleEditTask(task)}
                                >
                                    <div className="task-card-header">
                                        <h3>{task.title}</h3>
                                        <button 
                                            className="delete-task-button" 
                                            onClick={(e) => handleDeleteTask(task.id, e)}
                                            title="Delete task"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <p>{task.description}</p>
                                    <div className="badge-container">
                                        <span className={`badge assignee-badge ${isOtherAssignee ? 'other-assignee' : ''}`}>
                                            👤 {assignee?.name || "Unassigned"}
                                        </span>
                                        <span className="badge status-badge">{task.status}</span>
                                        {task.priority && <span className="badge priority-badge">{task.priority}</span>}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Sidebar />
            <div className="dashboard">
                <div className="switch-container">
                    <label htmlFor="task-switch" className="switch-label">Show All Tasks</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="task-switch"
                            checked={showAllTasks}
                            onChange={toggleTasksView}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <button className="create-task-button" onClick={handleCreateTask}>Create A New Task</button>
                <MiniStats pendingTasksCount={pendingTasksCount} taskStats={taskStats} />
                <div className="segerated-task-board">
                    {renderTaskBoard("To Do", "To Do")}
                    {renderTaskBoard("Started", "Started")}
                    {renderTaskBoard("On Hold", "On Hold")}
                    {renderTaskBoard("Done", "Completed")}
                </div>
                
                {isModalOpen && (
                    <TaskModalForm 
                        task={currentTask}
                        employees={employees}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveTask}
                    />
                )}
            </div>
        </>
    );
}
