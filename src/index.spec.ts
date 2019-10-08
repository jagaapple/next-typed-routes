import { expect } from "chai";

import { getOne } from "./index";

describe("index.ts", function() {
  it("it should return 1", function() {
    expect(getOne()).to.eq(1);
  });
});
