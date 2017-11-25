/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, ModuleWithProviders, NgModule, Optional} from '@angular/core';

import { HttpClient, HttpClientModule as NgHttpClientModule } from '@angular/common/http';

import { WebHttpClient } from './client';

/**
 * `NgModule` which provides the `HttpClient` and associated services.
 *
 * Interceptors can be added to the chain behind `HttpClient` by binding them
 * to the multiprovider for `HTTP_INTERCEPTORS`.
 *
 * @stable
 */
@NgModule({
  imports: [
    NgHttpClientModule,
  ],
  providers: [
    {provide: HttpClient, useClass: WebHttpClient},
  ],
})
export class HttpClientModule {
}
