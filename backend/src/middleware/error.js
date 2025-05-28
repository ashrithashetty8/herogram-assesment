const ApiError = require('../utils/api-error');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || 400 ? 400 : 500;
        const message = error.message || 400;
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

module.exports = {
    errorConverter
};
