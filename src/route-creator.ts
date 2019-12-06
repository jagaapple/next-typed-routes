import * as queryString from "query-string";

import { QueryParameters } from "./common-types";

export const createRoute = (
  /** A page of Next.js. This is a path of files in `/pages` in general. */
  path: string,
  /**
   * An object for dynamic parameters.
   * @default {}
   */
  parameters: Record<string, number | string | undefined | null> = {},
  /**
   * An object for query string.
   * @default {}
   */
  queryParameters: QueryParameters = {},
) => {
  const pagePath = path.replace(/^\/*/, "/");
  const completedURISegments: string[] = [];

  const segments = pagePath.split("/");
  segments.forEach((segment: string) => {
    const newSegment = (() => {
      const matches = segment.match(/\[(.*?)\]/);
      if (matches == undefined) return segment;

      const parameterName = matches[1];

      return parameters[parameterName] ?? segment;
    })();

    completedURISegments.push(newSegment.toString());
  });

  const queries = queryString.stringify(queryParameters);
  const querySeparator = queries && "?";

  const pagePathWithQueries = pagePath + querySeparator + queries;
  const completedURI = completedURISegments.join("/") + querySeparator + queries;

  return { href: pagePathWithQueries, as: completedURI };
};
