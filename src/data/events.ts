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
const allEvents: Event[] = [
    {
        date: {
            day: "6",
            month: "MAR",
            year: "2025"
        },
        title: "Winter Putting League Kickoff",
        location: "TeeBox indoor golf, 340 Freshwater Road, St. John's",
        description: "Join us for the start of our six week long putting league! $5/person each week, weekly prizes, and overall champion trophy.",
        featured: true,
        posterImage: "/events/winter-putting-league-poster-2025.PNG"
    },
    {
        date: {
            day: "16",
            month: "FEB",
            year: "2025"
        },
        title: "St. John's ChillFest Ice Bowl 2025",
        location: "McNiven DiscGolfPark, St. John's",
        registrationUrl: "https://www.discgolfscene.com/tournaments/St_Johns_ChillFest_Ice_Bowl_2025",
        description: "Join us for St. John's first Ice Bowl! This charity event supports The Gathering Place while promoting disc golf in our community. Your registration includes a 2025 DGNL Membership with bag tag, 2025 ADG membership with custom wood mini, and a disc.",
        featured: false,
        posterImage: "/events/ice-bowl-poster-2025.jpg",
    }
];

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