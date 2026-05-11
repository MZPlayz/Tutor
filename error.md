## Error Type
Console Error

## Error Message
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <LoadingBoundary name="login/" loading={null}>
      <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>
        <RedirectBoundary>
          <RedirectErrorBoundary router={{...}}>
            <InnerLayoutRouter url="/auth/login" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} ...>
              <SegmentViewNode type="page" pagePath="auth/login...">
                <SegmentTrieNode>
                <ClientPageRoot Component={function LoginPage} serverProvidedParams={{...}}>
                  <LoginPage params={Promise} searchParams={Promise}>
                    <div className="min-h-scre...">
                      <div className="absolute i...">
                        <DotField dotRadius={1.5} dotSpacing={14} bulgeStrength={67} glowRadius={160} sparkle={false} ...>
                          <div className={"dot-fiel..."}>
                            <canvas>
                            <svg ref={{current:null}} style={{position:"...", ...}}>
                              <defs>
                                <radialGradient
+                                 id="dot-field-glow-ar0547c"
-                                 id="dot-field-glow-jbun3km"
                                >
                              <circle
                                ref={{current:null}}
                                cx="-9999"
                                cy="-9999"
                                r={160}
+                               fill="url(#dot-field-glow-ar0547c)"
-                               fill="url(#dot-field-glow-jbun3km)"
                                style={{opacity:0,willChange:"opacity"}}
                              >
                      ...
              ...
            ...



    at radialGradient (<anonymous>:null:null)
    at DotField (components/dot-field.tsx:280:11)
    at LoginPage (app/auth/login/page.tsx:85:9)

## Code Frame
  278 |       >
  279 |         <defs>
> 280 |           <radialGradient id={glowIdRef.current}>
      |           ^
  281 |             <stop offset="0%" stopColor={glowColor} />
  282 |             <stop offset="100%" stopColor="transparent" />
  283 |           </radialGradient>

Next.js version: 16.2.6 (Turbopack)
