# Admin Approval System

This system ensures that there's only one admin per organization and that any new admin requests must be approved by the existing admin.

## How It Works

### 1. First Admin Registration
- When the first user registers with the role "admin" for an organization, they automatically become the admin
- Their `adminApproval` is set to `true` and `adminRequestStatus` is set to `"approved"`

### 2. Subsequent Admin Requests
- When another user tries to register as "admin" for the same organization:
  - They are registered as a regular "user" instead
  - Their `adminRequestStatus` is set to `"pending"`
  - They receive a message: "Registration successful. Your request to become an admin is pending approval."

### 3. Admin Request Flow for Existing Users
- Regular users can request admin privileges using the `/user/request-admin` endpoint
- This sets their `adminRequestStatus` to `"pending"`

### 4. Admin Approval Process
- The current admin can view pending requests using `/user/admin-requests`
- The admin can approve or reject requests using `/user/admin-requests/:id/review`
- When approved:
  - User's `role` becomes `"admin"`
  - `adminApproval` becomes `true`
  - `adminRequestStatus` becomes `"approved"`
  - `approvedBy` and `approvedAt` fields are set

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user (with admin approval logic)
- `POST /auth/login` - Login (returns admin request status)

### Admin Management (Admin Only)
- `GET /user/admin-requests` - Get pending admin requests
- `POST /user/admin-requests/:id/review` - Approve/reject admin request
  - Body: `{ "action": "approve" }` or `{ "action": "reject" }`

### User Actions
- `POST /user/request-admin` - Request admin privileges (Authenticated users only)

### Existing Admin Routes (Admin Only)
- `GET /user/organization` - Get all users in organization
- `GET /user/stats` - Get user statistics
- `DELETE /user/:id` - Delete a user

## Database Schema Changes

Added to User model:
```javascript
adminRequestStatus: {
  type: String,
  enum: ["none", "pending", "approved", "rejected"],
  default: "none",
},
adminRequestedAt: {
  type: Date,
},
approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
approvedAt: {
  type: Date,
}
```

## Security Features

1. **Single Admin Enforcement**: Only one admin per organization is allowed
2. **Approval Required**: All admin requests need existing admin approval
3. **Token Validation**: Admin middleware checks both role and approval status
4. **Organization Isolation**: Users can only manage requests within their organization

## Usage Examples

### 1. Register First Admin
```bash
POST /auth/register
{
  "username": "admin1",
  "email": "admin@company.com",
  "password": "password123",
  "role": "admin",
  "organization": "Company A"
}
# Response: User becomes admin immediately
```

### 2. Register Second Admin (Becomes Pending)
```bash
POST /auth/register
{
  "username": "admin2",
  "email": "admin2@company.com",
  "password": "password123",
  "role": "admin",
  "organization": "Company A"
}
# Response: User registered as regular user with pending admin request
```

### 3. Existing User Requests Admin
```bash
POST /user/request-admin
Authorization: Bearer <user-token>
# Response: Admin request submitted
```

### 4. Admin Views Pending Requests
```bash
GET /user/admin-requests
Authorization: Bearer <admin-token>
# Response: List of pending admin requests
```

### 5. Admin Approves Request
```bash
POST /user/admin-requests/USER_ID/review
Authorization: Bearer <admin-token>
{
  "action": "approve"
}
# Response: User promoted to admin
```

## Frontend Integration

The login response now includes:
- `adminRequestStatus`: Current status of admin request
- `adminApproval`: Whether user has admin approval

Frontend can use these to show appropriate UI:
- Show "Admin request pending" message
- Hide admin features for non-approved users
- Display admin request button for regular users
