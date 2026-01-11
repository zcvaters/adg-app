import { defineCollection, z } from 'astro:content';

const minutes = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date(),
        attendees: z.array(z.string()).optional(),
    }),
});

export const collections = {
    minutes,
};
