import { decode, encode, type TwilicValue } from "@twilic/core";
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import "./types.js";

export const TWILIC_CONTENT_TYPE = "application/vnd.twilic";

export interface TwilicCodec {
  encode: (value: TwilicValue) => Uint8Array;
  decode: (bytes: Uint8Array) => TwilicValue;
}

function hasTwilicContentType(contentType: string | undefined): boolean {
  return contentType?.startsWith(TWILIC_CONTENT_TYPE) ?? false;
}

function normalizeContentType(
  contentType: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(contentType)) {
    return contentType[0];
  }
  return contentType;
}

function toUint8Array(data: unknown): Uint8Array {
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
  if (typeof data === "string") {
    return new Uint8Array(Buffer.from(data, "binary"));
  }
  throw new Error("Unsupported axios response data for Twilic decode");
}

export function twilicRequestInterceptor(
  codec: TwilicCodec,
): (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig {
  return (config) => {
    if (config.twilicBody === undefined) {
      return config;
    }

    config.data = Buffer.from(codec.encode(config.twilicBody));
    config.headers.set("Content-Type", TWILIC_CONTENT_TYPE);

    if (config.twilicResponse ?? true) {
      config.responseType = "arraybuffer";
    }

    return config;
  };
}

export function twilicResponseInterceptor(
  codec: TwilicCodec,
): (response: AxiosResponse) => AxiosResponse {
  return (response) => {
    const contentType = normalizeContentType(
      response.headers["content-type"] as string | string[] | undefined,
    );

    if (!hasTwilicContentType(contentType)) {
      return response;
    }

    response.data = codec.decode(toUint8Array(response.data));
    return response;
  };
}

const defaultCodec: TwilicCodec = {
  encode,
  decode,
};

export function createTwilicAxios(
  instance: AxiosInstance = axios.create(),
  codec: TwilicCodec = defaultCodec,
): AxiosInstance {
  instance.interceptors.request.use(twilicRequestInterceptor(codec));
  instance.interceptors.response.use(twilicResponseInterceptor(codec));
  return instance;
}
