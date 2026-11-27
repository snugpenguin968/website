import { SearchAdapter } from '@adapters/search.adapter';

export async function GET(): Promise<Response> {
  const items = await SearchAdapter.resolveIndex();
  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
