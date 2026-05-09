# College Discovery Platform — Frontend

A Next.js 14 frontend for the College Discovery Platform. Built with Tailwind CSS and shadcn/ui components.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **HTTP Client:** Axios
- **Deployment:** Vercel

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── colleges/
│   │   ├── page.tsx            # College listing + search + filters
│   │   └── [id]/
│   │       └── page.tsx        # College detail page
│   ├── compare/
│   │   └── page.tsx            # Side-by-side comparison
│   └── predictor/
│       └── page.tsx            # Rank-based predictor
├── components/
│   ├── header.tsx              # Sticky navbar
│   ├── footer.tsx              # Footer
│   ├── college-card.tsx        # College card component
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── data.ts                 # API functions + TypeScript interfaces
│   └── utils.ts                # Utility functions
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
├── .env.local                  # Environment variables
└── package.json
```

## Pages

### 🏠 Home Page (`/`)
- Hero section with call-to-action buttons
- Real-time stats fetched from backend (total colleges, states, avg placement, top rating)

### 🔍 College Listing (`/colleges`)
- Grid of college cards with real data from PostgreSQL
- **Search** with 500ms debounce (prevents excessive API calls)
- **Filters:** Exam (JEE/NEET), State, Fees Range (Under ₹1L / ₹1L-5L / Above ₹5L)
- **Sort:** Rating, Placement %, Fees (Low/High), Name
- Active filter badges with individual clear buttons
- Empty state and error state handling
- Loading state while fetching

### 🏫 College Detail (`/colleges/[id]`)
- Full college information page
- Stats: Rating, Placement %, Annual Fees
- Quick facts: Exam accepted, Rank range
- Courses section
- About section
- Add to Compare button

### ⚖️ Compare Colleges (`/compare`)
- Select up to 3 colleges via dropdown
- Side-by-side comparison table
- Rows: Location, Rating, Placement %, Fees, Exam, Rank Range, Courses
- Remove individual colleges
- Empty state when fewer than 2 colleges selected

### 🎯 College Predictor (`/predictor`)
- Select exam: JEE or NEET
- Enter expected rank
- Returns matching colleges from backend
- Shows High / Medium / Low admission chance
- Results as college cards with View Details links

## Getting Started

### Prerequisites
- Node.js 18+
- Backend server running on port 5000

### Installation

```bash
# Navigate to frontend
cd college-discovery/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API URL
```

### Environment Variables

Create `.env.local` in the frontend folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

App runs on `http://localhost:3000`

## API Integration

All API calls are centralized in `lib/data.ts`:

```typescript
// Fetch all colleges with filters
getAllColleges({ search, exam, minFees, maxFees, page })

// Fetch single college
getCollegeById(id)

// Compare colleges
compareColleges([id1, id2, id3])

// Predict colleges by rank
predictColleges(exam, rank)

// Fetch real stats
getStats()
```

## Key Features

### Debounced Search
Search input waits 500ms after user stops typing before calling the API — prevents excessive network requests.

### Image Fallback
College cards show a blue gradient background when `image_url` is missing or invalid — no broken image icons.

### Error Handling
Every API call has try/catch with user-friendly error messages displayed on screen.

### Loading States
All pages show loading indicators while fetching data from the backend.

### Edge Cases
- Empty search results show clear message
- API failures show retry button
- Invalid college ID shows 404 page
- Compare with less than 2 colleges shows helpful prompt

## Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app`
4. Click Deploy!
