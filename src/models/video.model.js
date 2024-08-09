import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema= new Schema(
    {
        videoFile:{
            type:String, //cloudianaru url
            required:true
        },
        thumbnail:{
            type:String, //cloudianaru url
            required:true
        },

        title:{
            type:String,
            required:true
        },

        description:{
            type:String, 
            required:true
        },

        //duration is not given by user
        //duration will be obtained from cloudinary
        duration:{
            type:Number, 
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            typed:Boolean,
            default:true
        },

        //refer to user
        owner:{
            type:Schema.Types.ObjectId,
            ref: "User",

        }
    },
    {        timestamps:true

    }
)

//using the aggregate fn
//mongoose allows u to make ur own plugins
//for aggregation pipelines
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)