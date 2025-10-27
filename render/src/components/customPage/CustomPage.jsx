import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const CustomPage = () => {
  const { url } = useSelector((state) => state.settings);
  const webviewRef = useRef(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv) return;

    const handleDomReady = () => {
      // hide scrollbar in embedded page
      try {
        wv.insertCSS('::-webkit-scrollbar { display: none; }');
      } catch (err) {
        // inserting CSS may fail for some pages; ignore safely
        // console.warn('Failed to insert CSS into webview', err);
      }
    };

    const handleDidFinishLoad = () => {
      setLoadError(null);
      // Optionally open webview devtools while debugging
      try {
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
          // open webview devtools to inspect inner page errors
          try {
            wv.openDevTools();
          } catch (e) {
            console.warn('Failed to open webview devtools', e);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    const handleDidFailLoad = (event) => {
      // event has: errorCode, errorDescription, validatedURL
      const msg = `${event.errorDescription || 'Failed to load'} (${event.errorCode}) — ${event.validatedURL || ''}`;
      setLoadError(msg);
      console.error('Webview failed to load:', event);
    };

    const handleConsoleMessage = (e) => {
      // e.message, e.line, e.sourceId
      console.log('Webview console:', e.message, 'at', e.sourceId, ':', e.line);
    };

    const handleWillNavigate = (e) => {
      console.log('Webview will-navigate to:', e.url);
    };

    wv.addEventListener('dom-ready', handleDomReady);
    wv.addEventListener('did-finish-load', handleDidFinishLoad);
    wv.addEventListener('did-fail-load', handleDidFailLoad);
    // extra debug listeners
    wv.addEventListener('console-message', handleConsoleMessage);
    wv.addEventListener('will-navigate', handleWillNavigate);
    return () => {
      try {
        wv.removeEventListener('dom-ready', handleDomReady);
        wv.removeEventListener('did-finish-load', handleDidFinishLoad);
        wv.removeEventListener('did-fail-load', handleDidFailLoad);
        wv.removeEventListener('console-message', handleConsoleMessage);
        wv.removeEventListener('will-navigate', handleWillNavigate);
      } catch (e) {
        // element might have been removed already
      }
    };
  }, [url]);

  return (
    <div className="flex flex-col h-full">
      {loadError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 text-red-600 p-4">
          <div>
            <div className="font-bold mb-2">Failed to load custom page</div>
            <div className="text-sm">{loadError}</div>
          </div>
        </div>
      )}
      <webview
        ref={webviewRef}
        src={url}
        className="w-full h-full"
        allowpopups="true"
      />
    </div>
  );
};

export default CustomPage;
