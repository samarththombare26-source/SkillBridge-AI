// ==========================================
// AUTH HELPERS
// ==========================================

export function getToken() {

    return localStorage.getItem("token");

}


export function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user") || "null"
        );

    } catch {

        return null;

    }

}


export function getRole() {

    const user = getUser();

    return user?.role?.toLowerCase() || null;

}


export function isAuthenticated() {

    return Boolean(
        getToken() && getUser()
    );

}


// ==========================================
// ROLE -> DASHBOARD PATH
// ==========================================

export function getDashboardPath(role) {

    switch (role) {

        case "admin":
            return "/admin";

        case "mentor":
            return "/mentor";

        case "recruiter":
            return "/recruiter";

        case "student":
            return "/student";

        default:
            return "/login";

    }

}


export function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

}
