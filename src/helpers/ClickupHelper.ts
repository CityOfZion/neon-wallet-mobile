import axios from 'axios'

import type { TClickupHelperCreateSupportTicketParams } from '@/types/helpers'

export class ClickupHelper {
  static async createSupportTicket({ name, email, description }: TClickupHelperCreateSupportTicketParams) {
    const finalDescription = [`- Name: ${name}`, `- Email: ${email}`, '- Description:', description].join('\n')

    const normalPriority = 3

    await axios.post(
      `https://api.clickup.com/api/v2/list/${process.env.EXPO_PUBLIC_CLICK_UP_LIST_ID}/task`,
      {
        name: `NWM - Help - ${name}`,
        markdown_content: finalDescription,
        tags: ['ProductSupport'],
        status: 'development',
        priority: normalPriority,
        assignees: [process.env.EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID],
      },
      {
        headers: {
          Authorization: process.env.EXPO_PUBLIC_CLICK_UP_KEY,
        },
      }
    )
  }
}
