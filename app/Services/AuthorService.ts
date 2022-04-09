import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthorService {
  static async listAuthors(limit: string, offset: string) {
    
    let params = {};

    if(!limit){
      limit="10000000000000000"
    }

    if(!offset){
      offset = "0"
    }

    //   TODO: add bio in select
    // TODO: start with design you need clarity
    // TODO: filters
    let [authors,total] =await Promise.all([
      await Database.query()
      .select(Database.rawQuery(
        "users.name,users.profile_pic,users.follower_count"
      ))
      .from("users")
      .whereRaw(
        Database.rawQuery("users.is_active = 1 AND users.role ='AUTHOR'")
      )
      .limit(parseInt(limit))
      .offset(parseInt(offset)),
      await Database.query()
      .select(Database.rawQuery(
        "count(distinct users.id) as count"
      ))
      .from("users")
      .whereRaw(
        Database.rawQuery("users.is_active = 1 AND users.role ='AUTHOR'")
      )
      ]) 
   
    return { success: true, Data: authors ? authors : "authors not found" ,total:total[0].count};
  }

  static async getAuthorDetails(author_uuid: string) {}
}
