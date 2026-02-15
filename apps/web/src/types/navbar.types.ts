import { z } from 'zod';

const NAVBAR_VALIDATION = z.object({
  name: z.string('Name is required'),
  link: z.string('Link of the page is required'),
});

export type navbarType = z.infer<typeof NAVBAR_VALIDATION>;
