const db = require("../configs/db.config");
const bcrypt = require("bcrypt");
class Dept{
    constructor({id_dept,id_usuario,ubicacion,precio,imagen,apartado,inicioapart,finalapart,created_by,created_at,updated_by,updated_at,deleted_by,deleted_at,deleted}){
       this.id_dept=id_dept;
       this.id_usuario=id_usuario;
       this.ubicacion=ubicacion;
       this.precio=precio;
       this.imagen=imagen;
       this.apartado=apartado;
       this.inicioapart=inicioapart;
       this.finalapart=finalapart; 
       this.created_by=created_by;
       this.created_at=created_at;
       this.updated_by=updated_by;
       this.updated_at=updated_at;
       this.deleted_by=deleted_by;
       this.deleted_at=deleted_at;
       this.deleted=deleted;
    }

    //1
    static async getAll() {
        const connection = await db.createConnection();
        const [rows] = await connection.query(
          "SELECT id_dept,id_usuario,ubicacion,precio,imagen,apartado,inicioapart,finalapart,created_by, created_at ,updated_by,updated_at,deleted_by,deleted_at,deleted FROM dept WHERE deleted=0 ;"
        );
        connection.end();
        return rows;
      }


      //2
      async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute(
          "INSERT INTO dept (id_usuario,ubicacion,precio,imagen,created_by,created_at) VALUES (?,?,?,?,?,?)",
          [this.id_usuario,this.ubicacion,this.precio,this.imagen,this.created_by,this.created_at]
        );
        connection.end();
        if (result.insertId == 0) {
          throw new Error("no se pudo crear la publicacion del departamento");
        }
        this.id = result.insertId;
      }

      //3

      static async updateByid(id_dept,{apartado,inicioapart,finalapart,id_usuario}){
      const connection = await db.createConnection();
      const updated_at = new Date();
        
      const [result] = await connection.execute("UPDATE dept set apartado=?,inicioapart=?,finalapart=?,updated_by =?, updated_at =? WHERE id_dept=?",[apartado,inicioapart,finalapart,id_usuario,updated_at,id_dept]);

      if(result.affectedRows == 0){
        throw new Error("no se pudo apartar el departamento");
    }
     
    return
  }

  //4 
  static async getById(id){
    const connection = await db.createConnection();
    const [rows] = await connection.query(
      "SELECT id_dept,id_usuario,ubicacion,precio,imagen,apartado,created_by,created_at,updated_by,updated_at,deleted_by,deleted_at,deleted FROM dept WHERE id_dept=? AND deleted=0;",[id]
    );
    connection.end();
    if(rows.length > 0){
      const row = rows [0];
      return new Dept({
        id_dept: row.id_dept,
            id_usuario: row.id_usuario,
            ubicacion: row.ubicacion,
            precio: row.precio,
            imagen: row.url_imagen,
            apartado:row.apartado,
            inicioapart:row.inicioapart,
            finalapart:row.finalapart,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_by: row.updated_by,
            updated_at: row.updated_at,
            deleted_by:row.deleted_by,
            deleted_at: row.deleted_at,
            deleted: row.deleted
      });
    }
    return null;
  }
      
      
}
module.exports=Dept;