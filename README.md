<h1 align="center">next-typed-routes</h1>

<h4 align="center">🔜 Type safe route utilities for Next.js. 🔙</h4>

```ts
// /routes.ts
import { createRoute } from "next-typed-routes";

export const routes = {
  // For `/pages/index.tsx`
  top: createRoute("/"),

  // For `/pages/users/index.tsx`
  users: createRoute("/users"),
  // For `/pages/users/[userId].tsx`
  usersDetail: (userId: number) => createRoute("/users/[userId]", { userId }),
};
```
```tsx
// /pages/index.tsx
import Link from "next/link";
import { routes } from "../routes.ts";

const targetUserId = 5;

const Page () => (
  <Link {...routes.usersDetail(targetUserId)}>
    <a>Go to the user page (id: {targetUserId})</a>
  </Link>
);

...
Page.getInitialProps = async ({ res }) => {
  // Redirect to `/users/123&limit=30` .
  // This works fine on client-side and server-side.
  movePage(routes.usersDetail(123), { res, queryParameters: { limit: 30 } })
};
```

<div align="center">
<a href="https://www.npmjs.com/package/next-typed-routes"><img src="https://img.shields.io/npm/v/next-typed-routes.svg" alt="npm"></a>
<a href="https://circleci.com/gh/jagaapple/next-typed-routes"><img src="https://img.shields.io/circleci/project/github/jagaapple/next-typed-routes/master.svg" alt="CircleCI"></a>
<a href="https://codecov.io/gh/jagaapple/next-typed-routes"><img src="https://img.shields.io/codecov/c/github/jagaapple/next-typed-routes.svg"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/jagaapple/next-typed-routes.svg" alt="license"></a>
<a href="https://twitter.com/jagaapple_tech"><img src="https://img.shields.io/badge/contact-%40jagaapple_tech-blue.svg" alt="@jagaapple_tech"></a>
</div>

## Table of Contents

<!-- TOC depthFrom:2 -->

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [Motivation](#motivation)
- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Usage](#usage)
  - [Routes](#routes)
    - [Arguments of `createRoute`](#arguments-of-createroute)
    - [Key names](#key-names)
  - [Page Mover](#page-mover)
- [API](#api)
  - [`createRoute(path, parameters, queryParameters): { href: string, as: string }`](#createroutepath-parameters-queryparameters--href-string-as-string-)
  - [`createPageMover(baseURI, Router): PageMover`](#createpagemoverbaseuri-router-pagemover)
  - [`movePage(path, options): void`](#movepagepath-options-void)
- [Contributing to next-typed-routes](#contributing-to-next-typed-routes)
- [License](#license)

<!-- /TOC -->


## Features

| FEATURES                           | WHAT YOU CAN DO                                          |
|------------------------------------|----------------------------------------------------------|
| ❤️ **Designed for Next.js**         | You can use Next.js routing system without custom server |
| 🌐 **Build for Universal**         | Ready for Universal JavaScript                           |
| 📄 **Write once, Manage one file** | All you need is write routes to one file                 |
| 🎩 **Type Safe**                   | You can use with TypeScript                              |

### Motivation
Next.js 9 is the first version to support dynamic routing without any middleware. It is so useful and easy to use, and it supports
dynamic parameters such as `/users/123` .

However the dynamic parameters do not support to be referred type safely. So when we rename a dynamic parameter, we should search
codes which use the parameter in `<Link>` component and others and replace them with a new parameter name. Also it is thought
that developers may forget to specify required dynamic parameters when creating links.

next-typed-routes provides some APIs to resolve this issues. You can manage all routes with dynamic parameters in one file and
you can create links type safely.


## Quick Start
### Requirements
- npm or Yarn
- Node.js 10.0.0 or higher
- **Next.js 9.0.0 or higher**


### Installation
```bash
$ npm install next-typed-routes
```

If you are using Yarn, use the following command.

```bash
$ yarn add next-typed-routes
```


## Usage
### Routes
```ts
import { createRoute } from "next-typed-routes";

export const routes = {
  // For `/pages/index.tsx`
  top: createRoute("/"),

  // For `/pages/users/index.tsx`
  users: createRoute("/users"),
  // For `/pages/users/[userId].tsx`
  usersDetail: (userId: number) => createRoute("/users/[userId]", { userId }),
};
```

Firstly, you need to define routes using next-typed-routes.

`createRoute` function exported from next-typed-routes returns an object for `<Link>` component props, which has `href` and `as`
properties.
So when you manage values created by `createRoute`, you can get `<Link>` component props via the keys like the following.

```tsx
<Link {...routes.top}>
  <a>Go to top.</a>
</Link>

// Or
<Link href={routes.top.href} as={routes.top.as}>
  <a>Go to top.</a>
</Link>
```

#### Arguments of `createRoute`
Currently, `createRoute` accepts three parameters.

```tsx
<Link {...createRoute("/")} />
<Link {...createRoute("/users", undefined, { limit: 10 })} />
<Link {...createRoute("/users/[userId]/items/[itemId]", { userId: 1, itemId: 2 })} />
```

- `path: string`
  - Required.
  - A page of Next.js. This is a path of files in `/pages` in general.
- `parameters: { [key: string]: number | string | undefined | null }`
  - Optional, default is `{}` .
  - You can give dynamic parameters as object.
- `queryParameters: { [key: string]: number | string | boolean | null | undefined }`
  - Optional, default is `{}` .
  - You can give query string as object.


#### Key names
```ts
import { createRoute } from "next-typed-routes";

export const routes = {
  // For `/pages/index.tsx`
  "/": createRoute("/"),

  // For `/pages/users/index.tsx`
  "/users": createRoute("/users"),
  // For `/pages/users/[userId].tsx`
  "/users/[userId]": (userId: number) => createRoute("/users/[userId]", { userId }),
};
```

You can freely name keys of `routes` , but I recommend you to adopt the same with page file path for key names in order to reduce
the thinking time to name them.

### Page Mover
```ts
import Router from "next/router";
import { createPageMover } from "next-typed-routes";

const movePage = createPageMover("https://you-project.example.com", Router);

movePage("/about");
movePage(createRoute("/"));
```

next-typed-routes provides a function to reidrect to a specific page using `createRoute` . This works fine on cliet-side (web browsers)
and server-side.

If you want to support server-side, you must give `res` object from `getInitialProps` arguments.

```ts
Component.getInitialProps = async ({ res }) => {
  movePage("/about", { res });
};
```


## API
### `createRoute(path, parameters, queryParameters): { href: string, as: string }`
```ts
createRoute("/")
createRoute("/users", undefined, { limit: 10 })
createRoute("/users/[userId]/items/[itemId]", { userId: 1, itemId: 2 })
```

Returns an object for `<Link>` component props.

- `path: string`
  - Required
  - A page of Next.js. This is a path of files in `/pages` in general
- `parameters: { [key: string]: number | string | undefined | null }`
  - Optional, default is `{}`
  - You can give dynamic parameters as object
- `queryParameters: { [key: string]: number | string | boolean | undefined | null }`
  - Optional, default is `{}`
  - You can give query string as object

### `createPageMover(baseURI, Router): PageMover`
```ts
createPageMover("https://you-project.example.com", Router);
createPageMover(new URL("https://you-project.example.com"), Router);
```

Returns a function to redirect URL.

- `baseURI: string | URL`
  - Required
  - Your project base URI
- `Router: NextRouter`
  - Required
  - Give Router object from `next/router` in your project

### `movePage(path, options): void`
```ts
movePage("/about");
movePage(createRoute("/about"));

movePage("/about", { res, statusCode: 301 });
movePage("/about", { res, queryParameters: { limit: 30 } });
```

This function is created from `createPageMover` .

- `path: string | { href: string, as: string }`
  - Required
  - A destination path
  - It is possible to give a return value from `createRoute`
- `options: Options`
  - Optional, default is `{}`
  - `res: ServerResponse`
    - Required if you want to support server-side redirect
    - A sever response object for server-side
    - It is possible to get a context object which contains this from Next.js `getInitialProps` arguments
  - `queryParameters: { [key: string]: number | string | boolean | undefined | null }`
    - An object for query string
    - If `path` already has query string, it will be merged with `queryParameters`
  - `statusCode: 301 | 302`
    - A status code for server-side


## Contributing to next-typed-routes
Bug reports and pull requests are welcome on GitHub at
[https://github.com/jagaapple/next-typed-routes](https://github.com/jagaapple/next-typed-routes).
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

Please read [Contributing Guidelines](./.github/CONTRIBUTING.md) before development and contributing.


## License
The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2019 Jaga Apple. All rights reserved.
