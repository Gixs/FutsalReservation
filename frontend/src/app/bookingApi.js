// src/app/bookingApi.js
export async function fetchSlots(date) {
    const res = await fetch(`http://localhost:8080/api/slots?date=${date}`);
    if (!res.ok) throw new Error("Errore nel recupero degli slot");
    return res.json();
}
