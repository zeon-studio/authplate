import { PADDLE_ENV } from "@/config/paddle";
import { LogLevel, Paddle, PaddleOptions } from "@paddle/paddle-node-sdk";

export function getPaddleInstance() {
  const paddleOptions: PaddleOptions = {
    environment: PADDLE_ENV,
    logLevel: LogLevel.error,
  };

  if (!process.env.PADDLE_API_KEY) {
    throw new Error("Paddle API key is missing");
  }

  return new Paddle(process.env.PADDLE_API_KEY, paddleOptions);
}
