# 📋 FutsalReservation

> Sistema di prenotazione per un campo da calcio, con frontend React (Next.js) e backend Node.js (Express).  
> Progetto fullstack pensato per essere semplice, chiaro e pronto all’estensione.

---

## 📁 Struttura del progetto

```
futsal-reservation/
├── frontend/       # Next.js (React) - interfaccia utente
└── backend/        # Express.js - API REST + storage su file
```

---

## 🚀 Come avviare il progetto in locale

### Prerequisiti
- Node.js (v18+)
- npm (v9+)
- (Consigliato: usare IntelliJ o VS Code)

---

## 📦 Setup del backend (`/backend`)

```bash
cd backend
npm install
node index.js
```

✅ Il backend sarà accessibile su `http://localhost:8080`

---

## 💻 Setup del frontend (`/frontend`)

```bash
cd frontend
npm install
npm run dev
```

✅ Il frontend sarà visibile su `http://localhost:3000`

---

## 📡 API disponibili (backend Express)

| Metodo | Endpoint                     | Descrizione                            |
|--------|------------------------------|----------------------------------------|
| GET    | `/api/slots?date=YYYY-MM-DD` | Ritorna slot orari disponibili         |
| POST   | `/api/slots`                 | Crea una prenotazione (JSON: `date`, `time`) |
| GET    | `/api/bookings`              | Ritorna tutte le prenotazioni          |

---

## 🗂️ Storage attuale

Le prenotazioni vengono salvate in un file JSON:

```
backend/data/bookings.json
```

> In futuro sarà possibile sostituire con un database come SQLite o PostgreSQL.

---

## 📅 Roadmap (TODO)

- [x] Slot orari statici dalle 09:00 alle 20:00
- [ ] Admin dashboard
- [ ] Selezione data da calendario
- [ ] Prenotazioni ricorrenti
- [ ] Login (autenticazione)
- [ ] Pagamento online (Stripe)

---

## 🙋‍♂️ Come contribuire

1. Fai fork del progetto
2. Crea un branch (`feature/nome-feature`)
3. Fai commit dei tuoi cambiamenti
4. Fai push su GitHub
5. Apri una pull request

---

## 📄 Licenza

MIT License
