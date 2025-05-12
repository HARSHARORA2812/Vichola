export const sendResponse = (res, statusCode, message, data = null) => {
  const success = statusCode >= 200 && statusCode < 300;
  const response = {
    success: success,
    message: message,
  };

  if (data !== null) {
    response.data = data;
  }

  // Debug outgoing response
  console.log(`Sending response: ${statusCode} ${message} - Success: ${success}`);
  
  return res.status(statusCode).json(response);
};