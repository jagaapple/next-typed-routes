import { expect } from "chai";

import { createRoute } from "./index";

describe("index.ts", function() {
  it("should export `createRoute` function", function() {
    expect(createRoute).not.be.undefined;
  });
});
