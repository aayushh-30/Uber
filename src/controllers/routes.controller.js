const routesInfo = {
    user: [
        {
            path: "/api/user/register",
            method: "POST",
            description: "Register a new user",
            requiresAuth: false,
            requestFields: {
                "firstName [REQUIRED]": "String (min: 2 chars, trimmed)",
                "lastName [REQUIRED]": "String (min: 2 chars, trimmed)",
                "email [REQUIRED]": "String (unique, min: 5 chars, trimmed)",
                "password [REQUIRED]": "String (hashed with bcrypt)"
            },
            responseFields: {
                "token": "String (JWT token, expires in 7 days)",
                "user": "Object { _id, fullName: { firstName, lastName }, email, socketID, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/user/login",
            method: "POST",
            description: "Login user and get authentication token",
            requiresAuth: false,
            requestFields: {
                "email [REQUIRED]": "String (user's registered email)",
                "password [REQUIRED]": "String (user's password)"
            },
            responseFields: {
                "token": "String (JWT token, expires in 7 days)",
                "user": "Object { _id, fullName: { firstName, lastName }, email, socketID, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/user/profile",
            method: "GET",
            description: "Get authenticated user's profile information",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "user": "Object { _id, fullName: { firstName, lastName }, email, socketID, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/user/logout",
            method: "GET",
            description: "Logout user and invalidate token",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "message": "String (logout confirmation)"
            }
        },
        {
            path: "/api/user/previous-rides",
            method: "GET",
            description: "Get user's previous ride history",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "rides": "Array of Ride objects { _id, user, captain, pickup, destination, fare, status, duration, distance, createdAt, updatedAt }"
            }
        }
    ],
    captain: [
        {
            path: "/api/captain/register",
            method: "POST",
            description: "Register a new captain",
            requiresAuth: false,
            requestFields: {
                "firstName [REQUIRED]": "String",
                "lastName [REQUIRED]": "String",
                "email [REQUIRED]": "String (unique)",
                "password [REQUIRED]": "String (min: 6 chars, hashed with bcrypt)",
                "phone [REQUIRED]": "String (unique)",
                "licenseNumber [REQUIRED]": "String (unique)",
                "color [REQUIRED]": "String (vehicle color)",
                "plate.number [REQUIRED]": "String (license plate number)",
                "plate.state [REQUIRED]": "String (license plate state)",
                "capacity [REQUIRED]": "Number (Integer)",
                "vehicleType [REQUIRED]": "String (Enum: 'sedan', 'suv', 'van', 'motorcycle')"
            },
            responseFields: {
                "token": "String (JWT token, expires in 24 hours)",
                "captain": "Object { _id, name, email, phone, licenseNumber, rating, status, vehicle, location, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/captain/login",
            method: "POST",
            description: "Login captain and get authentication token",
            requiresAuth: false,
            requestFields: {
                "email [REQUIRED]": "String (captain's registered email)",
                "password [REQUIRED]": "String (captain's password)"
            },
            responseFields: {
                "token": "String (JWT token, expires in 24 hours)",
                "captain": "Object { _id, name, email, phone, licenseNumber, rating, status, vehicle, location, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/captain/profile",
            method: "GET",
            description: "Get authenticated captain's profile information",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "captain": "Object { _id, name, email, phone, licenseNumber, rating, status, vehicle, location, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/captain/logout",
            method: "GET",
            description: "Logout captain and invalidate token",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "message": "String (logout confirmation)"
            }
        },
        {
            path: "/api/captain/previous-rides",
            method: "GET",
            description: "Get captain's previous ride history",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "rides": "Array of Ride objects { _id, user, captain, pickup, destination, fare, status, duration, distance, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/captain/updateStatus",
            method: "PATCH",
            description: "Update captain's availability status",
            requiresAuth: true,
            requestFields: {
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "status": "Boolean (true=available, false=unavailable)",
                "captain": "Object { _id, name, email, phone, status, ... }"
            }
        }
    ],
    ride: [
        {
            path: "/api/ride/create",
            method: "POST",
            description: "Create a new ride request",
            requiresAuth: true,
            requestFields: {
                "pickup [REQUIRED]": "String (pickup location address)",
                "destination [REQUIRED]": "String (destination address)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "ride": "Object { _id, user, captain, pickup, destination, fare, status: 'pending', otp, createdAt, updatedAt }"
            }
        },
        {
            path: "/api/ride/get-fare",
            method: "GET",
            description: "Get fare estimate for a ride",
            requiresAuth: true,
            requestFields: {
                "pickup [REQUIRED]": "String (query param - pickup location)",
                "destination [REQUIRED]": "String (query param - destination)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "fares": "Object { sedan: Number, suv: Number, van: Number, motorcycle: Number }"
            }
        },
        {
            path: "/api/ride/confirm",
            method: "POST",
            description: "Confirm a ride booking",
            requiresAuth: true,
            requestFields: {
                "rideId [REQUIRED]": "String (ObjectId - ride to confirm)",
                "captainId [REQUIRED]": "String (ObjectId - captain accepting ride)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "ride": "Object { _id, user, captain, pickup, destination, fare, status: 'accepted', createdAt, updatedAt }"
            }
        },
        {
            path: "/api/ride/start-ride",
            method: "GET",
            description: "Start an accepted ride",
            requiresAuth: true,
            requestFields: {
                "rideId [REQUIRED]": "String (query param - ride to start)",
                "otp [REQUIRED]": "String (query param - one-time password)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "ride": "Object { _id, user, captain, pickup, destination, status: 'ongoing', createdAt, updatedAt }"
            }
        },
        {
            path: "/api/ride/end-ride",
            method: "POST",
            description: "End an active ride",
            requiresAuth: true,
            requestFields: {
                "rideId [REQUIRED]": "String (ObjectId - ride to end)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "ride": "Object { _id, user, captain, pickup, destination, fare, status: 'completed', distance, duration, createdAt, updatedAt }"
            }
        }
    ],
    maps: [
        {
            path: "/api/maps/get-coordinates",
            method: "GET",
            description: "Get geographic coordinates for an address",
            requiresAuth: true,
            requestFields: {
                "address [REQUIRED]": "String (query param - location address)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "ltd": "Number (Decimal - latitude coordinate)",
                "lng": "Number (Decimal - longitude coordinate)"
            }
        },
        {
            path: "/api/maps/get-distance-time",
            method: "GET",
            description: "Get distance and time between two locations",
            requiresAuth: true,
            requestFields: {
                "origin [REQUIRED]": "String (query param - starting location address)",
                "destination [REQUIRED]": "String (query param - ending location address)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "distance": "Object { text: String (e.g., '5 km'), value: Number (in meters) }",
                "duration": "Object { text: String (e.g., '15 mins'), value: Number (in seconds) }"
            }
        },
        {
            path: "/api/maps/get-suggestions",
            method: "GET",
            description: "Get autocomplete suggestions for location search",
            requiresAuth: true,
            requestFields: {
                "input [REQUIRED]": "String (query param - partial location input)",
                "Authorization [REQUIRED]": "Bearer token in header"
            },
            responseFields: {
                "suggestions": "Array of String (autocomplete suggestions for the input)"
            }
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
