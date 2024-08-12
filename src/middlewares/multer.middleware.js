import multer from "multer";
//we are using disk storage
const storage = multer.diskStorage({
  //cb=>callback
  //file is with multer
  //req has json data
  //middleware like req, res, rest
    destination: function (req, file, cb) {
      //i want to put the files inside publlic folder for the destination
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
     //file will be saved by the original name given by the user
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ 
    storage ,

  })