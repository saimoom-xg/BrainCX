export const vapiToolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'check_calendar_availability',
      description: 'Check live Google Calendar availability through the calendar integration.',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Meeting date in YYYY-MM-DD format.' },
          start_time: { type: 'string', description: 'Requested range start in HH:mm.' },
          end_time: { type: 'string', description: 'Requested range end in HH:mm.' },
          timezone: { type: 'string', description: 'IANA timezone identifier.' },
        },
        required: ['date', 'start_time', 'end_time', 'timezone'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_calendar_booking',
      description: 'Create a Google Calendar meeting after the visitor confirms all details.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' }, email: { type: 'string' }, date: { type: 'string' },
          start_time: { type: 'string' }, end_time: { type: 'string' }, timezone: { type: 'string' },
        },
        required: ['name', 'email', 'date', 'start_time', 'end_time', 'timezone'],
      },
    },
  },
] as const;