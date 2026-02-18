const routesInfo = {
    user: [
        {
            path: "/api/user/register",
            method: "POST",
            description: "Register a new user",
            requiresAuth: false
        },
        {
            path: "/api/user/login",
            method: "POST",
            description: "Login user and get authentication token",
            requiresAuth: false
        },
        {
            path: "/api/user/profile",
            method: "GET",
            description: "Get authenticated user's profile information",
            requiresAuth: true
        },
        {
            path: "/api/user/logout",
            method: "GET",
            description: "Logout user and invalidate token",
            requiresAuth: true
        },
        {
            path: "/api/user/previous-rides",
            method: "GET",
            description: "Get user's previous ride history",
            requiresAuth: true
        }
    ],
    captain: [
        {
            path: "/api/captain/register",
            method: "POST",
            description: "Register a new captain",
            requiresAuth: false
        },
        {
            path: "/api/captain/login",
            method: "POST",
            description: "Login captain and get authentication token",
            requiresAuth: false
        },
        {
            path: "/api/captain/profile",
            method: "GET",
            description: "Get authenticated captain's profile information",
            requiresAuth: true
        },
        {
            path: "/api/captain/logout",
            method: "GET",
            description: "Logout captain and invalidate token",
            requiresAuth: true
        },
        {
            path: "/api/captain/previous-rides",
            method: "GET",
            description: "Get captain's previous ride history",
            requiresAuth: true
        },
        {
            path: "/api/captain/updateStatus",
            method: "PATCH",
            description: "Update captain's availability status",
            requiresAuth: true
        }
    ],
    ride: [
        {
            path: "/api/ride/create",
            method: "POST",
            description: "Create a new ride request",
            requiresAuth: true
        },
        {
            path: "/api/ride/get-fare",
            method: "GET",
            description: "Get fare estimate for a ride",
            requiresAuth: true
        },
        {
            path: "/api/ride/confirm",
            method: "POST",
            description: "Confirm a ride booking",
            requiresAuth: true
        },
        {
            path: "/api/ride/start-ride",
            method: "GET",
            description: "Start an accepted ride",
            requiresAuth: true
        },
        {
            path: "/api/ride/end-ride",
            method: "POST",
            description: "End an active ride",
            requiresAuth: true
        }
    ],
    maps: [
        {
            path: "/api/maps/get-coordinates",
            method: "GET",
            description: "Get geographic coordinates for an address",
            requiresAuth: true
        },
        {
            path: "/api/maps/get-distance-time",
            method: "GET",
            description: "Get distance and time between two locations",
            requiresAuth: true
        },
        {
            path: "/api/maps/get-suggestions",
            method: "GET",
            description: "Get autocomplete suggestions for location search",
            requiresAuth: true
        }
    ]
};

const getAllRoutes = (req, res) => {
    res.status(200).json({
        message: "Uber Backend API Routes",
        author: "Ayush",
        description: "A lightweight Node.js backend that implements core ride-hailing features (users, captains/drivers, rides, maps integration and real-time notifications via sockets)",
        routes: routesInfo
    });
};

module.exports = { getAllRoutes };
