/** Hash-routes, zodat de app als statische site werkt (ook op GitHub Pages). */
export type Route =
  | { naam: 'start' }
  | { naam: 'context' }
  | { naam: 'thema'; id: string }
  | { naam: 'aspect'; id: string }
  | { naam: 'iea' }
  | { naam: 'overzicht' }
  | { naam: 'rapport' };

export function leesRoute(hash: string): Route {
  const [naam, id] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  switch (naam) {
    case 'context':
    case 'iea':
    case 'overzicht':
    case 'rapport':
      return { naam };
    case 'thema':
    case 'aspect':
      return id ? { naam, id } : { naam: 'start' };
    default:
      return { naam: 'start' };
  }
}

export const link = {
  start: '#/',
  context: '#/context',
  iea: '#/iea',
  overzicht: '#/overzicht',
  rapport: '#/rapport',
  thema: (id: string) => `#/thema/${encodeURIComponent(id)}`,
  aspect: (id: string) => `#/aspect/${encodeURIComponent(id)}`,
};
