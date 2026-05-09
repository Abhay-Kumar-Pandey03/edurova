# College Discovery Platform — Backend

A Node.js + Express + TypeScript REST API for the College Discovery Platform. Built with Prisma ORM and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Deployment:** Railway

## Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Express server entry point
│   ├── routes/
│   │   ├── colleges.ts             # College routes
│   │   ├── compare.ts              # Compare routes
│   │   └── predictor.ts            # Predictor routes
│   ├── controllers/
│   │   ├── collegeController.ts    # College CRUD + stats
│   │   ├── compareController.ts    # Compare logic
│   │   └── predictorController.ts  # Rank prediction logic
│   └── prisma/
│       └── client.ts               # Prisma singleton client
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # 60 Indian colleges seed data
├── .env                            # Environment variables
├── tsconfig.json
└── package.json
```

## Database Schema

```prisma
model College {
  id               Int      @id @default(autoincrement())
  name             String
  location         String
  state            String
  fees             Int
  rating           Float
  placement_percent Float
  courses          String[]
  description      String
  image_url        String?
  exam_accepted    String
  min_rank         Int
  max_rank         Int
  created_at       DateTime @default(now())
}
```

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Colleges
```
GET /api/colleges
Query params:
  - search     (string)  Search by college name
  - exam       (string)  Filter by JEE or NEET
  - location   (string)  Filter by state/location
  - minFees    (number)  Minimum annual fees in INR
  - maxFees    (number)  Maximum annual fees in INR
  - page       (number)  Page number (default: 1)

Response: {
  data: College[],
  pagination: { page, pageSize, total, totalPages }
}
```

```
GET /api/colleges/stats
Response: {
  totalColleges: number,
  totalStates: number,
  avgPlacement: number,
  topRating: number
}
```

```
GET /api/colleges/:id
Response: College object
```

### Compare
```
GET /api/compare?ids=1,2,3
Query params:
  - ids (string) Comma-separated college IDs (max 3)
Response: College[]
```

### Predictor
```
GET /api/predict?exam=JEE&rank=5000
Query params:
  - exam (string) JEE or NEET
  - rank (number) Student's rank
Response: College[] sorted by rating
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Railway)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/college-discovery.git
cd college-discovery/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL
```

### Environment Variables

Create a `.env` file in the backend folder:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
FRONTEND_URL="http://localhost:3000"
PORT=5000
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed with 60 Indian colleges
npx ts-node prisma/seed.ts
```

### Running Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

Server runs on `http://localhost:5000`

## Edge Cases Handled

- Invalid college ID returns 404
- Invalid exam type returns 400 with clear error message
- Invalid rank (non-integer, negative) returns 400
- Invalid fees filter returns 400
- Compare limited to max 3 colleges
- Search is case-insensitive
- Missing optional fields handled gracefully
- Database connection errors return 500

## Deployment (Railway)

1. Connect GitHub repo to Railway
2. Set root directory to `backend`
3. Add environment variables:
   - `DATABASE_URL`
   - `FRONTEND_URL`
   - `PORT=5000`
4. Build command: `npm install && npm run build && npx prisma generate`
5. Start command: `npm start`
