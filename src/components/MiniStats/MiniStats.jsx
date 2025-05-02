import React from "react";
import StatCard from "./StatCard/StatCard";
import "./MiniStats.css";

export default function MiniStats({ pendingTasksCount, taskStats }) {
    return (
        <div className="miniStats">
            <div className="miniStat_Card">
                <h3>Your Tasks</h3>
                <h1>{pendingTasksCount}</h1>
            </div>
            <div className="miniStat_Card_side_container">
                <StatCard label="To Do" value={taskStats.toDo} />
                <StatCard label="Started" value={taskStats.started} />
                <StatCard label="On Hold" value={taskStats.onHold} />
                <StatCard label="Completed" value={taskStats.done} />
            </div>
        </div>
    );
}
