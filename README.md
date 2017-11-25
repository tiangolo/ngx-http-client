# ngx-http-client

Angular (4.3+) `HttpClientModule` with parameter encodings compatible with back ends (Node.js, Python, PHP, etc). 

## How to use

* Install it in your Angular project:

```bash
npm install --save ngx-http-client
```

* Follow [Angular's guide on `HttpClient`](https://angular.io/guide/http).
* At some point, in one single place in your code, most probably in a file `app.module.ts`, the guide will tell you to import `HttpClientModule` like:

```TypeScript
import {HttpClientModule} from '@angular/common/http';
```

* Replace that `HttpClientModule` for the one from this package, like:

```TypeScript
// import {HttpClientModule} from '@angular/common/http';

import {HttpClientModule} from 'ngx-http-client';
```

And that's it. You only have to change that line above. And you can continue using `HttpClient` as normally. In the rest of your code (your components and services) you should import `HttpClient` from Angular as normally:

```TypeScript
// This line would look the same with or without installing this package
import { HttpClient } from '@angular/common/http';
```

## The problem

If you use the normal `HttpClientModule`, at some point you might want to send parameters in your URL. 

Let's say that you want to send the time zone of the user as a parameter `timezone`. And one of your users has a time zone of +03:00 UTC.

Your code uses the `HttpClient` normally, for example:

```TypeScript
this.http.get('http://example.com', {
      params: {
        timezone: userTimezone,
      }
    }).subscribe(
        ...
    )
```

Your front end will send the timezone to the back end like:

```
http://example.com?timezone=+03:00
```

But your back end (be it Node.js, Python, PHP or several others) will receive that parameter like:

```JSON
{
    "timezone": " 03:00"
}
```

...because it will interpret the raw `+` sign as a replacement for a space.

But you need your back end to see it as:

```JSON
{
    "timezone": "+03:00"
}
```

For that, your front end (your Angular app, using `HttpClientModule` ) should encode it like:

```
http://example.com?timezone=%2B03%3A00
```

This package makes `HttpClientModule` encode `+` and all the special characters in the way the back end systems can understand them.

That's the most simple and straightforward example. But the same kinds of problems might occur for these other characters:

```
@ : $ , ; + = ? /
```

## Warning note

There are some back end systems that expect you to send the raw, unencoded characters. In those cases, you might try to use the standard `HttpClientModule` or maybe even better, form the complete URL in your side, making sure that you encode everything as expected by the specific back end in your code.


## Very technical details

**Note**: You most probably don't need to read this part. The problem actually goes to the deep roots of the web itself. If you want to know all the details, continue reading.

The `HttpClient` from Angular [inherited](https://github.com/angular/angular/blob/master/packages/common/http/src/params.ts#L57) previous code from [`@angular/http`](https://github.com/angular/angular/blob/master/packages/http/src/url_search_params.ts#L33).

The previous code was modified to decode those special characters after being encoded by the browser's JavaScript [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).


The code has a comment citing [IETF RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.4), claiming that it re-decodes the characters because they "are allowed to be part of the query".

The RFC only says that the query component allows several characters in "the query component". But it refers to the query component as everything that goes after the `?` and before the `#`. So, it specifies which characters are allowed in that whole string, but it doesn't refer to how to encode keys and values *inside*  that query string. 

I think that the Angular implementation was assuming that those characters where the ones allowed for parameter key and values separated by `=`. But that same assumption would imply that if you want to send a parameter `user` with value `age=20` that would mean that the URL would be written as:

```
http://example.com?user=age=20
```

How should a back end interpret that? Is there a parameter `age` with value `20`? Now imagine what would happen if the value of a parameter was a string including `&`.

The W3C (World Wide Web), directed by the same person that created the RFC from above, the HTML standard and the HTTP protocol (the inventor of the web, Sir Tim Berners-Lee), said later that [*"Within the query string, the plus sign ( `+` ) is reserved as shorthand notation for a space. Therefore, real plus signs must be encoded."*](https://www.w3.org/Addressing/URL/4_URI_Recommentations.html)  (In the "**Query strings**" section).

Apart from that, there is no standard on how to encode parameters in the "query component" of a URL (the section after the `?` until a `#` character or the end of the string). Specifically, there is no standard on how to encode keys or values.

Browsers have a [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) that converts a string with special characters (like the ones above) into an encoded string. That allows URLs to have values with strings that have characters that otherwise would have a special meaning. E.g. separating a parameter key from a parameter value ( "`=`" would be encoded as "`%3D`" ), separating a parameter key-value pair from another ( "`&`" would be encoded as "`%26`" ), including a space character inside the string ( "`+`" would be encoded as "`%2B`" and the space character "` `" as "`%20`" ), etc. And although the `encodeURIComponent` function would encode a literal space character as `%20`, most back end languages would also interpret the `+` symbol as a replacement of a space character.

Several (most) programming languages parse URL parameters decoding the key and value pairs using a compatible (or the same) encoding system.

As a result, if you have a back end in Node.js, Python, PHP or several others, the language will expect to parse the query component of the URL as a mapping of parameter keys to values, with the keys and values encoded using that standard or a compatible one.

There is a [PR to Angular with the same code changes in this package](https://github.com/angular/angular/pull/19710). But up to the date of publishing this package, it has not received any attention.

There are also [several](https://github.com/angular/angular/issues/11058) - [long](https://github.com/angular/angular/issues/18884) - [threads](https://github.com/angular/angular/issues/18274) related to [this](https://github.com/angular/angular/issues/14531) - [same](https://github.com/angular/angular/issues/13077) - [problem](https://github.com/angular/angular/issues/18261) in issues of the Angular GitHub repository with even discussion about the problem.