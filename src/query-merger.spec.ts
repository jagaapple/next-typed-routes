import { mergeQueryString } from "./query-merger";

describe("mergeQueryString", () => {
  it("should merge query strings", () => {
    expect(mergeQueryString(new URL("https://foo.example.com/"), {})).toEqual("");
    expect(mergeQueryString(new URL("https://foo.example.com/"), { a: 1, b: "2" })).toEqual("a=1&b=2");

    expect(mergeQueryString(new URL("https://foo.example.com/bar?x=1&y=2"), {})).toEqual("x=1&y=2");
    expect(mergeQueryString(new URL("https://foo.example.com/bar?x=1&y=2"), { a: 1, b: "2" })).toEqual("a=1&b=2&x=1&y=2");
  });
});
