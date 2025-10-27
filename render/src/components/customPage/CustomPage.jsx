import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const CustomPage = () => {
  const { url } = useSelector((state) => state.settings);
  const [webview, setWebview] = useState(null);

  useEffect(() => {
    if (webview) {
      webview.addEventListener('dom-ready', () => {
        webview.insertCSS('::-webkit-scrollbar { display: none; }');
      });
    }
  }, [webview]);

  return (
    <div className="flex flex-col h-full">
      <webview
        ref={setWebview}
        src={url}
        className="w-full h-full"
        allowpopups="true"
        useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
      />
    </div>
  );
};

export default CustomPage;
