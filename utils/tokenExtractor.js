const tokenExtractor = (authorizationHeader) => {
  // jwt token gets send in authorization header ex "bearer eyJhbGciOiJIUzI1NiIsIn..."
  if (
    authorizationHeader &&
    authorizationHeader.toLowerCase().startsWith("bearer ")
  ) {
    return authorizationHeader.substring(7);
  }
  return null;
};

module.exports = tokenExtractor;
