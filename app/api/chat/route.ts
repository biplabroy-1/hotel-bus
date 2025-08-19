import { NextResponse } from "next/server";
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ reply: "Please provide a message." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "GROQ API key is missing from environment variables." },
        { status: 500 }
      );
    }

    // Create AI response stream
    const response = await streamText({
      model: groq("llama3-70b-8192"),
      prompt: message,
      system: "You are a helpful assistant.",
    });

    // Convert to SSE format
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response.textStream) {
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
