export const MONTHS = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
} as const;

export interface EventMedia {
    url: string;
    type: 'image' | 'video';
    altText: string;
    event: {
        id: string;
        name: string;
        date: Date;
    };
    featured?: boolean;
}

const eventMedia: EventMedia[] = [
    // Videos
    {
        url: "/events/ice-bowl-2025/Messenger_creation_43FFD0EB-408C-4884-85DE-7E42A2FED8D7.mp4",
        type: "video",
        altText: "Ice Bowl video clip",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_C7919F1B-98D9-40CA-9034-C122FF7FFE0F~2.mp4",
        type: "video",
        altText: "Ice Bowl video clip",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/received_596301666611877.mp4",
        type: "video",
        altText: "Ice Bowl video clip",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/received_668851465518369.mp4",
        type: "video",
        altText: "Ice Bowl video clip",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    // Photos
    {
        url: "/events/ice-bowl-2025/PXL_20250216_170838629.MP.jpg",
        type: "image",
        altText: "Group photo at Ice Bowl",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        },
        featured: true
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_124701519.jpg",
        type: "image",
        altText: "Player teeing off",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_164405240.jpg",
        type: "image",
        altText: "Winter course conditions",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_140905476.jpg",
        type: "image",
        altText: "Snowy course view",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_132503816.MP~2.jpg",
        type: "image",
        altText: "Player putting",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_197C3D5B-9CB1-4218-8FDC-B790478C0B03.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_2A0E27DC-2BBE-41C6-B70C-C7D1CE54D7E6.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_357AD7FE-FD17-44DA-910B-767A3175A95B~2.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_67EF1128-B26E-4A3B-97C2-325D6A5A6FFB.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_6F880FFD-DA7B-47A0-9483-78C7151724F9.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_97D662F4-7AC6-4E91-8095-527FF70B8B55.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_B78759D9-1B5D-49F0-B9DE-2CC7D7739859.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_C8133410-826B-4E38-9CDE-65A9DAD6C2EF.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_CA994F26-46DD-46BA-A5AA-52E77F238494.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/Messenger_creation_F614BC81-FE1A-42D0-9FC9-65160E7ECBE1.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_122944077.MP~2.jpg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_130722732.MP~2.jpg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_134346963.MP.jpg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_141233674.jpg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/PXL_20250216_170819783.jpg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/image0 (1).jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/image1 (1).jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/received_1842603529846643.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    },
    {
        url: "/events/ice-bowl-2025/received_657404843383865.jpeg",
        type: "image",
        altText: "Ice Bowl action shot",
        event: {
            id: "ice-bowl-2025",
            name: "St. John's ChillFest Ice Bowl 2025",
            date: new Date(2025, MONTHS.FEB, 16)
        }
    }
];

export const getAllEventMedia = (): EventMedia[] => {
    return eventMedia;
};

export const getEventMediaByEventId = (eventId: string): EventMedia[] => {
    return eventMedia.filter(media => media.event.id === eventId);
};

export const getFeaturedEventMedia = (): EventMedia[] => {
    return eventMedia.filter(media => media.featured);
};

export const getUniqueEvents = () => {
    const events = new Map();
    eventMedia.forEach(media => {
        if (!events.has(media.event.id)) {
            events.set(media.event.id, media.event);
        }
    });
    return Array.from(events.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
}; 