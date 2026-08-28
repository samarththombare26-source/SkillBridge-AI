import { Outlet } from "react-router-dom";

import Sidebar from "../components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/Navbar";

function StudentLayout() {

    return (

        <div
            className="d-flex bg-light"
            style={{
                minHeight: "100vh"
            }}
        >

            {/* Sidebar */}
            <Sidebar />

            {/* Main Area */}
            <main
                className="flex-grow-1"
                style={{
                    minWidth: 0
                }}
            >

                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <div className="p-4">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}

export default StudentLayout;