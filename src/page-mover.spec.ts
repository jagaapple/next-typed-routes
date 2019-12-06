import { ServerResponse } from "http";

import { createPageMover } from "./page-mover";

describe("createPageMover", () => {
  const dummyBaseURL = new URL("https://example.com");
  let dummyRouter: Parameters<typeof createPageMover>[1];
  let routerPushSpy: jest.Mock<ReturnType<typeof dummyRouter["push"]>, Parameters<typeof dummyRouter["push"]>>;
  let resWriteHeadSpy: jest.Mock<any, Parameters<ServerResponse["writeHead"]>>;
  let resEndSpy: jest.Mock<any, any>;
  let dummyRes: ServerResponse;

  beforeEach(() => {
    routerPushSpy = jest.fn((_, __?, ___?) => Promise.resolve(true));
    dummyRouter = { push: routerPushSpy };

    resWriteHeadSpy = jest.fn((_, __?) => undefined);
    resEndSpy = jest.fn(() => undefined);
    dummyRes = { writeHead: resWriteHeadSpy, end: resEndSpy } as any;
  });

  context("when specifying a path as string,", () => {
    const dummyPath = "/foo/bar";

    context("without a res object,", () => {
      it("should call `Router.push` with the path", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(routerPushSpy).toBeCalledWith(dummyPath, dummyPath);
        expect(routerPushSpy).toBeCalledTimes(1);
      });

      it("should not use a res object", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(resWriteHeadSpy).not.toBeCalled();
        expect(resEndSpy).not.toBeCalled();
      });

      context("specifying `options.queryParameters`,", () => {
        context("a path does not have query string,", () => {
          it("should call `Router.push` with the parameters as query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { queryParameters: { a: 1, b: "2" } });

            expect(routerPushSpy).toBeCalledWith(`${dummyPath}?a=1&b=2`, `${dummyPath}?a=1&b=2`);
            expect(routerPushSpy).toBeCalledTimes(1);
          });
        });

        context("a path has query string,", () => {
          it("should call `Router.push` with merge query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(`${dummyPath}?x=1&y=2`, { queryParameters: { a: 1, b: "2" } });

            expect(routerPushSpy).toBeCalledWith(`${dummyPath}?a=1&b=2&x=1&y=2`, `${dummyPath}?a=1&b=2&x=1&y=2`);
            expect(routerPushSpy).toBeCalledTimes(1);
          });
        });
      });
    });

    context("with a res object,", () => {
      it("should not use `Router`", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(routerPushSpy).not.toBeCalled();
      });

      it("should call `res.writeHead` with the string as object", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(resWriteHeadSpy).toBeCalledWith(302, { Location: new URL(dummyPath, dummyBaseURL).toString() });
        expect(resWriteHeadSpy).toBeCalledTimes(1);
      });

      it("should call `res.end`", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(resEndSpy).toBeCalledTimes(1);
      });

      context("specifying `options.statusCode`,", () => {
        it("should call `res.writeHead` with the string and the status code", () => {
          const statusCode = 301;

          const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
          moveToPage(dummyPath, { statusCode, res: dummyRes });

          expect(resWriteHeadSpy).toBeCalledWith(statusCode, { Location: new URL(dummyPath, dummyBaseURL).toString() });
          expect(resWriteHeadSpy).toBeCalledTimes(1);
        });
      });

      context("specifying `options.queryParameters`,", () => {
        context("a path does not have query string,", () => {
          it("should call `res.writeHead` with the parameters as query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL(`${dummyPath}?a=1&b=2`, dummyBaseURL);
            expect(resWriteHeadSpy).toBeCalledWith(302, { Location: url.toString() });
            expect(resWriteHeadSpy).toBeCalledTimes(1);
          });
        });

        context("a path has query string,", () => {
          it("should call `res.writeHead` with merge query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(`${dummyPath}?x=1&y=2`, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL(`${dummyPath}?a=1&b=2&x=1&y=2`, dummyBaseURL);
            expect(resWriteHeadSpy).toBeCalledWith(302, { Location: url.toString() });
            expect(resWriteHeadSpy).toBeCalledTimes(1);
          });
        });
      });
    });
  });

  context("when specifying a path as returned value from `createRoute`,", () => {
    const dummyPath = { href: "/users/[userId]", as: "/users/123" };

    context("without a res object,", () => {
      it("should call `Router.push` with the path's `href` and `as`", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(routerPushSpy).toBeCalledWith(dummyPath.href, dummyPath.as);
        expect(routerPushSpy).toBeCalledTimes(1);
      });

      it("should not use a res object", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath);

        expect(resWriteHeadSpy).not.toBeCalled();
        expect(resEndSpy).not.toBeCalled();
      });

      context("specifying `options.queryParameters`,", () => {
        context("a path does not have query string,", () => {
          it("should call `Router.push` with the parameters as query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { queryParameters: { a: 1, b: "2" } });

            expect(routerPushSpy).toBeCalledWith(`${dummyPath.href}?a=1&b=2`, `${dummyPath.as}?a=1&b=2`);
            expect(routerPushSpy).toBeCalledTimes(1);
          });
        });

        context("a path has query string,", () => {
          it("should call `Router.push` with merge query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            const path = { href: "/users/[userId]?limit=30", as: "/users/123?limit=30" };
            moveToPage(path, { queryParameters: { a: 1, b: "2" } });

            expect(routerPushSpy).toBeCalledWith("/users/[userId]?a=1&b=2&limit=30", "/users/123?a=1&b=2&limit=30");
            expect(routerPushSpy).toBeCalledTimes(1);
          });
        });
      });
    });

    context("with a res object,", () => {
      it("should not use `Router`", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(routerPushSpy).not.toBeCalled();
      });

      it("should call `res.writeHead` with the path's `as`", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(resWriteHeadSpy).toBeCalledWith(302, { Location: new URL(dummyPath.as, dummyBaseURL).toString() });
        expect(resWriteHeadSpy).toBeCalledTimes(1);
      });

      it("should call `res.end`", () => {
        const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
        moveToPage(dummyPath, { res: dummyRes });

        expect(resEndSpy).toBeCalledTimes(1);
      });

      context("specifying `options.statusCode`,", () => {
        it("should call `res.writeHead` with the string and the status code", () => {
          const statusCode = 301;

          const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
          moveToPage(dummyPath, { statusCode, res: dummyRes });

          expect(resWriteHeadSpy).toBeCalledWith(statusCode, { Location: new URL(dummyPath.as, dummyBaseURL).toString() });
          expect(resWriteHeadSpy).toBeCalledTimes(1);
        });
      });

      context("specifying `options.queryParameters`,", () => {
        context("a path does not have query string,", () => {
          it("should call `res.writeHead` with the parameters as query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            moveToPage(dummyPath, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL(`${dummyPath.as}?a=1&b=2`, dummyBaseURL);
            expect(resWriteHeadSpy).toBeCalledWith(302, { Location: url.toString() });
            expect(resWriteHeadSpy).toBeCalledTimes(1);
          });
        });

        context("a path has query string,", () => {
          it("should call `res.writeHead` with merge query string", () => {
            const moveToPage = createPageMover(dummyBaseURL, dummyRouter);
            const path = { href: "/users/[userId]?limit=30", as: "/users/123?limit=30" };
            moveToPage(path, { res: dummyRes, queryParameters: { a: 1, b: "2" } });

            const url = new URL("/users/123?a=1&b=2&limit=30", dummyBaseURL);
            expect(resWriteHeadSpy).toBeCalledWith(302, { Location: url.toString() });
            expect(resWriteHeadSpy).toBeCalledTimes(1);
          });
        });
      });
    });
  });
});
