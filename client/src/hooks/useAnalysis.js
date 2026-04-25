import { useState } from 'react';
import axios from 'axios';
import { demoData } from '../utils/demoData';

export function useAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (file, months) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('codebase', file);
      formData.append('months', months);
      
      const res = await axios.post('http://localhost:3001/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setLoading(true);
    setTimeout(() => {
        setData(demoData);
        setLoading(false);
    }, 1200);
  };

  return { data, loading, error, analyze, loadDemo };
}
