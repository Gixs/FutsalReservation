// utils/slotGenerator.js
export const generateSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(time);
    }
    return slots;
};
