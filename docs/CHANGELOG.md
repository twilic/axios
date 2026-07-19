# Changelog

## [Unreleased]

## [0.1.2] - 2026-07-20

### Fixed

- Ship Axios `AxiosRequestConfig` TypeScript augmentations (`twilicBody`, `twilicResponse`) in the published package.

## [0.1.1] - 2026-06-08

Initial public release of `@twilic/axios`. Version 0.1.0 was published locally without npm trusted publishing and is not part of the canonical release line.

### Added

- `TWILIC_CONTENT_TYPE` constant.
- `twilicRequestInterceptor(codec?)` to encode `config.twilicBody`.
- `twilicResponseInterceptor(codec?)` to decode Twilic response bodies.
- `createTwilicAxios(instance?, codec?)` factory attaching both interceptors.
- Axios `AxiosRequestConfig` augmentation for `twilicBody` and `twilicResponse`.
- Node integration tests with an echo HTTP server.
