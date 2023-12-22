import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

const Loading = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoadingComplete(true);
      }, 3000);
    };

    fetchData();
  }, []);


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!loadingComplete ? (
        <ReactLoading type="spin" color="#cdb4db" height={50} width={50} />
      ) : null}
    </div>
  );
};

export default Loading;
