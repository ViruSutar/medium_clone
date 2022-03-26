
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthorService{
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
      
    //   TODO: add bio in select  
    // TODO: start with design you need clarity 
    // TODO: filters
        let authors=await Database.query()
                                  .select("users.name,users.profile_pic")
                                  .from('users')
                                  .whereRaw(Database.rawQuery("users.is_active = 1 AND users.role ='AUTHOR'"))
                                  .limit(parseInt(limitQuery))
                                  .offset(parseInt(offsetQuery))

        return {success:true,Data:authors ? authors : "authors not found"}
      } 

      static async getAuthorDetails(author_uuid:string){
          
      }
}