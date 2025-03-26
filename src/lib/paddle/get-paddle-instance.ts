import { LogLevel, Paddle, PaddleOptions } from "@paddle/paddle-node-sdk";
import { ENV } from "../constant";

export function getPaddleInstance() {
  const paddleOptions: PaddleOptions = {
    environment: ENV,
    logLevel: LogLevel.error,
  };

  if (!process.env.PADDLE_API_KEY) {
    throw new Error("Paddle API key is missing");
  }

  return new Paddle(process.env.PADDLE_API_KEY, paddleOptions);
}
