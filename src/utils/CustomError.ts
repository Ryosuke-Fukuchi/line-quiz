class CustomError extends Error {
  constructor(message: { message: string; statusCode: number }) {
    const customMessage = JSON.stringify(message);
    super(customMessage);
  }
}

export default CustomError;
