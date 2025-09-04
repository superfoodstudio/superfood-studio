/**
 * Cursor-based pagination utilities for GraphQL resolvers
 * Follows Relay Connection specification
 */

export interface CursorPaginationArgs {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount?: number;
}

export interface PaginationConfig {
  maxLimit?: number;
  defaultLimit?: number;
  cursorField?: string; // Default: 'id'
  sortOrder?: 'asc' | 'desc'; // Custom sort order
}

/**
 * Creates a cursor from a record
 */
export function createCursor(record: any, field = 'id'): string {
  const value = record[field];
  if (!value) throw new Error(`Record missing cursor field: ${field}`);
  
  // Convert dates to ISO strings for consistent cursor format
  const serializedValue = value instanceof Date ? value.toISOString() : value;
  
  // Always include the id as a tiebreaker for duplicate values
  const cursorData = field === 'id' ? 
    `${field}:${serializedValue}` : 
    `${field}:${serializedValue}|id:${record.id}`;
  
  return Buffer.from(cursorData).toString('base64');
}

/**
 * Parses a cursor to extract field and value
 */
export function parseCursor(cursor: string): { field: string; value: any; id?: string } {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString();
    
    // Check if this is a compound cursor with id tiebreaker
    if (decoded.includes('|id:')) {
      const [mainPart, idPart] = decoded.split('|id:');
      const [field, ...valueParts] = mainPart.split(':');
      const value = valueParts.join(':');
      const id = idPart;
      
      // Try to parse as date for common date fields
      if (field === 'uploadDate' || field === 'createdAt' || field === 'updatedAt') {
        const dateValue = new Date(value);
        return { field, value: dateValue, id };
      }
      
      return { field, value, id };
    } else {
      // Simple cursor
      const [field, ...valueParts] = decoded.split(':');
      const value = valueParts.join(':');
      
      // Try to parse as date for common date fields
      if (field === 'uploadDate' || field === 'createdAt' || field === 'updatedAt') {
        const dateValue = new Date(value);
        return { field, value: dateValue };
      }
      
      return { field, value };
    }
  } catch (error) {
    throw new Error('Invalid cursor format');
  }
}

/**
 * Validates and normalizes pagination arguments
 */
export function validatePaginationArgs(
  args: CursorPaginationArgs,
  config: PaginationConfig = {}
): {
  limit: number;
  cursor?: { field: string; value: string };
  direction: 'forward' | 'backward';
} {
  const { maxLimit = 100, defaultLimit = 20 } = config;
  
  // Validate exclusive arguments
  if (args.first && args.last) {
    throw new Error('Cannot specify both first and last');
  }
  if (args.after && args.before) {
    throw new Error('Cannot specify both after and before');
  }

  // Determine direction and limit
  const isForward = args.first !== undefined || args.after !== undefined;
  const limit = Math.min(
    args.first || args.last || defaultLimit,
    maxLimit
  );

  // Parse cursor if provided
  let cursor;
  const cursorStr = args.after || args.before;
  if (cursorStr) {
    cursor = parseCursor(cursorStr);
  }

  return {
    limit: limit + 1, // +1 to check for next/previous page
    cursor,
    direction: isForward ? 'forward' : 'backward'
  };
}

/**
 * Creates Prisma where clause for cursor pagination
 */
export function createCursorWhere(
  cursor: { field: string; value: any; id?: string } | undefined,
  direction: 'forward' | 'backward',
  baseWhere: any = {},
  sortOrder: 'asc' | 'desc' = 'desc'
): any {
  if (!cursor) return baseWhere;

  const { field, value, id } = cursor;
  
  // If we have a compound cursor with id, use OR condition for proper handling
  if (id) {
    let primaryOperator: string;
    let secondaryOperator: string;
    
    if (sortOrder === 'desc') {
      primaryOperator = direction === 'forward' ? 'lt' : 'gt';
      secondaryOperator = direction === 'forward' ? 'gt' : 'lt'; // Reverse for id
    } else {
      primaryOperator = direction === 'forward' ? 'gt' : 'lt';
      secondaryOperator = direction === 'forward' ? 'gt' : 'lt';
    }
    
    return {
      ...baseWhere,
      OR: [
        { [field]: { [primaryOperator]: value } },
        { 
          [field]: value,
          id: { [secondaryOperator]: id }
        }
      ]
    };
  }
  
  // Simple cursor without compound logic
  let operator: string;
  if (sortOrder === 'desc') {
    operator = direction === 'forward' ? 'lt' : 'gt';
  } else {
    operator = direction === 'forward' ? 'gt' : 'lt';
  }

  return {
    ...baseWhere,
    [field]: { [operator]: value }
  };
}

/**
 * Creates a Relay-compliant connection from Prisma results
 */
export function createConnection<T>(
  records: T[],
  args: CursorPaginationArgs,
  config: PaginationConfig = {}
): Connection<T> {
  const { cursorField = 'id' } = config;
  const { limit, direction } = validatePaginationArgs(args, config);
  
  // The limit from validatePaginationArgs is already +1 for pagination detection
  // So we need to check if we have more than the original requested limit
  const requestedLimit = args.first || args.last || config.defaultLimit || 20;
  const hasMore = records.length > requestedLimit;
  const nodes = hasMore ? records.slice(0, requestedLimit) : records;
  
  
  // Reverse if backward pagination
  if (direction === 'backward') {
    nodes.reverse();
  }

  // Create edges
  const edges: Edge<T>[] = nodes.map(node => ({
    node,
    cursor: createCursor(node, cursorField)
  }));

  // Create page info
  const pageInfo: PageInfo = {
    hasNextPage: direction === 'forward' ? hasMore : false,
    hasPreviousPage: direction === 'backward' ? hasMore : false,
    startCursor: edges.length > 0 ? edges[0].cursor : undefined,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined
  };

  return {
    edges,
    pageInfo
  };
}

/**
 * Helper function for simple cursor pagination with Prisma
 */
export async function paginateQuery<T>(
  prismaQuery: any,
  args: CursorPaginationArgs,
  baseWhere: any = {},
  config: PaginationConfig = {}
): Promise<Connection<T>> {
  const { cursorField = 'id', defaultLimit = 20, sortOrder } = config;
  const { limit, cursor, direction } = validatePaginationArgs(args, config);

  // Determine actual sort order
  const actualSortOrder = sortOrder || (direction === 'forward' ? 'desc' : 'asc');

  // Build where clause using compound cursor logic
  const where = createCursorWhere(cursor, direction, baseWhere, actualSortOrder);

  // Build order by with secondary sort by id for stability
  const orderBy = [
    { [cursorField]: actualSortOrder },
    { id: 'asc' } // Always sort by id as tiebreaker
  ];

  // Execute query
  const records = await prismaQuery.findMany({
    where,
    orderBy,
    take: limit
  });

  return createConnection(records, args, config);
}