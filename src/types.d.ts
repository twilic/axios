import type { TwilicValue } from "@twilic/core";
import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    twilicBody?: TwilicValue;
    twilicResponse?: boolean;
  }
}

export {};
