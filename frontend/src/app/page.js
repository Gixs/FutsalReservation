"use client";

import { useState, useEffect } from "react";
import { fetchSlots } from "./bookingApi";

export default function Home() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSlots(today);
        setSlots(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [today]);

  const handleBooking = async (time) => {
    try {
      const res = await fetch("http://localhost:8080/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, time }),
      });

      if (res.status === 409) {
        alert("Slot già prenotato");
        return;
      }

      if (!res.ok) {
        alert("Errore nella prenotazione");
        return;
      }

      alert(`Hai prenotato lo slot delle ${time}`);
      const updated = await fetchSlots(today);
      setSlots(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <main className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-black">Prenotazione Campo da Calcio</h1>

        {loading ? (
            <p>Caricamento slot...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot, i) => (
                  <div
                      key={i}
                      className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
                  >
                    <span className="text-lg font-medium text-black">{slot.time}</span>
                    {slot.available ? (
                        <button
                            onClick={() => handleBooking(slot.time)}
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                        >
                          Prenota
                        </button>
                    ) : (
                        <span className="text-red-500 font-semibold">Occupato</span>
                    )}
                  </div>
              ))}
            </div>
        )}
      </main>
  );
}
