// 
//promises code
const asyncHandler=(requestHandler)=>{
    (req, res, next)=>{
        //promise has resolve reject
        Promise.resolve(req, res, next).catch((err)=> next(err))
    } 
}


export {asyncHandler}



//making it using try catch
//accepting it as a function as it is a higher order function
//also using middleware
// const asyncHandler = (fn) =>async(req, res, next)=>{
//        try{
//         await fn(req, res, next)

//        }catch(error){
//         res.status(err.code ||500).json({
//             succes:false,
//             message: err.message
//         })

//        }
// }