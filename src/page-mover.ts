import { ServerResponse } from "http";

import { QueryParameters } from "./common-types";
import { mergeQueryString } from "./query-merger";
import { createRoute } from "./route-creator";

type Router = {
  push: (url: string, as?: string, options?: {}) => Promise<boolean>;
};

type Options = Partial<{
  /**
   * A sever response object for server-side.
   * It is possible to get a context object which contains this from Next.js `getInitialProps` arguments.
   */
  res: ServerResponse;
  /** An object for query string. */
  queryParameters: QueryParameters;
  /** A status code for server-side */
  statusCode: 301 | 302;
}>;

export const createPageMover = (
  /** A base URI of project. */
  baseURI: string | URL,
  /** Next.js built-in router object. */
  Router: Router,
) => (
  /** A destination absolute path or return value from `createRoute` function. */
  path: string | ReturnType<typeof createRoute>,
  /**
   * Options.
   * @default {}
   */
  options: Options = {},
) => {
  const uri = typeof path === "string" ? path : path.href;
  const alias = typeof path === "string" ? path : path.as;

  const res = options.res;
  if (res == undefined) {
    // For client.
    if (options.queryParameters == undefined) return Router.push(uri, alias);

    const pageURL = new URL(uri, baseURI);
    const aliasURL = new URL(alias, baseURI);
    const pageQueryString = mergeQueryString(pageURL, options.queryParameters);
    const aliasQueryString = mergeQueryString(aliasURL, options.queryParameters);

    return Router.push(`${pageURL.pathname}?${pageQueryString}`, `${aliasURL.pathname}?${aliasQueryString}`);
  }

  // For server.
  const aliasURL = new URL(alias, baseURI);
  const queryString = mergeQueryString(aliasURL, options.queryParameters ?? {});
  const url = new URL(queryString.length > 0 ? `${aliasURL.pathname}?${queryString}` : alias, baseURI);
  res.writeHead(options.statusCode ?? 302, { Location: url.toString() });
  res.end();
};
