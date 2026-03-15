declare module 'express' {
  export type Request = any;
  export type Response = any;
  export type NextFunction = any;
  const express: any;
  export const static: any;
  export default express;
}

declare module 'cors';
declare module 'helmet';
declare module 'compression';
declare module 'express-rate-limit';
declare module 'dotenv';
declare module 'http';
declare module 'socket.io';
declare module 'axios';
declare module 'fs';
declare module 'path';
declare module 'winston';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test';
    PORT?: string;
    DATABASE_URL?: string;
    VITE_API_URL?: string;
    FRONTEND_URL?: string;
    LOG_LEVEL?: string;
  }
}

declare const __dirname: string;
declare const process: any;
