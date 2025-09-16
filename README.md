# Space Landing
vercel link : https://space-landing1.vercel.app/
# 
A full-stack web application for multimessenger astronomy event correlation and visualization.

## Features

- Upload at least 2 CSV files containing event data (gravitational wave, gamma-ray burst, etc.)
- Data is sent to a Python Flask backend for correlation analysis
- Correlated results (CSV/JSON) are returned and visualized
- Results are automatically stored in MongoDB
- Interactive dashboard for viewing and exploring correlated events
- Modern UI with React, Next.js, Tailwind CSS, and Framer Motion
- Admin authentication for data submission and dashboard access

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion
- **Backend:** Next.js API routes, Python Flask (external service made by us deployed on railway)
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Vercel (frontend/backend), Railway (Flask server)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended) \***\* if not do it by --force command \*\***
- pnpm (or npm/yarn)
- MongoDB Atlas account (or local MongoDB)
- Python 3.8+ (for Flask backend)

### 1. Clone the repository

```bash
# Using HTTPS
git clone https://github.com/<your-username>/space-landing.git
cd space-landing
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```
MONGODB_URI=<your-mongodb-connection-string>
ADMIN_PASSWORD=<your-admin-password>
```

### 4. Start the Next.js app (local)

```bash
pnpm dev
# or
npm run dev
```

App will run at [http://localhost:3000](http://localhost:3000)

### 5. Set up the Python Flask backend

- Go to the Flask backend directory (not included in this repo)
- Install dependencies:
  ```bash
  pip install flask flask-cors pandas
  ```
- Start the Flask server:
  ```bash
  python app.py
  ```
- Deploy Flask backend to Railway or similar, and update the URL in `/app/api/submit/route.ts`

### 6. Deploy to Vercel

- Push your code to GitHub
- Import the repo in [Vercel](https://vercel.com/import)
- Set environment variables in Vercel dashboard
- Deploy!

## Usage

- Go to `/submit` to upload CSV files and run correlation
- View results and dashboard at `/dashboard`
- Download correlated results as CSV
- All correlated data is stored in MongoDB for later analysis

## Folder Structure

```
app/           # Next.js app routes and pages
components/    # React UI components
lib/           # Database models, utility functions
public/        # Static assets (images, videos, pdfs)
styles/        # Global CSS
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

For any questions or support, open an issue or contact the maintainer.
