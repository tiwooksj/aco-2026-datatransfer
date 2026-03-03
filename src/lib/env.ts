import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Admin Auth (Demo MVP)
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(8).default('admin1234'),

  // Notion
  NOTION_API_KEY: z.string().optional(),
  NOTION_DATABASE_ID: z.string().optional(),
  NOTION_DB_ANOMALY_ALERTS: z.string().optional(),
  NOTION_DB_AI_ANALYSIS: z.string().optional(),
  NOTION_DB_INCIDENT_REPORTS: z.string().optional(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NOTION_DB_ANOMALY_ALERTS: process.env.NOTION_DB_ANOMALY_ALERTS,
  NOTION_DB_AI_ANALYSIS: process.env.NOTION_DB_AI_ANALYSIS,
  NOTION_DB_INCIDENT_REPORTS: process.env.NOTION_DB_INCIDENT_REPORTS,
})

export type Env = z.infer<typeof envSchema>
