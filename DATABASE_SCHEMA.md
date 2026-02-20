# Database Schema Documentation

## User Model

| Field | Type | Required | Optional | Format/Constraints | Description |
|-------|------|----------|----------|-------------------|-------------|
| fullName.firstName | String | ✅ | ❌ | Min length: 2 chars, trimmed | First name of user |
| fullName.lastName | String | ✅ | ❌ | Min length: 2 chars, trimmed | Last name of user |
| email | String | ✅ | ❌ | Unique, Min length: 5 chars, trimmed | User's email address |
| password | String | ✅ | ❌ | Hashed with bcrypt (salt: 10) | User's encrypted password |
| socketID | String | ❌ | ✅ | Any string | Socket connection identifier for real-time updates |
| createdAt | Date | Auto-generated | - | ISO 8601 | Timestamp when user was created |
| updatedAt | Date | Auto-generated | - | ISO 8601 | Timestamp when user was last updated |

---

## Captain Model

| Field | Type | Required | Optional | Format/Constraints | Description |
|-------|------|----------|----------|-------------------|-------------|
| name.firstName | String | ✅ | ❌ | Any string | Captain's first name |
| name.lastName | String | ✅ | ❌ | Any string | Captain's last name |
| email | String | ✅ | ❌ | Unique | Captain's email address |
| password | String | ✅ | ❌ | Min length: 6 chars, Hashed with bcrypt (salt: 10) | Captain's encrypted password |
| phone | String | ✅ | ❌ | Unique | Captain's phone number |
| licenseNumber | String | ✅ | ❌ | Unique | Captain's driver license number |
| rating | Number | ❌ | ✅ | Default: 0 | Captain's average rating (0.0 - 5.0) |
| status | Boolean | ❌ | ✅ | Default: false | Availability status (false=unavailable, true=available) |
| socketId | String | ❌ | ✅ | Any string | Socket connection identifier for real-time updates |
| vehicle.color | String | ✅ | ❌ | Any string | Vehicle color |
| vehicle.plate.number | String | ✅ | ❌ | Any string | License plate number |
| vehicle.plate.state | String | ✅ | ❌ | Any string | License plate state/region |
| vehicle.capacity | Number | ✅ | ❌ | Integer | Number of passengers vehicle can carry |
| vehicle.vehicleType | String | ✅ | ❌ | Enum: ["sedan", "suv", "van", "motorcycle"] | Type of vehicle |
| location.ltd | Number | ❌ | ✅ | Decimal (latitude) | Vehicle latitude coordinate |
| location.lng | Number | ❌ | ✅ | Decimal (longitude) | Vehicle longitude coordinate |
| createdAt | Date | Auto-generated | - | ISO 8601 | Timestamp when captain was registered |
| updatedAt | Date | Auto-generated | - | ISO 8601 | Timestamp when captain was last updated |

---

## Ride Model

| Field | Type | Required | Optional | Format/Constraints | Description |
|-------|------|----------|----------|-------------------|-------------|
| user | ObjectId | ✅ | ❌ | Reference to User model | ID of the user requesting the ride |
| captain | ObjectId | ❌ | ✅ | Reference to Captain model | ID of the captain assigned (null until accepted) |
| pickup | String | ✅ | ❌ | Any string | Pickup location address |
| destination | String | ✅ | ❌ | Any string | Destination address |
| fare | Number | ✅ | ❌ | Decimal/Float | Ride fare amount in currency units |
| status | String | ❌ | ✅ | Enum: ["pending", "accepted", "cancelled", "completed", "ongoing"], Default: "pending" | Current ride status |
| duration | Number | ❌ | ✅ | Integer (seconds) | Total ride duration in seconds |
| distance | Number | ❌ | ✅ | Integer (meters) | Total ride distance in meters |
| paymentID | String | ❌ | ✅ | Any string | Payment gateway payment ID (Razorpay) |
| orderID | String | ❌ | ✅ | Any string | Payment gateway order ID (Razorpay) |
| signature | String | ❌ | ✅ | Any string | Payment gateway signature (Razorpay) |
| otp | String | ✅ | ❌ | Numeric string, Not returned by default (select: false) | One-time password for ride verification |
| createdAt | Date | Auto-generated | - | ISO 8601 | Timestamp when ride was requested |
| updatedAt | Date | Auto-generated | - | ISO 8601 | Timestamp when ride was last updated |

---

## BlackListToken Model

| Field | Type | Required | Optional | Format/Constraints | Description |
|-------|------|----------|----------|-------------------|-------------|
| token | String | ✅ | ❌ | Unique, JWT format | Logout token added to blacklist |
| createdAt | Date | Auto-generated | - | ISO 8601, Auto-expires after 24 hours (86400 seconds) | Timestamp when token was blacklisted |

---

## Summary

### Required vs Optional Fields

**Always Required:**
- User: firstName, lastName, email, password
- Captain: firstName, lastName, email, password, phone, licenseNumber, vehicle.color, vehicle.plate.number, vehicle.plate.state, vehicle.capacity, vehicle.vehicleType
- Ride: user, pickup, destination, fare, otp
- BlackListToken: token

**Optional (Can be null/undefined):**
- User: socketID
- Captain: rating, status, socketId, location.ltd, location.lng, captain (in Ride model)
- Ride: captain, duration, distance, paymentID, orderID, signature

### Data Type Summary

| Type | Fields | Notes |
|------|--------|-------|
| String | Most text fields | All strings are trimmed where applicable |
| Number | rating, capacity, fare, duration, distance, ltd, lng | Stored as numeric values |
| Boolean | status (Captain) | true/false for availability |
| Date | createdAt, updatedAt, blacklist expiry | ISO 8601 format, auto-generated |
| ObjectId | user (Ride), captain (Ride) | References to other collections |
| Enum | vehicleType, status (Ride) | Restricted to predefined values |

### Important Validations

- **Email**: Unique, minimum 5 characters, trimmed
- **Password**: Hashed with bcrypt salt factor of 10, minimum 6 characters for captains
- **Phone & License**: Unique identifiers
- **Vehicle Type**: Only accepts sedan, suv, van, or motorcycle
- **Ride Status**: Only accepts pending, accepted, cancelled, completed, or ongoing
- **Timestamps**: Automatically added and updated
- **OTP**: Not returned in queries by default (select: false) for security
