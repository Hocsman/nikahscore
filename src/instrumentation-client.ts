import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  debug: false,
  
  // Replay configuration (optional)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Required for router transition instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
