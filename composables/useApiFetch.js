export function useApiFetch(path, options) {
    let headers = {};
  
    const token = useCookie('XSRF-TOKEN');
  
    if (token.value) {
      headers['X-XSRF-TOKEN'] = token.value;
    }
  
    if (process.server) {
      headers = {
        ...headers,
        ...useRequestHeaders(['referer', 'cookie']),
      };
    }
  
    return useFetch('https://peso-job-matching-portal-6im3u.ondigitalocean.app' + path, {
      credentials: 'include',
      watch: false,
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });
  }