export const catcAsyncError = (asyncHandler) => (req,res,next ) => {
  Promise.resolve(asyncHandler(req,res,next)). catch((err) => next(err));

}