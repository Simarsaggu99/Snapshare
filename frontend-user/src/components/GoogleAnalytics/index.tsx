
import { useRouter } from "next/router";
import Script from "next/script";
import { memo, useEffect } from "react";


const TRACKING_ID = "G-DTEP93KJ2F";
const GoogleAnalytics = () => {
  const router = useRouter();
 
  if (router.isPreview) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
      ></Script>

      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
    </>
  );
};
export default memo(GoogleAnalytics);
