# Register API

The API reads its MongoDB URI, JWT secret, admin credentials, and client origin from `backend/.env`. Keep this file private and out of version control.

Install dependencies with `npm install`. Create the first and only account with `npm run seed:admin`. The seed command uses the admin credentials in `backend/.env` and refuses to run if the users collection already contains a user. There is no registration endpoint.

Start the API with `npm run dev` or `npm start`. `POST /api/auth/login` returns a 12-hour JWT; `GET /api/auth/me` requires `Authorization: Bearer <token>`. Apply `requireAuth` to every future inventory API route by mounting those routers after the `/api` authentication middleware in `app.js`.
