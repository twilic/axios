# Changelog

## [Unreleased]

## [0.1.0] - 2026-06-08

Initial public release of `@twilic/axios`.

### Added

- `TWILIC_CONTENT_TYPE` constant.
- `twilicRequestInterceptor(codec?)` to encode `config.twilicBody`.
- `twilicResponseInterceptor(codec?)` to decode Twilic response bodies.
- `createTwilicAxios(instance?, codec?)` factory attaching both interceptors.
- Axios `AxiosRequestConfig` augmentation for `twilicBody` and `twilicResponse`.
- Node integration tests with an echo HTTP server.
