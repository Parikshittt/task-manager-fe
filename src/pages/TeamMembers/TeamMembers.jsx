import React, { useEffect, useState, useMemo } from "react";
import './TeamMembers.css';
import SideBar from "../../components/sidebar/Sidebar";
import { getAllUsers } from "../../api/userApi";
import Loader from '../../components/Loader/Loader';

export default function TeamMembers() {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await getAllUsers();
                setTotalEmployees(response.data.length);
                setEmployees(response.data);
                console.log("Employees fetched successfully");
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllEmployees();
    }, []);

    const currentUserId = Number(localStorage.getItem("currentEmp"));

    const currentEmpInfo = useMemo(
        () => employees.find(emp => emp.id === currentUserId) || {},
        [employees, currentUserId]
    );

    const directReports = useMemo(
        () => employees.filter(emp => emp.manager_id === currentUserId),
        [employees, currentUserId]
    );

    const managerName = useMemo(() => {
        const manager = employees.find(emp => emp.id === currentEmpInfo.manager_id);
        return manager?.name || "You Report To No One King👑";
    }, [employees, currentEmpInfo.manager_id]);

    if (isLoading) {
        return (
            <>
                <SideBar />
                <div className="team-members-container loading-container">
                    <Loader size="large" />
                </div>
            </>
        );
    }

    return (
        <>
            <SideBar />
            <div className="team-members-container">
                <h1 className="team-members-title">Hi, {currentEmpInfo.name || "Employee"}</h1>

                <div className="summary-section">
                    <div className="summary-card">
                        <h2>Total Employees</h2>
                        <span className="badge neutral-badge">{totalEmployees}</span>
                    </div>
                    <div className="summary-card">
                        <h2>Reporting To Me</h2>
                        <span className="badge status-badge">{directReports.length}</span>
                    </div>
                    <div className="summary-card">
                        <h2>Your Manager</h2>
                        <span className="badge status-badge">{managerName}</span>
                    </div>
                </div>

                <h2>Your Team List</h2>
                <div className="team-grid">
                    {directReports.length === 0 ? (
                        <div className="no-team-message">You don't have any direct reports yet.</div>
                    ) : (
                        directReports.map(emp => (
                            <div key={emp.id} className="team-card">
                                <h3>{emp.name}</h3>
                                <p className="designation-text">{emp.role || "No designation"}</p>
                                <span className="badge assignee-badge">👤 {emp.id}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
