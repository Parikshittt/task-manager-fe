import React from "react";
import './StatCard.css';

export default function StatCard({ label, value }) {
    return (
        <div className="miniStat_Card_side_card">
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    );
}
