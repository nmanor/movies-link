import { useState, useEffect } from 'react';

const useDebounce = (value, timeout = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), timeout);
    return () => clearTimeout(handler);
  }, [value, timeout]);

  return debouncedValue;
};

export default useDebounce;
