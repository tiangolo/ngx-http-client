/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A codec for encoding and decoding parameters in URLs.
 *
 * Used by `HttpParams`.
 *
 * @stable
 **/

 import { 
   HttpParameterCodec,
   HttpUrlEncodingCodec,
   } from '@angular/common/http';

   /**
 * A `HttpParameterCodec` that uses `encodeURIComponent` and `decodeURIComponent` to
 * serialize and parse URL parameter keys and values.
 *
 * @stable
 */
export class WebHttpUrlEncodingCodec implements HttpParameterCodec {
  encodeKey(k: string): string { return standardEncoding(k); }

  encodeValue(v: string): string { return standardEncoding(v); }

  decodeKey(k: string): string { return decodeURIComponent(k); }

  decodeValue(v: string) { return decodeURIComponent(v); }
}

function standardEncoding(v: string): string {
  return encodeURIComponent(v);
      // .replace(/%40/gi, '@')
      // .replace(/%3A/gi, ':')
      // .replace(/%24/gi, '$')
      // .replace(/%2C/gi, ',')
      // .replace(/%3B/gi, ';')
      // .replace(/%2B/gi, '+')
      // .replace(/%3D/gi, '=')
      // .replace(/%3F/gi, '?')
      // .replace(/%2F/gi, '/');
}
/** Options used to construct an `HttpParams` instance. */
export interface HttpParamsOptions {
  /**
   * String representation of the HTTP params in URL-query-string format. Mutually exclusive with
   * `fromObject`.
   */
  fromString?: string;
  /** Object map of the HTTP params. Mutally exclusive with `fromString`. */
  fromObject?: {
      [param: string]: string | string[];
  };
  /** Encoding codec used to parse and serialize the params. */
  encoder?: HttpParameterCodec;
}
