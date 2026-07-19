# @twilic/axios

Axios interceptors for Twilic binary request and response bodies.

## Install

```bash
pnpm add @twilic/axios axios @twilic/core
```

## Usage

```ts
import axios from "axios";
import { createTwilicAxios } from "@twilic/axios";

const client = createTwilicAxios(axios.create());

const { data } = await client.post("/api/users", null, {
  twilicBody: { id: 1n, name: "alice" },
});
```

Set `twilicResponse: false` on a request when you expect a non-Twilic response body.

## API

- `TWILIC_CONTENT_TYPE`
- `createTwilicAxios(instance?, codec?)`
- `twilicRequestInterceptor(codec?)`
- `twilicResponseInterceptor(codec?)`

## Runnable example

```bash
pnpm example:http-roundtrip          # any server from twilic/examples
pnpm example:http-roundtrip:axios    # this package
```

See [`http-roundtrip/`](https://github.com/twilic/examples/tree/main/http-roundtrip).

## Changelog

See [docs/CHANGELOG.md](docs/CHANGELOG.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
