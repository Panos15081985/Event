// Older saved data may contain tickets as strings ("2").
// Convert them to numbers so that +1 / -1 calculations work.
export const normalizeGuests = (gaeste) =>
    (Array.isArray(gaeste) ? gaeste : []).map((gast) => ({
        ...gast,
        Ticket: Number(gast.Ticket) || 0,
        Rticket: Number(gast.Rticket) || 0,
        Position: {
            Table: gast.Position?.Table || [],
            Tickets: (gast.Position?.Tickets || []).map(Number),
        },
    }));
