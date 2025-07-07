import React, { useEffect, useState } from "react";
import "./SideBar.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function SideBar() {
    const [sidebarImageUrl, setSidebarImageUrl] = useState(null);
    const location = useLocation();
    const currentPath = location.pathname;

    const sideBar_img_urls = {
        morning: "https://media.istockphoto.com/id/1286642458/vector/clouds-pixel-game-graphics-8-bit-sky-smoke-vector.jpg?s=612x612&w=0&k=20&c=5RxCK2H5mrjPey0IJWxoDgIkcb1Oo0WumvWp4fxUx4E=",
        dayTime: "https://media.istockphoto.com/id/1150050227/photo/heat-wave-of-extreme-sun-and-sky-background-hot-weather-with-global-warming-concept.jpg?s=612x612&w=0&k=20&c=EjBSIEDX39FRrARa7xiZyJtoXdgl3mePScIEQq9iW1U=",
        evening: "https://thumbs.dreamstime.com/b/sunset-sunrise-ocean-nature-landscape-background-pink-clouds-evening-morning-view-pixel-art-illustration-flying-sky-to-296799874.jpg",
        night: "https://cdn.vectorstock.com/i/500p/16/64/cloudy-night-sky-pixel-art-trendy-background-vector-49391664.jpg",
    };

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "dayTime";
        if (hour >= 17 && hour < 20) return "evening";
        return "night";
    };

    const navigate = useNavigate();
    const handleMenuItemClick = (route) => {
        navigate(route);
    };

    useEffect(() => {
        const updateImage = () => {
            const timeOfDay = getTimeOfDay();
            setSidebarImageUrl(sideBar_img_urls[timeOfDay]);
        };

        updateImage(); // run on mount
        const intervalId = setInterval(updateImage, 60 * 1000); // every minute

        return () => clearInterval(intervalId); // cleanup on unmount
    }, []);

    const menu_item_level_1 = [
        {
            id: 1,
            name: "Projects",
            route: "/projects"
        },
        {
            id: 2,
            name: "Team Members",
            route: "/team"
        }
    ]
    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('currentEmp');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar_top_img">
                {sidebarImageUrl && <img src={sidebarImageUrl} alt="Sidebar" />}
            </div>
            <div className="sidebar_menu">
                {
                    menu_item_level_1.map((item) => (
                        <div 
                            key={item.id} 
                            className={`sidebar_item ${currentPath === item.route ? 'active' : ''}`} 
                            onClick={() => handleMenuItemClick(item.route)}
                        >
                            <span>{item.name}</span>
                        </div>
                    ))
                }
            </div>
            <div className="sidebar_footer">
                <div className="sidebar_item logout_button" onClick={handleLogout}>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
}
