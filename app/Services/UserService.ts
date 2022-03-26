import User from "App/Models/User";
import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env"; 
import { Hash } from "@adonisjs/core/build/standalone";

export default class UserService {
  static async listAuthors(limit:string,offset:string){
    let limitQuery = "";
    let offsetQuery = "";
    let params = { };

    if (limit != null && limit != "") {
        limitQuery = " limit :limit";
        params["limit"] = parseInt(limit);
      }
  
      if (limit != null && limit != "" && offset != null && offset != "") {
        offsetQuery = " offset :offset";
        params["offset"] = parseInt(offset);
      }
  
  }
 
}
