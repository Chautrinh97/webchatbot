import queryString from 'query-string';
type RequestOptions = {
   method?: string;
   headers?: Record<string, string>;
   body?: any;
   params?: Record<string, any>;
   credentials?: RequestCredentials;
};

export const apiService = {
   baseURL: 'http://localhost:9000',
   buildQueryParamsWithQueryString(params: Record<string, any>): string {
      const query = queryString.stringify(params);
      return query ? `?${query}` : '';
   },


   request(endpoint: string, options: RequestOptions = {}) {
      const { params, credentials, ...otherOptions } = options;
      const url = `${this.baseURL}${endpoint}${params ? this.buildQueryParamsWithQueryString(params) : ''}`;
      const defaultHeaders: Record<string, string> = {
         Accept: '*/*',
         'Access-Control-Allow-Origin': '*',
         'timestamp': new Date().toISOString(),
      };

      const isFormData = otherOptions.body instanceof FormData;

      const config: RequestInit = {
         method: otherOptions.method || 'GET',
         headers: isFormData
            ? { ...defaultHeaders, ...otherOptions.headers }
            : { ...defaultHeaders, 'Content-Type': 'application/json', ...otherOptions.headers },
         body: isFormData ? otherOptions.body : otherOptions.body ? JSON.stringify(otherOptions.body) : undefined,
         credentials: credentials || 'include',
      };

      return fetch(url, config);
   },

   get(endpoint: string, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'GET', params, headers, credentials });
   },

   post(endpoint: string, body: any = {}, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'POST', headers, body, params, credentials });
   },

   put(endpoint: string, body: any = {}, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'PUT', headers, body, params, credentials });
   },

   patch(endpoint: string, body: any = {}, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'PATCH', headers, body, params, credentials });
   },

   delete(endpoint: string, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'DELETE', headers, params, credentials });
   },
};


export const apiServiceClient = {
   baseURL: process.env.API_ENDPOINT || '',
   buildQueryParamsWithQueryString(params: Record<string, any>): string {
      const query = queryString.stringify(params);
      return query ? `?${query}` : '';
   },


   request(endpoint: string, options: RequestOptions = {}) {
      const { params, credentials, ...otherOptions } = options;
      const url = `${this.baseURL}${endpoint}${params ? this.buildQueryParamsWithQueryString(params) : ''}`;
      const defaultHeaders: Record<string, string> = {
         Accept: '*/*',
         'Access-Control-Allow-Origin': '*',
         'timestamp': new Date().toISOString(),
      };

      const isFormData = otherOptions.body instanceof FormData;
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
         defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
       }

      const config: RequestInit = {
         method: otherOptions.method || 'GET',
         headers: isFormData
            ? { ...defaultHeaders, ...otherOptions.headers }
            : { ...defaultHeaders, 'Content-Type': 'application/json', ...otherOptions.headers },
         body: isFormData ? otherOptions.body : otherOptions.body ? JSON.stringify(otherOptions.body) : undefined,
         credentials: credentials || 'include',
      };

      return fetch(url, config);
   },

   get(endpoint: string, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'GET', params, headers, credentials });
   },

   post(endpoint: string, body: any = {}, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'POST', headers, body, params, credentials });
   },

   put(endpoint: string, body: any = {}, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'PUT', headers, body, params, credentials });
   },

   patch(endpoint: string, body: any = {}, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'PATCH', headers, body, params, credentials });
   },

   delete(endpoint: string, params: Record<string, any> = {}, headers: Record<string, string> = {}, credentials?: RequestCredentials) {
      return this.request(endpoint, { method: 'DELETE', headers, params, credentials });
   },
};