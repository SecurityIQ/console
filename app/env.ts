import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        NEON_DATABASE_URL: z.string().url(),
    },
    client: {},
    clientPrefix: 'VITE_',
    runtimeEnv: process.env,
    emptyStringAsUndefined: true
})