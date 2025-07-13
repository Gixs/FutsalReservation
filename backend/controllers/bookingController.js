import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSlots } from '../utils/slotGenerator.js';

// Permette compatibilità __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, '../data/bookings.json');

// Leggi i dati dal file JSON
function readBookings() {
    if (!fs.existsSync(dataFile)) return [];
    const raw = fs.readFileSync(dataFile);
    return JSON.parse(raw);
}

// Scrivi i dati nel file JSON
function writeBookings(bookings) {
    fs.writeFileSync(dataFile, JSON.stringify(bookings, null, 2));
}

export const getSlots = (req, res) => {
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "Data mancante" });

    const bookings = readBookings();
    const bookedTimes = bookings
        .filter(b => b.date === date)
        .map(b => b.time);

    const slots = generateSlots().map(time => ({
        time,
        available: !bookedTimes.includes(time),
    }));

    res.json(slots);
};

export const createBooking = (req, res) => {
    const { date, time } = req.body;
    if (!date || !time) return res.status(400).json({ message: "Dati incompleti" });

    const bookings = readBookings();

    const alreadyBooked = bookings.some(b => b.date === date && b.time === time);
    if (alreadyBooked) {
        return res.status(409).json({ message: "Slot già prenotato" });
    }

    const newBooking = { id: Date.now(), date, time };
    bookings.push(newBooking);
    writeBookings(bookings);

    res.status(201).json(newBooking);
};

export const getAllBookings = (req, res) => {
    const bookings = readBookings();
    res.json(bookings);
};
