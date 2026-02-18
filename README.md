**Uber-Like Backend**

A lightweight Node.js backend that implements core ride-hailing features (users, captains/drivers, rides, maps integration and real-time notifications via sockets). Built with Express, MongoDB (Mongoose), Socket.IO and external geocoding/routing services.

**Tech Stack**
- **Runtime**: Node.js
- **Framework**: Express
- **DB**: MongoDB (Mongoose)
- **Realtime**: Socket.IO
- **HTTP client**: Axios

**Quick Start**
- **Prerequisites**: Node.js, npm, MongoDB instance
- **Install deps**: `npm install`
- **Run (dev)**: `npm run dev`
- **Run (prod)**: `npm start`

**Environment**
Create a `.env` file in the project root with at least:

- `MONGODB_URL` : MongoDB connection string
- `JWT_SECRET` : secret used to sign JWT tokens
- `PORT` : optional server port (defaults to 3000)

**Main files**
- **App entry**: [src/app.js](src/app.js#L1)
- **Server + socket init**: [src/server.js](src/server.js#L1)
- **Socket helpers**: [src/socket.js](src/socket.js#L1)

**API Overview**
Note: All API routes are prefixed with `/api`.

- **User** (`/api/user`)
  - **POST /register**: register new user
  - **POST /login**: login user (returns token, sets cookie)
  - **GET /profile**: get authenticated user profile (requires auth)
  - **GET /logout**: clear auth cookie

- **Captain** (`/api/captain`)
  - **POST /register**: register captain/driver
  - **POST /login**: login captain (returns token, sets cookie)
  - **GET /profile**: get authenticated captain profile
  - **GET /logout**: clear auth cookie
  - **PATCH /updateStatus**: toggle availability

- **Maps** (`/api/maps`)
  - **GET /get-coordinates?address=...**: geocode address (Nominatim)
  - **GET /get-distance-time?origin=...&destination=...**: routing (OSRM)
  - **GET /get-suggestions?input=...**: autocomplete suggestions (Nominatim)

- **Ride** (`/api/ride`)
  - **POST /create**: create new ride request (emits to captains in radius)
  - **GET /get-fare**: calculate fare between pickup/destination
  - **POST /confirm**: captain confirms a ride
  - **GET /start-ride**: begin ride (OTP flow)
  - **POST /end-ride**: end ride and finalize

**Complete Routes Reference**
You can also access a JSON format of all routes at the home endpoint:
- **GET /**: Returns JSON with complete list of all routes, methods, descriptions, and authentication requirements

| Route | Method | Description | Auth Required |
|-------|--------|-------------|----------------|
| `/api/user/register` | POST | Register a new user | No |
| `/api/user/login` | POST | Login user and get authentication token | No |
| `/api/user/profile` | GET | Get authenticated user's profile information | Yes |
| `/api/user/logout` | GET | Logout user and invalidate token | Yes |
| `/api/user/previous-rides` | GET | Get user's previous ride history | Yes |
| `/api/captain/register` | POST | Register a new captain | No |
| `/api/captain/login` | POST | Login captain and get authentication token | No |
| `/api/captain/profile` | GET | Get authenticated captain's profile information | Yes |
| `/api/captain/logout` | GET | Logout captain and invalidate token | Yes |
| `/api/captain/previous-rides` | GET | Get captain's previous ride history | Yes |
| `/api/captain/updateStatus` | PATCH | Update captain's availability status | Yes |
| `/api/ride/create` | POST | Create a new ride request | Yes |
| `/api/ride/get-fare` | GET | Get fare estimate for a ride | Yes |
| `/api/ride/confirm` | POST | Confirm a ride booking | Yes |
| `/api/ride/start-ride` | GET | Start an accepted ride | Yes |
| `/api/ride/end-ride` | POST | End an active ride | Yes |
| `/api/maps/get-coordinates` | GET | Get geographic coordinates for an address | Yes |
| `/api/maps/get-distance-time` | GET | Get distance and time between two locations | Yes |
| `/api/maps/get-suggestions` | GET | Get autocomplete suggestions for location search | Yes |

**Socket events**
- Client -> Server
  - **join**: `{ userId, userType }` register socket for user or captain
  - **update-location-captain**: `{ userId, location }` update captain location

- Server -> Client (examples)
  - **new ride**: sent to captains around pickup
  - **ride confirmed**: sent to user when captain accepts
  - **ride-started** / **ride-ended**: ride lifecycle notifications

**Authentication**
- JWT-based. Token may be sent as a cookie (`token`) or in `Authorization: Bearer <token>` header. The middleware is in [src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js#L1).

**Notes & External Services**
- Geocoding is implemented using Nominatim (OpenStreetMap) and routing with OSRM public endpoints. No API keys required, but be mindful of rate limits and usage policies.
- The maps services are in [src/services/maps.services.js](src/services/maps.services.js#L1).

**Development tips**
- Use `nodemon` for live reload (`npm run dev`).
- Ensure `MONGODB_URL` is reachable before starting; the server exits if DB connection fails.

**Contributing**
- Feel free to open issues or submit pull requests. Keep changes focused and add tests when possible.

**License**
- MIT
