import { ServerResponse } from "http";
import { expect } from "chai";
import * as sinon from "sinon";

import { createPageMover } from "./page-mover";

describe("page-mover.ts", function() {
  const dummyBaseURL = new URL("https://example.com");
  let routerPushSpy: sinon.SinonSpy;
  let dummyRouter: { push: (url: string, as?: string, options?: {}) => Promise<boolean> };
  let resWriteHeadSpy: sinon.SinonSpy;
  let resEndSpy: sinon.SinonSpy;
  let dummyRes: ServerResponse;

  beforeEach(function() {
    routerPushSpy = sinon.spy();
    dummyRouter = { push: routerPushSpy };

    resWriteHeadSpy = sinon.spy();
    resEndSpy = sinon.spy();
    dummyRes = {
      writeHead: resWriteHeadSpy,
      end: resEndSpy,
    } as any;
  });
  afterEach(function() {
    sinon.restore();
  });

  context("when specifying a path as string,", function() {
    const dummyPath = "/foo/bar";

    context("without a res object,", function() {
      it("should call `Router.push` with the path", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(routerPushSpy.calledOnceWithExactly(dummyPath, dummyPath)).to.be.true;
      });

      it("should not use a res object", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(resWriteHeadSpy.notCalled).to.be.true;
        expect(resEndSpy.notCalled).to.be.true;
      });

      context("specifying `options.queryParameters`,", function() {
        context("a path does not have query string,", function() {
          it("should call `Router.push` with the parameters as query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { queryParameters: { a: 1, b: "2" } });

            expect(routerPushSpy.calledOnceWithExactly(`${dummyPath}?a=1&b=2`, `${dummyPath}?a=1&b=2`)).to.be.true;
          });
        });

        context("a path has query string,", function() {
          it("should call `Router.push` with merge query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(`${dummyPath}?x=1&y=2`, { queryParameters: { a: 1, b: "2" } });

            expect(
              routerPushSpy.calledOnceWithExactly(`${dummyPath}?a=1&b=2&x=1&y=2`, `${dummyPath}?a=1&b=2&x=1&y=2`),
            ).to.be.true;
          });
        });
      });
    });

    context("with a res object,", function() {
      it("should not use `Router`", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(routerPushSpy.notCalled).to.be.true;
      });

      it("should call `res.writeHead` with the string as object", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(
          resWriteHeadSpy.calledOnceWithExactly(302, { Location: new URL(dummyPath, dummyBaseURL).toString() }),
        ).to.be.true;
      });

      it("should call `res.end`", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(resEndSpy.calledOnce).to.be.true;
      });

      context("specifying `options.statusCode`,", function() {
        it("should call `res.writeHead` with the string and the status code", function() {
          const statusCode = 301;

          const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
          moveToPage(dummyPath, { statusCode, res: dummyRes });

          expect(
            resWriteHeadSpy.calledOnceWithExactly(statusCode, { Location: new URL(dummyPath, dummyBaseURL).toString() }),
          ).to.be.true;
        });
      });

      context("specifying `options.queryParameters`,", function() {
        context("a path does not have query string,", function() {
          it("should call `res.writeHead` with the parameters as query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL(`${dummyPath}?a=1&b=2`, dummyBaseURL);
            expect(resWriteHeadSpy.calledOnceWithExactly(302, { Location: url.toString() })).to.be.true;
          });
        });

        context("a path has query string,", function() {
          it("should call `res.writeHead` with merge query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(`${dummyPath}?x=1&y=2`, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL(`${dummyPath}?a=1&b=2&x=1&y=2`, dummyBaseURL);
            expect(resWriteHeadSpy.calledOnceWithExactly(302, { Location: url.toString() })).to.be.true;
          });
        });
      });
    });
  });

  context("when specifying a path as returned value from `createRoute`,", function() {
    const dummyPath = { href: "/users/[userId]", as: "/users/123" };

    context("without a res object,", function() {
      it("should call `Router.push` with the path's `href` and `as`", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(routerPushSpy.calledOnceWithExactly(dummyPath.href, dummyPath.as)).to.be.true;
      });

      it("should not use a res object", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(resWriteHeadSpy.notCalled).to.be.true;
        expect(resEndSpy.notCalled).to.be.true;
      });

      context("specifying `options.queryParameters`,", function() {
        context("a path does not have query string,", function() {
          it("should call `Router.push` with the parameters as query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { queryParameters: { a: 1, b: "2" } });

            expect(routerPushSpy.calledOnceWithExactly(`${dummyPath.href}?a=1&b=2`, `${dummyPath.as}?a=1&b=2`)).to.be.true;
          });
        });

        context("a path has query string,", function() {
          it("should call `Router.push` with merge query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            const path = { href: "/users/[userId]?limit=30", as: "/users/123?limit=30" };
            moveToPage(path, { queryParameters: { a: 1, b: "2" } });

            expect(
              routerPushSpy.calledOnceWithExactly("/users/[userId]?a=1&b=2&limit=30", "/users/123?a=1&b=2&limit=30"),
            ).to.be.true;
          });
        });
      });
    });

    context("with a res object,", function() {
      it("should not use `Router`", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(routerPushSpy.notCalled).to.be.true;
      });

      it("should call `res.writeHead` with the path's `as`", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(
          resWriteHeadSpy.calledOnceWithExactly(302, { Location: new URL(dummyPath.as, dummyBaseURL).toString() }),
        ).to.be.true;
      });

      it("should call `res.end`", function() {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(resEndSpy.calledOnce).to.be.true;
      });

      context("specifying `options.statusCode`,", function() {
        it("should call `res.writeHead` with the string and the status code", function() {
          const statusCode = 301;

          const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
          moveToPage(dummyPath, { statusCode, res: dummyRes });

          expect(
            resWriteHeadSpy.calledOnceWithExactly(statusCode, { Location: new URL(dummyPath.as, dummyBaseURL).toString() }),
          ).to.be.true;
        });
      });

      context("specifying `options.queryParameters`,", function() {
        context("a path does not have query string,", function() {
          it("should call `res.writeHead` with the parameters as query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL(`${dummyPath.as}?a=1&b=2`, dummyBaseURL);
            expect(resWriteHeadSpy.calledOnceWithExactly(302, { Location: url.toString() })).to.be.true;
          });
        });

        context("a path has query string,", function() {
          it("should call `res.writeHead` with merge query string", function() {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            const path = { href: "/users/[userId]?limit=30", as: "/users/123?limit=30" };
            moveToPage(path, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL("/users/123?a=1&b=2&limit=30", dummyBaseURL);
            expect(resWriteHeadSpy.calledOnceWithExactly(302, { Location: url.toString() })).to.be.true;
          });
        });
      });
    });
  });
});
