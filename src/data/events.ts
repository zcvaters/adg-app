interface Event {
    date: {
        day: string;
        month: string;
        year: string;
    };
    title: string;
    location: string;
    registrationUrl?: string;
    description: string;
    featured?: boolean;
    posterImage?: string;
}

// All events, both past and upcoming
// Add new events here when scheduled - otherwise visitors are directed to Facebook
const allEvents: Event[] = [];

const MONTHS = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
};

const isEventPast = (event: Event): boolean => {
    const now = new Date();
    const eventDate = new Date(
        parseInt(event.date.year),
        MONTHS[event.date.month as keyof typeof MONTHS],
        parseInt(event.date.day)
    );
    return eventDate < now;
};

export const upcomingEvents = (): Event[] => {
    return allEvents.filter(event => !isEventPast(event))
        .sort((a, b) => {
            const dateA = new Date(
                parseInt(a.date.year),
                MONTHS[a.date.month as keyof typeof MONTHS],
                parseInt(a.date.day)
            );
            const dateB = new Date(
                parseInt(b.date.year),
                MONTHS[b.date.month as keyof typeof MONTHS],
                parseInt(b.date.day)
            );
            return dateA.getTime() - dateB.getTime();
        });
};

export const pastEvents = (): Event[] => {
    return allEvents.filter(isEventPast)
        .sort((a, b) => {
            const dateA = new Date(
                parseInt(a.date.year),
                MONTHS[a.date.month as keyof typeof MONTHS],
                parseInt(a.date.day)
            );
            const dateB = new Date(
                parseInt(b.date.year),
                MONTHS[b.date.month as keyof typeof MONTHS],
                parseInt(b.date.day)
            );
            return dateB.getTime() - dateA.getTime(); // Most recent first
        });
};

export const getNextEvent = (): Event | undefined => {
    const upcoming = upcomingEvents();
    return upcoming.length > 0 ? upcoming[0] : undefined;
}; 