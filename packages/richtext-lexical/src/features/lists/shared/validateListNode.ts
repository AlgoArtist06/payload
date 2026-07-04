import type { NodeValidation } from '../../typesServer.js'
import type { SerializedListNode } from './schema.js'

const validTags = ['ol', 'ul']
const validListTypes = ['bullet', 'check', 'number']

/**
 * Runtime validation for `list` nodes saved through the API.
 *
 * The editor always populates `tag`, `listType` and `start`, but programmatic
 * callers (REST/local API, MCP tools, migration scripts) can omit them. Without
 * this check the malformed node is persisted as-is, breaking any renderer that
 * reads those fields. `listNodeJSONSchema` already declares them required, but
 * that schema only feeds type generation - not runtime validation.
 */
export const validateListNode: NodeValidation<SerializedListNode> = ({ node }) => {
  if (!validTags.includes(node.tag)) {
    return `List node is missing a valid "tag" (expected one of: ${validTags.join(', ')}).`
  }

  if (!validListTypes.includes(node.listType)) {
    return `List node is missing a valid "listType" (expected one of: ${validListTypes.join(', ')}).`
  }

  if (typeof node.start !== 'number') {
    return 'List node is missing a valid "start" (expected a number).'
  }

  return true
}
