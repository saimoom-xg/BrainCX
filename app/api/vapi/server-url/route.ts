import { NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/calendar';
import { createBooking } from '@/lib/calendar';

/**
 * Vapi Server URL handler.
 *
 * Vapi sends POST requests to this endpoint whenever the assistant triggers
 * a tool call (e.g. check_calendar_availability, create_calendar_booking).
 *
 * Request format from Vapi:
 * {
 *   "message": {
 *     "type": "tool-calls",
 *     "toolCalls": [{ "id": "...", "function": { "name": "...", "arguments": {...} } }]
 *   }
 * }
 *
 * Expected response:
 * {
 *   "results": [{ "toolCallId": "...", "result": "..." }]
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;

    // Only handle tool-calls messages; acknowledge others with 200
    if (!message || message.type !== 'tool-calls') {
      return NextResponse.json({}, { status: 200 });
    }

    const toolCalls: Array<{
      id: string;
      type: string;
      function: { name: string; arguments: Record<string, string> };
    }> = message.toolCalls ?? message.toolCallList ?? [];

    const results = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const fnName = toolCall.function.name;
        // Vapi may send arguments as a string or parsed object
        const args =
          typeof toolCall.function.arguments === 'string'
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments;

        let result: unknown;

        try {
          if (fnName === 'check_calendar_availability') {
            result = await checkAvailability(args);
          } else if (fnName === 'create_calendar_booking') {
            result = await createBooking(args);
          } else {
            result = { error: `Unknown tool: ${fnName}` };
          }
        } catch (err) {
          console.error(`[vapi/server-url] Tool "${fnName}" error:`, err);
          result = {
            success: false,
            message: `Tool "${fnName}" encountered an error.`,
          };
        }

        return {
          toolCallId: toolCall.id,
          result: typeof result === 'string' ? result : JSON.stringify(result),
        };
      }),
    );

    return NextResponse.json({ results });
  } catch (err) {
    console.error('[vapi/server-url] Failed to process request:', err);
    return NextResponse.json(
      { error: 'Failed to process tool call.' },
      { status: 500 },
    );
  }
}
