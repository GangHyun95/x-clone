import { pool } from './index.ts';

type Cursor = { cursorDate: Date; cursorId: number };

export async function paginate(
    baseSql: string,
    baseValues: (string | number | Date | number[] | null)[],
    cursor: Cursor | null,
    options: { order: [string, string]; limit?: number }
) {
    const [orderBy, orderId] = options.order;
    const limit = options.limit ?? 10;
    const values = [...baseValues];

    if (cursor) {
        const idx = values.length + 1;
        baseSql += ` AND (${orderBy} < $${idx} OR (${orderBy} = $${idx} AND ${orderId} < $${idx + 1}))`;
        values.push(cursor.cursorDate, cursor.cursorId);
    }

    const sql = `${baseSql} ORDER BY ${orderBy} DESC, ${orderId} DESC LIMIT ${limit + 1}`;
    const { rows } = await pool.query(sql, values);
    const items = rows.slice(0, limit);
    const hasNextPage = rows.length > limit;

    const last = items[items.length - 1];
    const [orderKey, idKey] = [orderBy, orderId].map(k => k.split('.').pop()!);
    const nextCursor = hasNextPage ? { cursorDate: last[orderKey] as Date, cursorId: last[idKey] as number } : null;

    return { items, hasNextPage, nextCursor };
}

