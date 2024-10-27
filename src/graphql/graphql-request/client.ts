import {
  gql,
  GraphQLClient,
  RequestDocument,
  RawRequestOptions,
  Variables,
  RequestOptions,
} from 'graphql-request';
type GraphQLClientRequestHeaders = RawRequestOptions['requestHeaders'];
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { RefreshTokenMutation } from '@/gql/graphql';
import { isGraphQLRequestError } from '@/utils/graphql/is-graphql-request-error';
import { requestMiddlewareUploadFiles } from './request-middleware-upload-files';

class AuthenticatedGraphQLClient extends GraphQLClient {
  private refreshTokenPromise: Promise<RefreshTokenMutation> | null = null;

  async request<T = any, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    ...variablesAndRequestHeaders: V extends Record<any, never>
      ? [variables?: V, requestHeaders?: GraphQLClientRequestHeaders]
      : keyof V extends never
        ? [variables?: V, requestHeaders?: GraphQLClientRequestHeaders]
        : [variables: V, requestHeaders?: GraphQLClientRequestHeaders]
  ): Promise<T>;
  async request<T = any, V extends Variables = Variables>(
    options: RequestOptions<V, T>,
  ): Promise<T>;
  async request<T = any, V extends Variables = Variables>(
    documentOrOptions:
      | RequestDocument
      | TypedDocumentNode<T, V>
      | RequestOptions<V, T>,
    ...variablesAndRequestHeaders: any[]
  ): Promise<T> {
    console.log({ variablesAndRequestHeaders });

    try {
      return await (super.request as any)(
        documentOrOptions,
        ...variablesAndRequestHeaders,
      );
    } catch (error: any) {
      import.meta.env.DEV && console.log({ error });
      if (
        isGraphQLRequestError(error) &&
        error.response?.errors?.[0]?.extensions?.code === 'TOKEN_EXPIRED'
      ) {
        await this.refreshTokens();
        return await (super.request as any)(
          documentOrOptions,
          ...variablesAndRequestHeaders,
        );
      }
      throw error;
    }
  }

  private async refreshTokens(): Promise<void> {
    if (!this.refreshTokenPromise) {
      this.refreshTokenPromise = super.request<RefreshTokenMutation>(gql`
        mutation RefreshToken {
          refreshToken {
            accessToken
            refreshToken
          }
        }
      `);
    }

    try {
      const { refreshToken } = await this.refreshTokenPromise;

      console.log({ refreshToken });
    } catch (error) {
      console.error('Failed to refresh token: ', error);
      this.refreshTokenPromise = null;
      throw error;
    } finally {
      this.refreshTokenPromise = null;
    }
  }
}

export const client = new AuthenticatedGraphQLClient(
  import.meta.env.VITE_GRAPHQL_URI,
  {
    requestMiddleware: requestMiddlewareUploadFiles,
    mode: 'cors',
    credentials: 'include',
    async fetch(url, opts = {}) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'GET', url as string, true);

        // Set headers
        if (opts.headers) {
          Object.entries(opts.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        // Track upload progress
        xhr.upload.onprogress = event => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;

            if (opts.progressCallback) {
              opts.progressCallback(percentComplete.toFixed());
            }
          }
        };

        // Handle response
        xhr.onload = () => {
          const headers = parseHeaders(xhr.getAllResponseHeaders());
          const responseBody = xhr.responseText;

          const response = new Response(responseBody, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: headers,
          });

          resolve(response);
        };

        // Handle errors
        xhr.onerror = () => reject(new TypeError('Network request failed'));
        xhr.ontimeout = () =>
          reject(new TypeError('Network request timed out'));
        xhr.onabort = () => reject(new TypeError('Network request aborted'));

        // Send the request
        xhr.send((opts.body as XMLHttpRequestBodyInit) || null);
      });
    },
  },
);

// Utility function to parse headers from the XHR response
function parseHeaders(headerStr: string) {
  const headers = new Headers();
  if (!headerStr) {
    return headers;
  }
  const headerPairs = headerStr.split('\u000d\u000a');
  for (const header of headerPairs) {
    const [key, ...rest] = header.split(': ');
    const value = rest.join(': ');
    if (key) {
      headers.append(key, value);
    }
  }
  return headers;
}
