import { createRoute } from "./route-creator";

describe("createRoute", () => {
  it("should append one leading slash", () => {
    expect(createRoute("example")).toEqual({ href: "/example", as: "/example" });
    expect(createRoute("/example")).toEqual({ href: "/example", as: "/example" });
    expect(createRoute("//example")).toEqual({ href: "/example", as: "/example" });
  });

  context("when parameters are not required,", () => {
    it('should return "href" and "as" and they are the same value', () => {
      expect(createRoute("/example")).toEqual({ href: "/example", as: "/example" });
      expect(createRoute("/example/example")).toEqual({ href: "/example/example", as: "/example/example" });

      expect(createRoute("/example", { foo: "dummy1", bar: "dummy2" })).toEqual({ href: "/example", as: "/example" });
      expect(createRoute("/example/example", { foo: "dummy1", bar: "dummy2" })).toEqual({
        href: "/example/example",
        as: "/example/example",
      });
    });
  });

  context("when parameters are required and fills them,", () => {
    it('should return "href" and completed URI as "as"', () => {
      expect(createRoute("/tags/[tagName]", { tagName: "dummy-name" })).toEqual({
        href: "/tags/[tagName]",
        as: "/tags/dummy-name",
      });
      expect(createRoute("/posts/[postId]", { postId: 123 })).toEqual({ href: "/posts/[postId]", as: "/posts/123" });
      expect(createRoute("/posts/[postId]/[commentId]", { postId: 123, commentId: 456 })).toEqual({
        href: "/posts/[postId]/[commentId]",
        as: "/posts/123/456",
      });
    });
  });

  context("when parameters are required and lacks them,", () => {
    it('should return "href" and incompleted URI as "as"', () => {
      expect(createRoute("/tags/[tagName]")).toEqual({ href: "/tags/[tagName]", as: "/tags/[tagName]" });
      expect(createRoute("/posts/[postId]", { dummy: 123 })).toEqual({ href: "/posts/[postId]", as: "/posts/[postId]" });
      expect(createRoute("/posts/[postId]/[commentId]", { postId: 123 })).toEqual({
        href: "/posts/[postId]/[commentId]",
        as: "/posts/123/[commentId]",
      });
    });
  });

  context("when specifying query parameters,", () => {
    it("should parse them as query string", () => {
      const queryParameters = { a: 1, b: "2" };

      expect(createRoute("/example/example", undefined, queryParameters)).toEqual({
        href: "/example/example?a=1&b=2",
        as: "/example/example?a=1&b=2",
      });
      expect(createRoute("/tags/[tagName]", undefined, queryParameters)).toEqual({
        href: "/tags/[tagName]?a=1&b=2",
        as: "/tags/[tagName]?a=1&b=2",
      });
      expect(createRoute("/posts/[postId]", { dummy: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]?a=1&b=2",
        as: "/posts/[postId]?a=1&b=2",
      });
      expect(createRoute("/posts/[postId]/[commentId]", { postId: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]/[commentId]?a=1&b=2",
        as: "/posts/123/[commentId]?a=1&b=2",
      });
    });
  });

  context("when specifying query parameters which contain undefined values", () => {
    it("should not contain the parameters", () => {
      const queryParameters = { a: 1, b: undefined, c: "2" };

      expect(createRoute("/example/example", undefined, queryParameters)).toEqual({
        href: "/example/example?a=1&c=2",
        as: "/example/example?a=1&c=2",
      });
      expect(createRoute("/tags/[tagName]", undefined, queryParameters)).toEqual({
        href: "/tags/[tagName]?a=1&c=2",
        as: "/tags/[tagName]?a=1&c=2",
      });
      expect(createRoute("/posts/[postId]", { dummy: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]?a=1&c=2",
        as: "/posts/[postId]?a=1&c=2",
      });
      expect(createRoute("/posts/[postId]/[commentId]", { postId: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]/[commentId]?a=1&c=2",
        as: "/posts/123/[commentId]?a=1&c=2",
      });
    });
  });

  context("when specifying query parameters which contain null values", () => {
    it("should contain only keys of the parameters", () => {
      const queryParameters = { a: 1, b: null, c: "2" };

      expect(createRoute("/example/example", undefined, queryParameters)).toEqual({
        href: "/example/example?a=1&b&c=2",
        as: "/example/example?a=1&b&c=2",
      });
      expect(createRoute("/tags/[tagName]", undefined, queryParameters)).toEqual({
        href: "/tags/[tagName]?a=1&b&c=2",
        as: "/tags/[tagName]?a=1&b&c=2",
      });
      expect(createRoute("/posts/[postId]", { dummy: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]?a=1&b&c=2",
        as: "/posts/[postId]?a=1&b&c=2",
      });
      expect(createRoute("/posts/[postId]/[commentId]", { postId: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]/[commentId]?a=1&b&c=2",
        as: "/posts/123/[commentId]?a=1&b&c=2",
      });
    });
  });

  context("when specifying query parameters which contain boolean values", () => {
    it("should contain the parameters as string", () => {
      const queryParameters = { a: 1, b: false, c: "2", d: true };

      expect(createRoute("/example/example", undefined, queryParameters)).toEqual({
        href: "/example/example?a=1&b=false&c=2&d=true",
        as: "/example/example?a=1&b=false&c=2&d=true",
      });
      expect(createRoute("/tags/[tagName]", undefined, queryParameters)).toEqual({
        href: "/tags/[tagName]?a=1&b=false&c=2&d=true",
        as: "/tags/[tagName]?a=1&b=false&c=2&d=true",
      });
      expect(createRoute("/posts/[postId]", { dummy: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]?a=1&b=false&c=2&d=true",
        as: "/posts/[postId]?a=1&b=false&c=2&d=true",
      });
      expect(createRoute("/posts/[postId]/[commentId]", { postId: 123 }, queryParameters)).toEqual({
        href: "/posts/[postId]/[commentId]?a=1&b=false&c=2&d=true",
        as: "/posts/123/[commentId]?a=1&b=false&c=2&d=true",
      });
    });
  });
});
