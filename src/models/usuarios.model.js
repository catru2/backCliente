const db =require("../configs/db.config")
const bcrypt = require("bcrypt");
const saltos = parseInt(process.env.SALTOS_BCRYPT);
class User{
    constructor({id_usuario,nombre, correo, contrasena,created_at,updated_at,deleted,deleted_at}){
      this.id_usuario=id_usuario;
      this.nombre=nombre;
      this.correo=correo;
      this.contrasena=contrasena;
      this.created_at=created_at;
      this.updated_at=updated_at;
      this.deleted=deleted;
      this.deleted_at=deleted_at;
    }
    static async getAll() {
        const connection = await db.createConnection();
        const [rows] = await connection.query(
          "SELECT id_usuario,nombre,correo,contrasena,deleted,created_at,deleted_at FROM usuarios WHERE deleted=0 ;"
        );
        connection.end();
        return rows;  
      }
      //
      static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.query(
          "SELECT id_usuario,nombre,correo,contrasena,created_at, updated_at, deleted, deleted_at FROM usuarios WHERE id_usuario=? AND deleted=0 ;",
          [id]
        );
        connection.end();
        if (rows.length > 0) {
          const row = rows[0];
          return new User({
            id_usuario: row.id_usuario,
            correo: row.correo,
            contrasena: row.contrasena,
            created_at: row.created_at,
            updated_at: row.updated_at,
            deleted: row.deleted,
            deleted_at: row.deleted_at,
          });
        }
        return null;
      }
      //
      async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute(
            "INSERT INTO usuarios(nombre,correo,contrasena,created_at) VALUES (?,?,?,?)",
          [this.nombre,this.correo,this.contrasena,this.created_at]
        );
        connection.end();
        if (result.insertId == 0) {
          throw new Error("no se pudo crear el usuario");
        }
        this.id_usuario = result.insertId;
      }
      

      ///
      static async findUsername(correo) {
        const connection = await db.createConnection();
      
        const [result] = await connection.execute(
          "SELECT id_usuario,correo,contrasena FROM usuarios WHERE correo=?",
          [correo]
        );
      
        connection.end();
      
        if (result.affectedRows == 0) {
          throw new Error("no se pudo encontrar al usuario");
        }
        return result[0];
      }
      
      static async encryptPassword(password){
        const salt = await bcrypt.genSalt(saltos)
        return await bcrypt.hash(password,salt)
      }
      static async comparePassword(password,receivedPassword){
        return await bcrypt.compare(password,receivedPassword)
      } 
}

module.exports = User;