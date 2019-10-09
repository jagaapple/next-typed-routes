import { expect } from "chai";

import { mergeQueryString } from "./query-merger";

describe("query-merger.ts", function() {
  it("should merge query strings", function() {
    expect(mergeQueryString(new URL("https://foo.example.com/"), {})).to.eq("");
    expect(mergeQueryString(new URL("https://foo.example.com/"), { a: 1, b: "2" })).to.eq("a=1&b=2");

    expect(mergeQueryString(new URL("https://foo.example.com/bar?x=1&y=2"), {})).to.eq("x=1&y=2");
    expect(mergeQueryString(new URL("https://foo.example.com/bar?x=1&y=2"), { a: 1, b: "2" })).to.eq("a=1&b=2&x=1&y=2");
  });
});
