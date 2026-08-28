import { Navigate, useLocation } from "react-router-dom";

import {
    getToken,
    getUser,
    getRole,
    getDashboardPath
} from "../utils/auth";

// ==========================================
// PROTECTED ROUTE WITH ROLE-BASED ACCESS
//
// <ProtectedRoute>                     -> any logged-in user
// <ProtectedRoute allow={["student"]}> -> only students
// <ProtectedRoute allow={["admin"]}>   -> only admins
// ==========================================

function ProtectedRoute({ children, allow }) {

    const location = useLocation();

    const token = getToken();

    const user = getUser();


    // ------------------------------
    // 1. NOT LOGGED IN -> LOGIN PAGE
    // ------------------------------

    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );

    }


    const role = getRole();


    // ------------------------------
    // 2. ROLE NOT ALLOWED -> OWN DASHBOARD
    // ------------------------------

    if (
        allow &&
        allow.length > 0 &&
        !allow.includes(role)
    ) {

        return (
            <Navigate
                to={getDashboardPath(role)}
                replace
            />
        );

    }


    return children;

}

export default ProtectedRoute;
