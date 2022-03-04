/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// TODO: check error handling of yatrikar api and implement

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error: any, ctx: HttpContextContract): Promise<any> {

    if (error.code === "E_VALIDATION_FAILURE") {
      if (error.messages.errors[0].rule === "unique") {
        return ctx.response.status(400).send({
          success: false,
          message: `user with ${error.messages.errors[0].field} already exist`,
        });
      }

      if(error.messages.errors[0].message === 'enum validation failed' ){
        return ctx.response.status(400).send({
          success: false,
          message: `Incorrect value on the field ${error.messages.errors[0].field}`,
        });
      }
      return ctx.response
        .status(400)
        .send({ success: false, message: error.messages.errors[0].field + " required" });
    }
  
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return ctx.response
        .status(400)
        .send({ success: false, message: error.sqlMessage });
    }

    if (error.message === "jwt expired") {
      return ctx.response
        .status(400)
        .send({ success: false, message: "token expired please login again" });
    }
    return ctx.response.status(400).send({ success: false, message: error });
  }
}
