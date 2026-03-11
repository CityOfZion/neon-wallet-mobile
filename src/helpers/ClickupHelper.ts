import axios from 'axios'

import { EnvHelper } from './EnvHelper'

import type { TClickupHelperCreateSupportTicketParams } from '@/types/helpers'

export class ClickupHelper {
  static #getApi() {
    if (
      !EnvHelper.EXPO_PUBLIC_CLICK_UP_LIST_ID ||
      !EnvHelper.EXPO_PUBLIC_CLICK_UP_API_KEY ||
      !EnvHelper.EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID
    ) {
      throw new Error('ClickUp API credentials are not properly set in environment variables.')
    }

    const api = axios.create({
      baseURL: `https://api.clickup.com/api/v2/list/${EnvHelper.EXPO_PUBLIC_CLICK_UP_LIST_ID}`,
      headers: {
        Authorization: EnvHelper.EXPO_PUBLIC_CLICK_UP_API_KEY,
      },
    })

    api.interceptors.request.use(config => {
      config.data = {
        status: 'development',
        priority: 3, // Normal priority
        assignees: [EnvHelper.EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID],
        ...config.data,
      }

      return config
    })

    return api
  }

  static async createSupportTicket({ name, email, description }: TClickupHelperCreateSupportTicketParams) {
    const finalDescription = [`- Name: ${name}`, `- Email: ${email}`, '- Description:', description].join('\n')

    const api = ClickupHelper.#getApi()

    await api.post('/task', {
      name: `NWM - Help - ${name}`,
      markdown_content: finalDescription,
      tags: ['ProductSupport'],
    })
  }

  static async createFeedbackTicket(description: string) {
    const api = ClickupHelper.#getApi()

    await api.post('/task', {
      name: 'NWM - Feedback',
      markdown_content: description,
      tags: ['Feedback'],
    })
  }
}
