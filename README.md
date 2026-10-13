# letter.com 💌

Send virtual, animated, pixel-cute letters to your friends.

## Project structure

```
letter-com/
├── client/                      # React + Vite frontend
│   ├── index.html
│   ├── tailwind.config.js       # pixel-cute design tokens (colors, shadows, fonts)
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx              # routes + auth guard
│       ├── api.js               # fetch client for the Express API
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── styles/
│       │   ├── globals.css      # Tailwind entry + base styles
│       │   └── pixel.css        # ⭐ the Uiverse-style pixel UI kit
│       └── components/
│           ├── UI/
│           │   ├── PixelButton.jsx
│           │   └── PixelCard.jsx
│           ├── Nav/
│           │   ├── Navbar.jsx
│           │   └── ProfileDrawer.jsx # ⭐ profile drawer with inbox, sent history & delete
│           ├── Auth/
│           │   ├── Login.jsx
│           │   └── Signup.jsx
│           ├── Compose/
│           │   ├── Compose.jsx  # ⭐ the envelope → paper → send → flight sequence
│           │   ├── Envelope.jsx
│           │   └── LetterPaper.jsx
│           └── Inbox/
│               ├── Inbox.jsx
│               └── LetterCard.jsx
│
└── server/                      # Node + Express backend
    ├── index.js
    ├── data/db.js                # MongoDB connection with Mongoose & serverless caching
    ├── middleware/auth.js        # JWT verification
    ├── models/
    │   ├── User.js              # Mongoose User schema (username, password, timestamp)
    │   └── Letter.js            # Mongoose Letter schema (sender, recipient, content, timestamp)
    └── routes/
        ├── auth.js               # signup, login, /me, username availability
        ├── users.js               # recipient lookup
        └── letters.js             # send, inbox, sent history, read, delete
```

## Running it locally

**1. Backend**

```bash
cd server
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
```

**2. Frontend** (separate terminal)

```bash
cd client
npm install
npm run dev         # http://localhost:5173, proxies /api to :4000
```

Sign up two accounts in two browser windows (or one normal + one incognito) to send a letter between them.

## How the envelope animation works

`Compose.jsx` is a small state machine with these stages:

`recipient → closed → open → writing → closing → sealed → flying → sent`

- **closed → open**: the envelope flap (a `motion.div` rotated on its top edge) rotates back like a real flap.
- **open → writing**: the small "peek" paper and the full-screen editor share a Framer Motion `layoutId="paper"`, so clicking it triggers an automatic, physically smooth shared-element transition from a tiny rectangle to a full writing surface — no manual keyframes needed.
- **writing → closing**: swapping back to the small "peek" paper (same `layoutId`) reverses that same transition, folding the paper back down into the envelope.
- **closing → sealed**: the flap rotates shut and a wax-seal `motion.div` pops in with a spring.
- **sealed → flying**: the whole envelope is swapped (via `AnimatePresence`) for a paper airplane emoji that flies off-screen with a simple keyframe animation.
- **flying → sent**: a confirmation card fades in, and `write another` resets the whole machine.

The actual `POST /api/letters` call fires in parallel with the flight animation so the UI never blocks on the network.

## Design tokens

Defined in `tailwind.config.js` and `pixel.css`:

- **Palette**: cream `#FFF6EA`, blush `#FFD6E8`, petal `#FFB5C6`, mint `#B8E8D4`, sky `#AEDFF7`, lilac `#C9B6E4`, marigold `#F4C95D`, ink (outline) `#4A3B32`.
- **Type**: `Press Start 2P` for pixel headings/buttons, `Patrick Hand` for handwritten letter text, `Quicksand` for UI body copy.
- **Signature interaction**: the `.pixel-btn` class — a chunky button that sits on a solid offset shadow and physically depresses into that shadow on press/tap, the same tactile trick used by popular Uiverse.io 8-bit button snippets.

## Environment Variables & Deployment

### Server `.env`
Add the following to `server/.env`:
```env
PORT=4000
JWT_SECRET=your-secure-jwt-secret
MONGO_URI=mongodb://127.0.0.1:27017/letter-com
```
*(For MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/letter-com?retryWrites=true&w=majority`)*

### Vercel Settings
In your Vercel project dashboard under **Settings → Environment Variables**, add:
1. `MONGO_URI`: Your MongoDB Atlas connection URI.
2. `JWT_SECRET`: A long random secret string.

### Multi-Tab Session Isolation
Client sessions are scoped via `sessionStorage`. This allows opening multiple tabs in the same browser to log into different accounts (e.g., Alice and Bob) simultaneously without session overwrites or conflicts.

