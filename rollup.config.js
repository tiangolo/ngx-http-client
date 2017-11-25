const globals = {
  '@angular/core': 'ng.core',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/common': 'ng.common',
  '@angular/common/http': 'ng.common.http',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subject': 'Rx',

  'rxjs/observable/of': 'Rx.Observable.prototype',

  'rxjs/operator/concatMap': 'Rx.Observable.prototype',
  'rxjs/operator/filter': 'Rx.Observable.prototype',
  'rxjs/operator/map': 'Rx.Observable.prototype',
};

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/http.umd.js',
    format: 'umd',
  },
  name: 'ngxHttpClient',
  external: Object.keys(globals),
  globals: globals
};
