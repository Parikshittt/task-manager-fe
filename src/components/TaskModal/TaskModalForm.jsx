import React, { useState, useEffect } from "react";
import "./TaskModalForm.css";
import "./TaskModalForm.responsive.css";
import { createTask, updateTask } from "../../api/tasksApi";
import Loader from "../Loader/Loader";

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const STATUS_OPTIONS = ["To Do", "Started", "On Hold", "Completed"];

export default function TaskModalForm({ task, employees = [], onClose, onSave }) {
    const isEditMode = !!task;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: task?.id || Date.now().toString(),
        title: task?.title || "",
        description: task?.description || "",
        assignee_id: task?.assignee_id || task?.assigneeId || "",
        status: task?.status || STATUS_OPTIONS[0],
        priority: task?.priority || PRIORITY_OPTIONS[1],
        due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ""
    });

    // Find assignee name for display
    const getAssigneeName = (id) => {
        if (!id) return "Unassigned";
        const user = employees.find(emp => emp.id === id);
        return user ? user.name : `ID: ${id}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="task-modal-blur-bg" onClick={onClose}>
            <div className="task-modal-form" onClick={e => e.stopPropagation()}>
                <span className="close" onClick={onClose}>CLOSE</span>
                <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Task title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Task description"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignee_id">Assignee</label>
                        <select
                            id="assignee_id"
                            name="assignee_id"
                            value={formData.assignee_id}
                            onChange={handleChange}
                        >
                            <option value="">Unassigned</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group half">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                {PRIORITY_OPTIONS.map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="due_date">Due Date</label>
                        <input
                            type="date"
                            id="due_date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="save-button" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="button-with-loader">
                                    <span className="button-text">{isEditMode ? "Saving..." : "Creating..."}</span>
                                    <span className="inline-loader-container">
                                        <Loader size="small" />
                                    </span>
                                </span>
                            ) : (
                                isEditMode ? "Save Changes" : "Create Task"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
