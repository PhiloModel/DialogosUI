import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';

const HomePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>Strona Główna</h1>
      <ul>
        <p>{data.message}</p>
      </ul>
    </div>
  );
};

export default HomePage;
