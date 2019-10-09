import * as queryString from "query-string";

import { QueryParameters } from "./common-types";

export const mergeQueryString = (url: URL, queryParameters: QueryParameters) =>
  queryString.stringify({
    ...queryString.parse(url.search),
    ...queryParameters,
  });
