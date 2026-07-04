import type { HeadingTagType } from '@lexical/rich-text'

import type { NodeValidation } from '../../typesServer.js'
import type { SerializedHeadingNode } from './schema.js'

/**
 * Runtime validation for `heading` nodes saved through the API.
 *
 * The editor always populates `tag`, but programmatic callers (REST/local API,
 * MCP tools, migration scripts) can omit it, persisting a malformed node that
 * breaks any renderer reading `node.tag`. `createHeadingJSONSchema` already
 * declares `tag` required, but that schema only feeds type generation.
 *
 * An empty `enabledHeadingSizes` mirrors the schema's "no tag constraint" case,
 * so we only require a non-empty string there.
 */
export const headingValidation = (
  enabledHeadingSizes: HeadingTagType[],
): NodeValidation<SerializedHeadingNode> => {
  return ({ node }) => {
    if (enabledHeadingSizes.length === 0) {
      if (typeof node.tag !== 'string' || node.tag.length === 0) {
        return 'Heading node is missing a valid "tag".'
      }
      return true
    }

    if (!enabledHeadingSizes.includes(node.tag)) {
      return `Heading node is missing a valid "tag" (expected one of: ${enabledHeadingSizes.join(', ')}).`
    }

    return true
  }
}
