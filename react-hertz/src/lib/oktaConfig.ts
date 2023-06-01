export const oktaConfig = {
    clientId: '95ooPPOuAAjWNc2jrP60b0z5kvnS7jJG',
    issuer: 'https://dev-sd2korcr1qpgjm2v.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}