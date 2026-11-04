// "2024-02-08" (value of <input type="date">) -> "08-02-2024"
// Splitting the string avoids timezone shifts from new Date("yyyy-mm-dd").
export const formatDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
};

// "08-02-2024" -> "2024-02-08" (to pre-fill <input type="date">)
export const toInputDate = (value) => {
    if (!value) return "";
    const [day, month, year] = value.split("-");
    return `${year}-${month}-${day}`;
};
