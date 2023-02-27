const validationError = "ValidationError";
const CastError = "CastError";
const JsonWebTokenError = "JsonWebTokenError";
const TokenExpiredError = "TokenExpiredError";
const SyntaxError = "SyntaxError";
const MongoServerError = "MongoServerError";

// handles promise rejections inside controllers
const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === CastError) {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === TokenExpiredError) {
    return res.status(400).send({ error: "Token is expired" });
  } else if (error.name === validationError) {
    return res.status(400).json({ error: error.message });
  } else if (error.name === JsonWebTokenError) {
    return res.status(400).json({ error: "token missing or invalid" });
  } else if (error.name === SyntaxError) {
    return res.status(400).json({ error: "Invalid Json" });
  } else if (error.name === MongoServerError) {
    return res.status(500).json({ error: "server error" });
  }

  next(error);
};

module.exports = errorHandler;
