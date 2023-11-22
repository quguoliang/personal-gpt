import type { Context } from 'https://edge.netlify.com';

export default function ({
  request,
  context,
}: {
  request: Request;
  context: Context;
}) {
  // Return serializable data to add to Astro.locals
  return {
    visitorCountry: context.geo.country.name,
    hasEdgeMiddleware: true,
  };
}
