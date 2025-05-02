import React from "react";
import './AccountSelection.css';
import { useNavigate } from "react-router-dom";

export default function AccountSelection() {
    const allEmployeeData = employees;
    const navigate = useNavigate();
    let empMap = {};
    localStorage.setItem('currentEmp', null) // Placeholder for logged-in user

    allEmployeeData.forEach(emp => {
        empMap[emp.id] = { ...emp, children: [] };
    });

    let tree = [];
    allEmployeeData.forEach((emp) => {
        if (!emp.managerId) {
            tree.push(empMap[emp.id]);
        } else {
            empMap[emp.managerId].children.push(empMap[emp.id]);
        }
    });

    const renderTree = (node) => {
        const handleClick = (event) => {
            event.stopPropagation();
            console.log(node);
            localStorage.setItem('currentEmp', node.id)
            navigate('/team')
        };

        return (
            <div className="employee-node" key={node.id}>
                <div className="employee-info" onClick={handleClick}>
                    <p>{node.name}</p>
                </div>
                {node.children && node.children.length > 0 && (
                    <div className="children">
                        {node.children.map((child) => renderTree(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="account-selection">
            <h1>Select an Account</h1>
            <div className="org-tree">
                {tree.map((employee) => renderTree(employee))}
            </div>
        </div>
    );
}
