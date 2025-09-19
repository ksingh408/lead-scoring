# Lead Scoring Backend

## Task 1: Input APIs

- POST `/offer` → Save offer info
- POST `/leads/upload` → Upload CSV file of leads (in-memory storage)


## Task 2: Scoring
- POST `/score/:uploadId` → Run scoring

- GET `/score/results` → View results

- GET `/score/exportCSV` → Export CSV

## Tech Stack

- Node.js
- Express
-Mongodb
- Multer (CSV upload)
- CSV-Parse
