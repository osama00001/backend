// class APIErrors extends Error{
//     constructor(){
//         super(message)
//     }
// }

class CustomError extends Error {
    constructor(message, statusCode, status) {
      super(message); // Call the parent constructor with the error message
      this.statusCode = statusCode; // Custom property for status code
      this.status = status; // Custom property for status
      // Ensure the error class name is set to the class name
      this.name = this.constructor.name;
      // Capture the stack trace, excluding the constructor call and the class instantiation
      Error.captureStackTrace(this, this.constructor);
      this.isOperational=true
    }
  }

  module.exports={
    CustomError
  }