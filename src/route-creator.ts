import * as queryString from "query-string";

export const createRoute = (
  path: string,
  parameters: Record<string, number | string | undefined | null> = {},
  queryParameters: Record<string, number | string | boolean | null | undefined> = {},
) => {
  const pagePath = path.replace(/^\/*/, "/");
  const completedURISegments: string[] = [];

  const segments = pagePath.split("/");
  segments.forEach((segment: string) => {
    const newSegment = (() => {
      const matches = segment.match(/_(.*?)_/);
      if (matches == undefined) return segment;

      const parameterName = matches[1];

      return parameters[parameterName] || segment;
    })();

    completedURISegments.push(newSegment.toString());
  });

  const queries = queryString.stringify(queryParameters);
  const querySeparator = queries && "?";

  const pagePathWithQueries = pagePath + querySeparator + queries;
  const completedURI = completedURISegments.join("/") + querySeparator + queries;

  return { href: pagePathWithQueries, as: completedURI };
};
