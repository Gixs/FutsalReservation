"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizer from "@/lib/calendarLocalizer";


export default function AdminCalendarPage() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editData, setEditData] = useState({ nome: "", telefono: "", date: "", time: "" });


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/bookings");
                const data = await res.json();

                const events = data.map((b) => {
                    const [hour, minute] = b.time.split(":").map(Number);
                    const start = new Date(`${b.date}T${b.time}`);
                    const end = new Date(start);
                    end.setHours(start.getHours() + 1);

                    return {
                        id: b.id,
                        title: `${b.nome} (${b.telefono})`,
                        start,
                        end,
                    };
                });

                setBookings(events);
            } catch (err) {
                console.error("Errore durante il recupero delle prenotazioni", err);
            }
        };

        fetchBookings();
    }, []);

    const handleEventClick = (event) => {
        setSelectedBooking(event);
        const dataISO = event.start.toISOString().split("T")[0];
        const timeStr = event.start.toTimeString().slice(0, 5);
        setEditData({
            nome: event.title.split(" (")[0],
            telefono: event.title.split("(")[1].replace(")", ""),
            date: dataISO,
            time: timeStr,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        const conferma = window.confirm("Confermi la cancellazione?");
        if (!conferma) return;

        try {
            const res = await fetch(`http://localhost:8080/api/bookings/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                alert("Errore nella cancellazione");
                return;
            }

            setBookings((prev) => prev.filter((b) => b.id !== id));
            setSelectedBooking(null);
        } catch (err) {
            console.error("Errore durante la cancellazione", err);
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:8080/api/bookings/${selectedBooking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });

            if (!res.ok) {
                alert("Errore nell'aggiornamento");
                return;
            }

            alert("Prenotazione aggiornata");
            setSelectedBooking(null);
            setEditData({ nome: "", telefono: "", date: "", time: "" });

            // ricarica eventi
            const updated = await fetch("http://localhost:8080/api/bookings");
            const data = await updated.json();

            const events = data.map((b) => {
                const start = new Date(`${b.date}T${b.time}`);
                const end = new Date(start);
                end.setHours(start.getHours() + 1);

                return {
                    id: b.id,
                    title: `${b.nome} (${b.telefono})`,
                    start,
                    end,
                };
            });

            setBookings(events);
        } catch (err) {
            console.error("Errore aggiornamento:", err);
        }
    };



    return (
        <main className="p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black">Calendario Prenotazioni</h1>
            <Calendar
                localizer={localizer}
                events={bookings}
                startAccessor="start"
                endAccessor="end"
                style={{height: 600}}
                onSelectEvent={handleEventClick}
            />
            {selectedBooking && (
                <form
                    onSubmit={handleUpdate}
                    className="bg-white shadow mt-6 p-4 rounded max-w-md"
                >
                    <h2 className="text-xl font-semibold mb-2">Modifica prenotazione</h2>

                    <input
                        name="nome"
                        value={editData.nome}
                        onChange={(e) => handleEditChange(e)}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Nome"
                        required
                    />

                    <input
                        name="telefono"
                        value={editData.telefono}
                        onChange={(e) => handleEditChange(e)}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Telefono"
                        required
                    />

                    <input
                        name="date"
                        type="date"
                        value={editData.date}
                        onChange={(e) => handleEditChange(e)}
                        className="w-full mb-2 p-2 border rounded"
                        required
                    />

                    <input
                        name="time"
                        type="time"
                        value={editData.time}
                        onChange={(e) => handleEditChange(e)}
                        className="w-full mb-4 p-2 border rounded"
                        required
                    />

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Salva modifiche
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(selectedBooking.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cancella
                        </button>
                    </div>
                </form>
            )}

            <a href="/" className="inline-block mt-6 text-blue-600 underline">
                ← Torna alla homepage
            </a>
        </main>

    );
}
