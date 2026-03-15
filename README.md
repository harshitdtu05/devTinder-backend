# devTinder-backend

# API LIST

## authRouter

- POST /signup ✅
- POST /login ✅
- POST /logout ✅

## profileRouter

- GET /profile/view ✅
- PATCH /profile/edit ✅
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/interested/:userId ✅
- POST /request/sedn/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## UserRouter

- GET /user/connections
- GET /user/requests
- GET /user /feed -- Gets you the profiles of other users on the platform

- Status - interested, ignored, accepted, rejected
