import { Environment } from "@paddle/paddle-node-sdk";

export const PADDLE_API_KEY = process.env.NEXT_PUBLIC_PADDLE_KEY!;
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!;
export const PADDLE_ENV = process.env.NEXT_PUBLIC_PADDLE_ENV as Environment;
