'use server';

import { api, ApiError, type ShortUrl } from '@/lib/api';
import type { ActionState } from './types';

export async function listUrlsAction(): Promise<ActionState<ShortUrl[]>> {
  try {
    return { data: (await api.listUrls()).urls };
  } catch (reason) {
    if (reason instanceof ApiError && reason.status === 404)
      return { data: [] };
    return {
      error: reason instanceof Error ? reason.message : 'Unable to load links.',
    };
  }
}

export async function createShortUrlAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await api.createShortUrl(String(formData.get('url') ?? '').trim());
    return { message: 'Link shortened successfully.' };
  } catch (reason) {
    return {
      error:
        reason instanceof Error ? reason.message : 'Unable to shorten URL.',
    };
  }
}

export async function updateUrlTitleAction(
  code: string,
  _state: ActionState<{ title: string }>,
  formData: FormData,
): Promise<ActionState<{ title: string }>> {
  try {
    const result = await api.updateUrlTitle(
      code,
      String(formData.get('title') ?? '').trim(),
    );
    return { data: { title: result['new-title'] } };
  } catch (reason) {
    return {
      error:
        reason instanceof Error ? reason.message : 'Unable to update title.',
    };
  }
}

export async function generateQrCodeAction(
  code: string,
): Promise<ActionState<string>> {
  try {
    return { data: (await api.generateQrCode(code)).qrcode };
  } catch (reason) {
    return {
      error:
        reason instanceof Error
          ? reason.message
          : 'Unable to generate QR Code.',
    };
  }
}

export async function accessUrlAction(
  code: string,
): Promise<ActionState<{ url: string; unauthorized?: boolean }>> {
  try {
    return { data: { url: (await api.accessUrl(code))['original-url'] } };
  } catch (reason) {
    return {
      error:
        reason instanceof Error
          ? reason.message
          : 'Unable to access this shortened link.',
      data: {
        url: '',
        unauthorized: reason instanceof ApiError && reason.status === 401,
      },
    };
  }
}
