import { useSearchParams } from 'react-router-dom';

export const useUrlParams = <T extends Record<string, string>>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParams = (): Partial<T> => {
    const params: Partial<T> = {};
    searchParams.forEach((value, key) => {
      (params as any)[key] = value;
    });
    return params;
  };

  const setParams = (params: Partial<T>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Remove existing params
    Array.from(newParams.keys()).forEach(key => {
      if (!(key in params)) {
        newParams.delete(key);
      }
    });

    // Add new params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const updateParams = (params: Partial<T>) => {
    const currentParams = getParams();
    setParams({ ...currentParams, ...params });
  };

  const clearParams = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    params: getParams(),
    setParams,
    updateParams,
    clearParams
  };
}; 