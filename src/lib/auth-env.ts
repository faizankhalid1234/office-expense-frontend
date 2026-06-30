/** Railway / reverse-proxy: trust forwarded host for Auth.js */
if (typeof process !== "undefined") {
  if (!process.env.AUTH_TRUST_HOST) {
    process.env.AUTH_TRUST_HOST = "true";
  }
}
