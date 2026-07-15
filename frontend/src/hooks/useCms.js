import { useState, useEffect } from 'react';
import { getPublicCms } from '../services/cmsService';

export default function useCms() {
  const [cms, setCms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicCms()
      .then(res => {
        if (res.data && res.data.data) {
          setCms(res.data.data);
        }
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { cms, loading, error };
}