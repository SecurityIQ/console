import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'
export default defineConfig({
  schema: "./app/.server/schema.ts",
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: env.NEON_DATABASE_URL,
  }
})