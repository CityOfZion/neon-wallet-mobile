import axios from 'axios'

import type { TClickupHelperCreateSupportTicketParams } from '@/types/helpers'

export class ClickupHelper {
  static readonly #api = axios.create({
    baseURL: `https://api.clickup.com/api/v2/list/${process.env.EXPO_PUBLIC_CLICK_UP_LIST_ID}`,
    headers: {
      Authorization: process.env.EXPO_PUBLIC_CLICK_UP_KEY,
    },
  })

  static readonly #defaultParams = {
    status: 'development',
    priority: 3, // Normal priority
    assignees: [process.env.EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID],
  }

  static async createSupportTicket({ name, email, description }: TClickupHelperCreateSupportTicketParams) {
    const finalDescription = [`- Name: ${name}`, `- Email: ${email}`, '- Description:', description].join('\n')

    await ClickupHelper.#api.post('/task', {
      ...ClickupHelper.#defaultParams,
      name: `NWM - Help - ${name}`,
      markdown_content: finalDescription,
      tags: ['ProductSupport'],
    })
  }

  static async createFeedbackTicket(description: string) {
    await ClickupHelper.#api.post('/task', {
      ...ClickupHelper.#defaultParams,
      name: 'NWM - Feedback',
      markdown_content: description,
      tags: ['Feedback'],
    })
  }
}
