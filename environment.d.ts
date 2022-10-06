declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      MONGODB_URL?: string;
      DATABASE_URL: string;
      BASE_HREF: string;
      S3_ENDPOINT: string;
      S3_SECRET: string;
      S3_ACCESS_KEY: string;
    }
  }
}

export {};
