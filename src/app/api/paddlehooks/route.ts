import { getPaddleInstance } from "@/lib/paddle/getPaddleInstance";
import { ProcessWebhook } from "@/lib/paddle/processWebhook";
import { NextRequest } from "next/server";

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature") || "";
  const privateKey = process.env["PADDLE_NOTIFICATION_WEBHOOK_SECRET"] || "";
  const rawRequestBody = await request.text();
  let status, eventName;

  try {
    if (signature && rawRequestBody) {
      const paddle = getPaddleInstance();
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        privateKey,
        signature,
      );
      status = 200;
      eventName = eventData?.eventType ?? "Unknown event";
      if (eventData) {
        await webhookProcessor.processEvent(eventData);
      }
    } else {
      status = 400;
      console.log("Missing signature from header");
    }
  } catch (e: unknown) {
    console.log(e);
    // Handle error
    status = 500;
  }
  return Response.json({ status, eventName });
}
