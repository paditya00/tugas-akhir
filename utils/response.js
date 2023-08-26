export const successResp = (response, message, data, status = 200) => {
  return response.status(status).json({
    code: status,
    message: message,
    data: data,
  });
};

export const errorResp = (response, message, status = 400) => {
  return response.status(status).json({
    code: status,
    message: message,
  });
};
