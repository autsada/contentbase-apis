declare module "http" {
  interface IncomingMessage {
    rawBody?: string
  }
}

export type Environment = "production" | "development" | "staging"
