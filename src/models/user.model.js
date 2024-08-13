import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

const userSchema= new Schema(
    //making the fiels of user
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim:true,

            //to make the field  searchable make index true
            index:true
        },
        email:{
            type : String,
            required:true,
            unique:true,
            lowercase: true,
            trim:true,
        },
        fullName:{
            type : String,
            required:true,
            trim:true,

            //for searching making index
            index:true,
        },

        avatar: {
            type: String,//cloudinary url
            required:true,
        },

        coverImage:{
            type: String,//cloudinary url
            
        },
        watchHistory:[
            //making an object and ref
            {
                type:Schema.Types.ObjectId,
                ref:"Video",

            }

        ],
        password:{

            type:String,
            //we nwwd to encrypt the password
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String,

        }

    },{timestamps: true}
)

userSchema.pre("save", async function(next){
  //  we need  to encrypt only one i.e before saving
   if(!this.isModified("password"))return next();

   
   //10 is a random number, xould be any samll number
   //it will take time
    this.password=await bcrypt.hash(this.password , 10)
    next()

})

userSchema.methods.isPasswordCorrect= async function (password){
    //bcrypt can check password
    //takes some time so we use await
   return await bcrypt.compare(password, this.password)

}


userSchema.methods.generateAccessToken= function(){

    return  jwt.sign(
        //giving payload
        {//everything is already stored in database, just retreiving
           _id:this._id,
           email: this.email,
           username: this.username,
           fullName: this.fullName
        },
        //access token is needed
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }


    )

}
userSchema.methods.generateRefreshToken= function(){

    return  jwt.sign(
        //refresh token needs less detailes, only id, else everything else is same
        {
           _id:this._id,
          
        },
        //access token is needed
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }


    )

}



//we will refer userSchema
export const User = mongoose.model("User", userSchema)