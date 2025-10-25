var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/endpoint.ts
import { ZodError } from "zod";

// src/error.ts
var APIError = class extends Error {
  constructor(status, body) {
    super(`API Error: ${status} ${body?.message ?? ""}`, {
      cause: body
    });
    __publicField(this, "status");
    __publicField(this, "body");
    this.status = status;
    this.body = body ?? {};
    this.stack = "";
    this.name = "BetterCallAPIError";
  }
};

// src/helper.ts
var json = (body, option) => {
  return {
    response: {
      body: option?.body ?? body,
      status: option?.status ?? 200,
      statusText: option?.statusText ?? "OK",
      headers: option?.headers
    },
    body,
    _flag: "json"
  };
};

// src/cookie.ts
var algorithm = { name: "HMAC", hash: "SHA-256" };
var getCryptoKey = async (secret) => {
  const secretBuf = typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
  return await crypto.subtle.importKey("raw", secretBuf, algorithm, false, ["sign", "verify"]);
};
var makeSignature = async (value, secret) => {
  const key = await getCryptoKey(secret);
  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    new TextEncoder().encode(value)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
var verifySignature = async (base64Signature, value, secret) => {
  try {
    const signatureBinStr = atob(base64Signature);
    const signature = new Uint8Array(signatureBinStr.length);
    for (let i = 0, len = signatureBinStr.length; i < len; i++) {
      signature[i] = signatureBinStr.charCodeAt(i);
    }
    return await crypto.subtle.verify(
      algorithm,
      secret,
      signature,
      new TextEncoder().encode(value)
    );
  } catch (e) {
    return false;
  }
};
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
  const pairs = cookie.trim().split(";");
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      return parsedCookie;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      return parsedCookie;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent(cookieValue);
    }
    return parsedCookie;
  }, {});
};
var parseSigned = async (cookie, secret, name) => {
  const parsedCookie = {};
  const secretKey = await getCryptoKey(secret);
  for (const [key, value] of Object.entries(parse(cookie, name))) {
    const signatureStartPos = value.lastIndexOf(".");
    if (signatureStartPos < 1) {
      continue;
    }
    const signedValue = value.substring(0, signatureStartPos);
    const signature = value.substring(signatureStartPos + 1);
    if (signature.length !== 44 || !signature.endsWith("=")) {
      continue;
    }
    const isVerified = await verifySignature(signature, signedValue, secretKey);
    parsedCookie[key] = isVerified ? signedValue : false;
  }
  return parsedCookie;
};
var _serialize = (name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (name.startsWith("__Secure-") && !opt.secure) {
    opt.secure = true;
  }
  if (name.startsWith("__Host-")) {
    if (!opt.secure) {
      opt.secure = true;
    }
    if (opt.path !== "/") {
      opt.path = "/";
    }
    if (opt.domain) {
      opt.domain = void 0;
    }
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) {
      throw new Error(
        "Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration."
      );
    }
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain && opt.prefix !== "host") {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) {
      throw new Error(
        "Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future."
      );
    }
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  }
  if (opt.partitioned) {
    if (!opt.secure) {
      throw new Error("Partitioned Cookie must have Secure attributes");
    }
    cookie += "; Partitioned";
  }
  return cookie;
};
var serialize = (name, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
};
var serializeSigned = async (name, value, secret, opt = {}) => {
  const signature = await makeSignature(value, secret);
  value = `${value}.${signature}`;
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
};

// src/cookie-utils.ts
var getCookie = (cookie, key, prefix) => {
  if (!cookie) {
    return void 0;
  }
  let finalKey = key;
  if (prefix) {
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    } else {
      return void 0;
    }
  }
  const obj = parse(cookie, finalKey);
  return obj[finalKey];
};
var setCookie = (header, name, value, opt) => {
  let cookie;
  if (opt?.prefix === "secure") {
    cookie = serialize("__Secure-" + name, value, { path: "/", ...opt, secure: true });
  } else if (opt?.prefix === "host") {
    cookie = serialize("__Host-" + name, value, {
      ...opt,
      path: "/",
      secure: true,
      domain: void 0
    });
  } else {
    cookie = serialize(name, value, { path: "/", ...opt });
  }
  header.append("Set-Cookie", cookie);
};
var setSignedCookie = async (header, name, value, secret, opt) => {
  let cookie;
  if (opt?.prefix === "secure") {
    cookie = await serializeSigned("__Secure-" + name, value, secret, {
      path: "/",
      ...opt,
      secure: true
    });
  } else if (opt?.prefix === "host") {
    cookie = await serializeSigned("__Host-" + name, value, secret, {
      ...opt,
      path: "/",
      secure: true,
      domain: void 0
    });
  } else {
    cookie = await serializeSigned(name, value, secret, { path: "/", ...opt });
  }
  header.append("Set-Cookie", cookie);
};
var getSignedCookie = async (header, secret, key, prefix) => {
  const cookie = header.get("cookie");
  if (!cookie) {
    return void 0;
  }
  let finalKey = key;
  if (prefix) {
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
  }
  const obj = await parseSigned(cookie, secret, finalKey);
  return obj[finalKey];
};

// src/endpoint.ts
function createEndpointCreator(opts) {
  return (path, options, handler) => {
    return createEndpoint(
      path,
      {
        ...options,
        use: [...options?.use || [], ...opts?.use || []]
      },
      handler
    );
  };
}
function createEndpoint(path, options, handler) {
  const responseHeader = new Headers();
  const handle = async (...ctx) => {
    let internalCtx = {
      setHeader(key, value) {
        responseHeader.set(key, value);
      },
      setCookie(key, value, options2) {
        setCookie(responseHeader, key, value, options2);
      },
      getCookie(key, prefix) {
        const header = ctx[0]?.headers;
        const cookieH = header?.get("cookie");
        const cookie = getCookie(cookieH || "", key, prefix);
        return cookie;
      },
      getSignedCookie(key, secret, prefix) {
        const header = ctx[0]?.headers;
        if (!header) {
          throw new TypeError("Headers are required");
        }
        const cookie = getSignedCookie(header, secret, key, prefix);
        return cookie;
      },
      async setSignedCookie(key, value, secret, options2) {
        await setSignedCookie(responseHeader, key, value, secret, options2);
      },
      redirect(url) {
        responseHeader.set("Location", url);
        return new APIError("FOUND");
      },
      json,
      context: ctx[0]?.context || {},
      _flag: ctx[0]?._flag,
      responseHeader,
      path,
      ...ctx[0] || {}
    };
    if (options.use?.length) {
      let middlewareContexts = {};
      let middlewareBody = {};
      for (const middleware of options.use) {
        if (typeof middleware !== "function") {
          console.warn("Middleware is not a function", {
            middleware
          });
          continue;
        }
        const res2 = await middleware(internalCtx);
        if (res2) {
          const body = res2.options?.body ? res2.options.body.parse(internalCtx.body) : void 0;
          middlewareContexts = {
            ...middlewareContexts,
            ...res2
          };
          middlewareBody = {
            ...middlewareBody,
            ...body
          };
        }
      }
      internalCtx = {
        ...internalCtx,
        body: {
          ...middlewareBody,
          ...internalCtx.body
        },
        context: {
          ...internalCtx.context || {},
          ...middlewareContexts
        }
      };
    }
    try {
      const body = options.body ? options.body.parse(internalCtx.body) : internalCtx.body;
      internalCtx = {
        ...internalCtx,
        body: body ? {
          ...body,
          ...internalCtx.body
        } : internalCtx.body
      };
      internalCtx.query = options.query ? options.query.parse(internalCtx.query) : internalCtx.query;
    } catch (e) {
      if (e instanceof ZodError) {
        throw new APIError("BAD_REQUEST", {
          message: e.message,
          details: e.errors
        });
      }
      throw e;
    }
    if (options.requireHeaders && !internalCtx.headers) {
      throw new APIError("BAD_REQUEST", {
        message: "Headers are required"
      });
    }
    if (options.requireRequest && !internalCtx.request) {
      throw new APIError("BAD_REQUEST", {
        message: "Request is required"
      });
    }
    let res = await handler(internalCtx);
    let actualResponse = res;
    if (res && typeof res === "object" && "_flag" in res) {
      if (res._flag === "json" && internalCtx._flag === "router") {
        const h = res.response.headers;
        Object.keys(h || {}).forEach((key) => {
          responseHeader.set(key, h[key]);
        });
        actualResponse = new Response(JSON.stringify(res.response.body), {
          status: res.response.status ?? 200,
          statusText: res.response.statusText,
          headers: responseHeader
        });
      } else {
        actualResponse = res.body;
      }
    }
    return actualResponse;
  };
  handle.path = path;
  handle.options = options;
  handle.method = options.method;
  handle.headers = responseHeader;
  return handle;
}

// src/router.ts
import { createRouter as createRou3Router, addRoute, findRoute, findAllRoutes } from "rou3";

// src/utils.ts
async function getBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!request.body) {
    return void 0;
  }
  if (contentType.includes("application/json")) {
    return await request.json();
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    const result = {};
    formData.forEach((value, key) => {
      result[key] = value.toString();
    });
    return result;
  }
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const result = {};
    formData.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (contentType.includes("text/plain")) {
    return await request.text();
  }
  if (contentType.includes("application/octet-stream")) {
    return await request.arrayBuffer();
  }
  if (contentType.includes("application/pdf") || contentType.includes("image/") || contentType.includes("video/")) {
    const blob = await request.blob();
    return blob;
  }
  if (contentType.includes("application/stream") || request.body instanceof ReadableStream) {
    return request.body;
  }
  return await request.text();
}
function shouldSerialize(body) {
  return typeof body === "object" && body !== null && !(body instanceof Blob) && !(body instanceof FormData);
}
var statusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  "I'M_A_TEAPOT": 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};

// src/router.ts
var createRouter = (endpoints, config) => {
  const _endpoints = Object.values(endpoints);
  const router = createRou3Router();
  for (const endpoint of _endpoints) {
    if (Array.isArray(endpoint.options?.method)) {
      for (const method of endpoint.options.method) {
        addRoute(router, method, endpoint.path, endpoint);
      }
    } else {
      addRoute(router, endpoint.options.method, endpoint.path, endpoint);
    }
  }
  const middlewareRouter = createRou3Router();
  for (const route of config?.routerMiddleware || []) {
    addRoute(middlewareRouter, "*", route.path, route.middleware);
  }
  const handler = async (request) => {
    const url = new URL(request.url);
    let path = url.pathname;
    if (config?.basePath) {
      path = path.split(config.basePath)[1];
    }
    if (!path?.length) {
      config?.onError?.(new APIError("NOT_FOUND"));
      console.warn(
        `[better-call]: Make sure the URL has the basePath (${config?.basePath}).`
      );
      return new Response(null, {
        status: 404,
        statusText: "Not Found"
      });
    }
    const method = request.method;
    const route = findRoute(router, method, path);
    const handler2 = route?.data;
    const body = await getBody(request);
    const headers = request.headers;
    const query = Object.fromEntries(url.searchParams);
    const routerMiddleware = findAllRoutes(middlewareRouter, "*", path);
    if (!handler2) {
      return new Response(null, {
        status: 404,
        statusText: "Not Found"
      });
    }
    try {
      let middlewareContext = {};
      if (routerMiddleware?.length) {
        for (const route2 of routerMiddleware) {
          const middleware = route2.data;
          const res = await middleware({
            path,
            method,
            headers,
            params: route2?.params,
            request,
            body,
            query,
            context: {
              ...config?.extraContext
            }
          });
          if (res instanceof Response) {
            return res;
          }
          if (res?._flag === "json") {
            return new Response(JSON.stringify(res), {
              headers: res.headers
            });
          }
          if (res) {
            middlewareContext = {
              ...res,
              ...middlewareContext
            };
          }
        }
      }
      const handlerRes = await handler2({
        path,
        method,
        headers,
        params: route?.params,
        request,
        body,
        query,
        _flag: "router",
        context: {
          ...middlewareContext,
          ...config?.extraContext
        }
      });
      if (handlerRes instanceof Response) {
        return handlerRes;
      }
      const resBody = shouldSerialize(handlerRes) ? JSON.stringify(handlerRes) : handlerRes;
      return new Response(resBody, {
        headers: handler2.headers
      });
    } catch (e) {
      if (config?.onError) {
        const onErrorRes = await config.onError(e);
        if (onErrorRes instanceof Response) {
          return onErrorRes;
        }
      }
      if (e instanceof APIError) {
        return new Response(e.body ? JSON.stringify(e.body) : null, {
          status: statusCode[e.status],
          statusText: e.status,
          headers: handler2.headers
        });
      }
      if (config?.throwError) {
        throw e;
      }
      return new Response(null, {
        status: 500,
        statusText: "Internal Server Error"
      });
    }
  };
  return {
    handler: async (request) => {
      const onReq = await config?.onRequest?.(request);
      if (onReq instanceof Response) {
        return onReq;
      }
      const req = onReq instanceof Request ? onReq : request;
      const res = await handler(req);
      const onRes = await config?.onResponse?.(res);
      if (onRes instanceof Response) {
        return onRes;
      }
      return res;
    },
    endpoints
  };
};

// src/middleware.ts
function createMiddleware(optionsOrHandler, handler) {
  if (typeof optionsOrHandler === "function") {
    return createEndpoint(
      "*",
      {
        method: "*"
      },
      optionsOrHandler
    );
  }
  if (!handler) {
    throw new Error("Middleware handler is required");
  }
  const endpoint = createEndpoint(
    "*",
    {
      ...optionsOrHandler,
      method: "*"
    },
    handler
  );
  return endpoint;
}
var createMiddlewareCreator = (opts) => {
  function fn(optionsOrHandler, handler) {
    if (typeof optionsOrHandler === "function") {
      return createEndpoint(
        "*",
        {
          method: "*"
        },
        optionsOrHandler
      );
    }
    if (!handler) {
      throw new Error("Middleware handler is required");
    }
    const endpoint = createEndpoint(
      "*",
      {
        ...optionsOrHandler,
        method: "*"
      },
      handler
    );
    return endpoint;
  }
  return fn;
};

// src/types.ts
import "zod";

// src/adapter/request.ts
import * as set_cookie_parser from "set-cookie-parser";
function get_raw_body(req, body_size_limit) {
  const h = req.headers;
  if (!h["content-type"]) return null;
  const content_length = Number(h["content-length"]);
  if (req.httpVersionMajor === 1 && isNaN(content_length) && h["transfer-encoding"] == null || content_length === 0) {
    return null;
  }
  let length = content_length;
  if (body_size_limit) {
    if (!length) {
      length = body_size_limit;
    } else if (length > body_size_limit) {
      throw Error(
        `Received content-length of ${length}, but only accept up to ${body_size_limit} bytes.`
      );
    }
  }
  if (req.destroyed) {
    const readable = new ReadableStream();
    readable.cancel();
    return readable;
  }
  let size = 0;
  let cancelled = false;
  return new ReadableStream({
    start(controller) {
      req.on("error", (error) => {
        cancelled = true;
        controller.error(error);
      });
      req.on("end", () => {
        if (cancelled) return;
        controller.close();
      });
      req.on("data", (chunk) => {
        if (cancelled) return;
        size += chunk.length;
        if (size > length) {
          cancelled = true;
          controller.error(
            new Error(
              `request body size exceeded ${content_length ? "'content-length'" : "BODY_SIZE_LIMIT"} of ${length}`
            )
          );
          return;
        }
        controller.enqueue(chunk);
        if (controller.desiredSize === null || controller.desiredSize <= 0) {
          req.pause();
        }
      });
    },
    pull() {
      req.resume();
    },
    cancel(reason) {
      cancelled = true;
      req.destroy(reason);
    }
  });
}
function getRequest({
  request,
  base,
  bodySizeLimit
}) {
  return new Request(base + request.url, {
    // @ts-expect-error
    duplex: "half",
    method: request.method,
    body: get_raw_body(request, bodySizeLimit),
    headers: request.headers
  });
}
async function setResponse(res, response) {
  for (const [key, value] of response.headers) {
    try {
      res.setHeader(
        key,
        key === "set-cookie" ? set_cookie_parser.splitCookiesString(response.headers.get(key)) : value
      );
    } catch (error) {
      res.getHeaderNames().forEach((name) => res.removeHeader(name));
      res.writeHead(500).end(String(error));
      return;
    }
  }
  res.writeHead(response.status);
  if (!response.body) {
    res.end();
    return;
  }
  if (response.body.locked) {
    res.end(
      "Fatal error: Response body is locked. This can happen when the response was already read (for example through 'response.json()' or 'response.text()')."
    );
    return;
  }
  const reader = response.body.getReader();
  if (res.destroyed) {
    reader.cancel();
    return;
  }
  const cancel = (error) => {
    res.off("close", cancel);
    res.off("error", cancel);
    reader.cancel(error).catch(() => {
    });
    if (error) res.destroy(error);
  };
  res.on("close", cancel);
  res.on("error", cancel);
  next();
  async function next() {
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.write(value)) {
          res.once("drain", next);
          return;
        }
      }
      res.end();
    } catch (error) {
      cancel(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

// src/adapter/node.ts
function toNodeHandler(handler) {
  return async (req, res) => {
    const protocol = req.connection?.encrypted ? "https" : "http";
    const base = `${protocol}://${req.headers[":authority"] || req.headers.host}`;
    const response = await handler(getRequest({ base, request: req }));
    setResponse(res, response);
  };
}
export {
  APIError,
  createEndpoint,
  createEndpointCreator,
  createMiddleware,
  createMiddlewareCreator,
  createRouter,
  getBody,
  getCookie,
  getRequest,
  getSignedCookie,
  parse,
  parseSigned,
  serialize,
  serializeSigned,
  setCookie,
  setResponse,
  setSignedCookie,
  shouldSerialize,
  statusCode,
  toNodeHandler
};
//# sourceMappingURL=index.js.map