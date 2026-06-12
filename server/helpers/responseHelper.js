const handleSuccess = (res, data) => {
    res.status(200).send({
        result: true,
        message: "Success",
        payload: data
    });
};

const handleError = (res, error) => {
  const statusCode = error?.status || 500;

  res.status(statusCode).send({
    result: false,
    message: error?.message || "Something went wrong!!",
    payload: error?.errors || {}
  });
};

const handleOK = (res) => {
    res.status(200).send({
        result: true,
        message: "Success"
    });
};

module.exports = {
    handleSuccess,
    handleError,
    handleOK
};