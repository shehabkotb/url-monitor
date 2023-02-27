const tokenExtractor = require("../utils/tokenExtractor");

describe("jwt token extractor from header", () => {
  test("return token correctly even with mixed bearer case", () => {
    const test =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmEwYmYxZjExZTUwYmRjMjRhMDgyYiIsIm5hbWUiOiJzaGVoYWIgYWhtZWQiLCJlbWFpbCI6InNoZWhhYmt0b2JAZ21haWwuY29tIiwiaWF0IjoxNjc3NDM1NzY0fQ._ViO8ub0dqEZZ6emiQXqw53-Km8konBcqsi6_19JUl8";

    const token = tokenExtractor(test);

    expect(token).toMatch(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmEwYmYxZjExZTUwYmRjMjRhMDgyYiIsIm5hbWUiOiJzaGVoYWIgYWhtZWQiLCJlbWFpbCI6InNoZWhhYmt0b2JAZ21haWwuY29tIiwiaWF0IjoxNjc3NDM1NzY0fQ._ViO8ub0dqEZZ6emiQXqw53-Km8konBcqsi6_19JUl8"
    );
  });

  test("return null when header doesn't start with bearer", () => {
    const test =
      "bear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmEwYmYxZjExZTUwYmRjMjRhMDgyYiIsIm5hbWUiOiJzaGVoYWIgYWhtZWQiLCJlbWFpbCI6InNoZWhhYmt0b2JAZ21haWwuY29tIiwiaWF0IjoxNjc3NDM1NzY0fQ._ViO8ub0dqEZZ6emiQXqw53-Km8konBcqsi6_19JUl8";

    const token = tokenExtractor(test);

    expect(token).toBeNull();
  });
});
