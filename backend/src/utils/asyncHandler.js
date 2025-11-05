
//this function is used to handle async errors automatically, it is a higher order function that takes in an async function as an input


const asyncHandler = (requestHandler) => {

  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
  };
};
module.exports = asyncHandler;