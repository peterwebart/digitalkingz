import Script from 'next/script'

/**
 * Google Tag Manager.
 *
 * The container id comes from NEXT_PUBLIC_GTM_ID rather than being hardcoded,
 * so local development and preview builds do not report into the production
 * container. With the variable unset, nothing loads at all.
 *
 * `afterInteractive` rather than `beforeInteractive`: GTM's own snippet already
 * loads gtm.js asynchronously, and blocking hydration on a tag manager would
 * undo the performance work the rest of this site depends on.
 */
export function GoogleTagManagerScript({ id }: { id: string }) {
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  )
}

/** The noscript fallback, which belongs immediately after <body>. */
export function GoogleTagManagerNoScript({ id }: { id: string }) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
