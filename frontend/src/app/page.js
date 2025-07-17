"use client";

import { useState, useEffect } from "react";
import { fetchSlots } from "./bookingApi";

function getNextHour(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  const nextHour = (hour + 1).toString().padStart(2, "0");
  return `${nextHour}:${minute.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ nome: "", telefono: "" });

  useEffect(() => {
    fetchSlots(today)
        .then(setSlots)
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [today]);

  const openForm = (time) => {
    setSelectedSlot(time);
    setFormVisible(true);
  };

  const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today,
        time: selectedSlot,
        ...formData,
      }),
    });

    if (res.status === 409) {
      alert("Slot già prenotato");
    } else if (!res.ok) {
      alert("Errore nella prenotazione");
    } else {
      alert("Prenotazione confermata");
      setFormVisible(false);
      setFormData({ nome: "", telefono: "" });
      const updated = await fetchSlots(today);
      setSlots(updated);
    }
  };

  return (
      <main className="min-h-screen p-6 bg-gray-100 text-black">
        <h1 className="text-3xl font-bold mb-6">Prenotazione Campo da Calcio</h1>

        {formVisible && (
            <form
                onSubmit={handleSubmit}
                className="mb-6 bg-white p-4 rounded shadow max-w-md"
            >
              <h2 className="text-xl mb-2 font-semibold">
                Prenota {selectedSlot} - {getNextHour(selectedSlot)}
              </h2>
              <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome"
                  required
                  className="w-full mb-2 p-2 border rounded"
              />
              <input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Telefono"
                  required
                  className="w-full mb-2 p-2 border rounded"
              />
              <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Conferma prenotazione
              </button>
            </form>
        )}

        {loading ? (
            <p>Caricamento slot...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot, i) => (
                  <div
                      key={i}
                      className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
                  >
              <span className="text-lg font-medium">
                {slot.time} - {getNextHour(slot.time)}
              </span>
                    {slot.available ? (
                        <button
                            onClick={() => openForm(slot.time)}
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
