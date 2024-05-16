export const asyncHandler = (fn) => (req, res, next) => {

   Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};


// export const asyncHandler = (fn) => (req,res,next) => {
//     try{
//         await fn(req,res,next)



//     }catch(err){
//         res.status(err.code|| 500)
//         .json({
//             success:false,
//             messgae:err.message
//         })
//     }
// }