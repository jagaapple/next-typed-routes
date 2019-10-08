import { expect } from "chai";

import { createRoute } from "./route-creator";

describe("route-creator.ts", function() {
  it("should append one leading slash", function() {
    expect(createRoute("example")).to.eql({ href: "/example", as: "/example" });
    expect(createRoute("/example")).to.eql({ href: "/example", as: "/example" });
    expect(createRoute("//example")).to.eql({ href: "/example", as: "/example" });
  });

  context("when parameters are not required,", function() {
    it('should return "href" and "as" and they are the same value', function() {
      expect(createRoute("/example")).to.eql({ href: "/example", as: "/example" });
      expect(createRoute("/example/example")).to.eql({ href: "/example/example", as: "/example/example" });

      expect(createRoute("/example", { foo: "dummy1", bar: "dummy2" })).to.eql({ href: "/example", as: "/example" });
      expect(createRoute("/example/example", { foo: "dummy1", bar: "dummy2" })).to.eql({
        href: "/example/example",
        as: "/example/example",
      });
    });
  });

  context("when parameters are required and fills them,", function() {
    it('should return "href" and completed URI as "as"', function() {
      expect(createRoute("/tags/_tagName_", { tagName: "dummy-name" })).to.eql({
        href: "/tags/_tagName_",
        as: "/tags/dummy-name",
      });
      expect(createRoute("/posts/_postId_", { postId: 123 })).to.eql({ href: "/posts/_postId_", as: "/posts/123" });
      expect(createRoute("/posts/_postId_/_commentId_", { postId: 123, commentId: 456 })).to.eql({
        href: "/posts/_postId_/_commentId_",
        as: "/posts/123/456",
      });
    });
  });

  context("when parameters are required and lacks them,", function() {
    it('should return "href" and incompleted URI as "as"', function() {
      expect(createRoute("/tags/_tagName_")).to.eql({ href: "/tags/_tagName_", as: "/tags/_tagName_" });
      expect(createRoute("/posts/_postId_", { dummy: 123 })).to.eql({ href: "/posts/_postId_", as: "/posts/_postId_" });
      expect(createRoute("/posts/_postId_/_commentId_", { postId: 123 })).to.eql({
        href: "/posts/_postId_/_commentId_",
        as: "/posts/123/_commentId_",
      });
    });
  });

  context("when specifying query parameters,", function() {
    it("should parse them as query string", function() {
      const queryParameters = { a: 1, b: "2" };

      expect(createRoute("/example/example", undefined, queryParameters)).to.eql({
        href: "/example/example?a=1&b=2",
        as: "/example/example?a=1&b=2",
      });
      expect(createRoute("/tags/_tagName_", undefined, queryParameters)).to.eql({
        href: "/tags/_tagName_?a=1&b=2",
        as: "/tags/_tagName_?a=1&b=2",
      });
      expect(createRoute("/posts/_postId_", { dummy: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_?a=1&b=2",
        as: "/posts/_postId_?a=1&b=2",
      });
      expect(createRoute("/posts/_postId_/_commentId_", { postId: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_/_commentId_?a=1&b=2",
        as: "/posts/123/_commentId_?a=1&b=2",
      });
    });
  });

  context("when specifying query parameters which contain undefined values", function() {
    it("should not contain the parameters", function() {
      const queryParameters = { a: 1, b: undefined, c: "2" };

      expect(createRoute("/example/example", undefined, queryParameters)).to.eql({
        href: "/example/example?a=1&c=2",
        as: "/example/example?a=1&c=2",
      });
      expect(createRoute("/tags/_tagName_", undefined, queryParameters)).to.eql({
        href: "/tags/_tagName_?a=1&c=2",
        as: "/tags/_tagName_?a=1&c=2",
      });
      expect(createRoute("/posts/_postId_", { dummy: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_?a=1&c=2",
        as: "/posts/_postId_?a=1&c=2",
      });
      expect(createRoute("/posts/_postId_/_commentId_", { postId: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_/_commentId_?a=1&c=2",
        as: "/posts/123/_commentId_?a=1&c=2",
      });
    });
  });

  context("when specifying query parameters which contain null values", function() {
    it("should contain only keys of the parameters", function() {
      const queryParameters = { a: 1, b: null, c: "2" };

      expect(createRoute("/example/example", undefined, queryParameters)).to.eql({
        href: "/example/example?a=1&b&c=2",
        as: "/example/example?a=1&b&c=2",
      });
      expect(createRoute("/tags/_tagName_", undefined, queryParameters)).to.eql({
        href: "/tags/_tagName_?a=1&b&c=2",
        as: "/tags/_tagName_?a=1&b&c=2",
      });
      expect(createRoute("/posts/_postId_", { dummy: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_?a=1&b&c=2",
        as: "/posts/_postId_?a=1&b&c=2",
      });
      expect(createRoute("/posts/_postId_/_commentId_", { postId: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_/_commentId_?a=1&b&c=2",
        as: "/posts/123/_commentId_?a=1&b&c=2",
      });
    });
  });

  context("when specifying query parameters which contain boolean values", function() {
    it("should contain the parameters as string", function() {
      const queryParameters = { a: 1, b: false, c: "2", d: true };

      expect(createRoute("/example/example", undefined, queryParameters)).to.eql({
        href: "/example/example?a=1&b=false&c=2&d=true",
        as: "/example/example?a=1&b=false&c=2&d=true",
      });
      expect(createRoute("/tags/_tagName_", undefined, queryParameters)).to.eql({
        href: "/tags/_tagName_?a=1&b=false&c=2&d=true",
        as: "/tags/_tagName_?a=1&b=false&c=2&d=true",
      });
      expect(createRoute("/posts/_postId_", { dummy: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_?a=1&b=false&c=2&d=true",
        as: "/posts/_postId_?a=1&b=false&c=2&d=true",
      });
      expect(createRoute("/posts/_postId_/_commentId_", { postId: 123 }, queryParameters)).to.eql({
        href: "/posts/_postId_/_commentId_?a=1&b=false&c=2&d=true",
        as: "/posts/123/_commentId_?a=1&b=false&c=2&d=true",
      });
    });
  });
});
