import { useRef, useEffect } from 'react';

export default function useUpdateEffect(f, a = [], c = undefined) {
  const ref = useRef(0);

  useEffect(() => {
    if (ref.current == 2) {
      f();
    }
    else {
      ref.current++;
    }
    return c;
  }, a);
}