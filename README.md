# Hear-able web

React + Vite + Tailwind CSS v4. Contains the public landing page and the volunteer portal (`/relawan`).

## Running locally

```sh
cp .env.example .env.local   # point VITE_API_BASE_URL at the backend
npm install
npm run dev                  # http://localhost:5173
```

The backend allows `http://localhost:5173` through CORS by default. For production, add the deployed
web origin to the backend's `CORS_ORIGINS`.

## Routes

| Path | Page |
|---|---|
| `/` | Landing page: links to the API docs, the backend, web and mobile repos, and the APK download |
| `/relawan/daftar`, `/relawan/masuk` | Volunteer register and login (registration sends `role: "volunteer"`) |
| `/relawan` | Volunteer dashboard. Requires a volunteer account. |
| `/relawan/mendengar/baru` | Create a listening module (1–10 questions) |
| `/relawan/berbicara/baru` | Create a speaking module (1–10 sentences) |

## Listening module flow

1. The volunteer uploads one audio file per question. It is sent to
   `POST /v1/volunteer/listening/transcriptions`, which returns the transcription and a suggested
   question instruction. Nothing is stored yet.
2. The volunteer edits the **Transkripsi** and **Instruksi soal** fields, then sets the answer:
   multiple choice (2–4 options, one correct) or a free-text expected answer.
3. **Kirim modul** sends everything, audio included, to `POST /v1/volunteer/listening/modules`.
   AI assesses the difficulty, and the module is published. The result screen shows the level and
   the AI's reason.

User-facing text is in Bahasa Indonesia. The UI never uses the word "prompt"; the field is labelled
"Instruksi soal".

## Configuration

All links are `VITE_*` variables; see `.env.example`. Set `VITE_APK_URL` to the real download link.
