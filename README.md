# devTinder-backend

# API LIST

## authRouter

- POST /signup ✅
- POST /login ✅
- POST /logout ✅

## profileRouter

- GET /profile/view ✅
- PATCH /profile/edit ✅
- PATCH /profile/password ✅

## connectionRequestRouter

- POST /request/send/:status(interested)/:userId ✅
- POST /request/send/:status(ignored)/:userId ✅
- POST /request/review/:status(accepted)/:requestId ✅
- POST /request/review/:status(rejected)/:requestId ✅

## UserRouter

- GET /user/requests ✅
- GET /user/connections ✅
- GET /user /feed -- Gets you the profiles of other users on the platform

- Status - interested, ignored, accepted, rejected
