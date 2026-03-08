*BrightPath* is a AI-Powered Ed-tech platform

## To run this project locally
```bash
# clone the repository
git clone https://github.com/codeovik/brightpath.git

# navigate to the project directory
cd brightpath

# Install dependencies
npm install
```

## To run *backend*
Open `.env` and copy this varriable key then use your own values.
```env
# common
PORT=3000
MONGO_URI=
NODE_ENV="development"
FRONT_END_DOMAIN=http://localhost:5173
```
```bash
# navigate to the backend directory
cd backend

# run the backend server
npm run dev
```

## To run *frontend*
```bash
# navigate to the frontend directory
cd frontend

# run the frontend server
npm run dev
```

https://cloud.mongodb.com/v2/69abfce5ad1d1a1fb1fe30e9#/explorer/69abfcfbb0a54355a9869e15/main/users/find