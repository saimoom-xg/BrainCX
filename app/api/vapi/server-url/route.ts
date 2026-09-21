import { NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/calendar';
import { createBooking } from '@/lib/calendar';

/**
 * Vapi Server URL Webhook Handler.
 *
 * Handles tool calls sent by Vapi when an assistant invokes a tool.
 * Supports all payload variations: `toolCallList`, `toolCalls`, `toolWithToolCallList`.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body?.message || body;

    console.log('[vapi/server-url] Received type:', message?.type);

    // If not a tool call (e.g. status-update, transcript, conversation-update), return 200 immediately
    if (message?.type && message.type !== 'tool-calls') {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Extract tool calls from any known Vapi structure
    const rawList: any[] =
      message?.toolCallList ||
      message?.toolCalls ||
      message?.toolWithToolCallList ||
      body?.toolCallList ||
      body?.toolCalls ||
      [];

    if (!rawList.length) {
      console.warn('[vapi/server-url] No tool calls found in message:', JSON.stringify(body));
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const results = await Promise.all(
      rawList.map(async (item: any) => {
        const rawCall = item?.toolCall || item;
        const toolCallId = rawCall?.id || item?.id || 'unknown';
        const fnName =
          rawCall?.function?.name ||
          rawCall?.name ||
          item?.function?.name ||
          item?.name ||
          '';

        let args =
          rawCall?.function?.arguments ??
          rawCall?.arguments ??
          rawCall?.parameters ??
          item?.function?.arguments ??
          item?.arguments ??
          item?.parameters ??
          {};

        if (typeof args === 'string') {
          try {
            args = JSON.parse(args);
          } catch {
            args = {};
          }
        }

        console.log(`[vapi/server-url] Executing "${fnName}" with args:`, JSON.stringify(args));

        let result: unknown;

        try {
          if (fnName === 'check_calendar_availability') {
            result = await checkAvailability(args);
          } else if (fnName === 'create_calendar_booking') {
            result = await createBooking(args);
          } else {
            console.warn(`[vapi/server-url] Unknown tool name: "${fnName}"`);
            result = {
              success: false,
              message: `Tool "${fnName}" is not supported.`,
            };
          }
        } catch (err: any) {
          console.error(`[vapi/server-url] Error executing "${fnName}":`, err);
          result = {
            success: false,
            message: `Execution failed: ${err?.message || 'internal error'}`,
          };
        }

        console.log(`[vapi/server-url] Result for "${fnName}":`, JSON.stringify(result));

        return {
          toolCallId,
          result: typeof result === 'string' ? result : JSON.stringify(result),
        };
      }),
    );

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    console.error('[vapi/server-url] Top-level handler error:', err);
    // Even on unexpected error, return 200 with empty results so Vapi does not eject the call
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
