import type {
  Payload,
  SanitizedDocumentPermissions,
  SanitizedGlobalConfig,
  TypedUser,
} from 'payload'

import { describe, expect, it, vi } from 'vitest'

import { getVersions } from './getVersions.js'

describe('getVersions', () => {
  it('selects global status when checking for a published document', async () => {
    const findGlobal = vi.fn().mockResolvedValue({
      _status: 'published',
      updatedAt: '2026-07-02T00:00:00.000Z',
    })
    const payload = {
      config: {},
      countGlobalVersions: vi.fn().mockResolvedValue({ totalDocs: 0 }),
      findGlobal,
      findGlobalVersions: vi.fn().mockResolvedValue({ docs: [] }),
    } as unknown as Payload

    const result = await getVersions({
      doc: { _status: 'draft' },
      docPermissions: { readVersions: true } as unknown as SanitizedDocumentPermissions,
      globalConfig: {
        fields: [],
        slug: 'settings',
        versions: { drafts: { autosave: true } },
      } as unknown as SanitizedGlobalConfig,
      payload,
      user: {} as TypedUser,
    })

    expect(findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          _status: true,
          updatedAt: true,
        },
      }),
    )
    expect(result.hasPublishedDoc).toBe(true)
  })
})
