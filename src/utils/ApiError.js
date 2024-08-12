//making a class
class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],

        //error stack
        stack=""

    ){
        //to override it
        super(message)
        this.statusCode=statusCode
        this.data= null
        this.success=false
        this.errors=errors


        //checking if there is statck(optional else avoid)
        if(statck){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)

        }

    }
}


export {ApiError}