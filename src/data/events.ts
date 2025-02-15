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

export const upcomingEvents: Event[] = [
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
        featured: true,
        posterImage: "/events/ice-bowl-poster-2025.jpg",
    }
];

export const getNextEvent = (): Event | undefined => {
    if (upcomingEvents.length === 0) return undefined;
    return upcomingEvents[0];
}; 