import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Pool de connexions MySQL
 * Utilise les variables d'environnement définies dans le fichier .env
 *
 * @type {import('mysql2/promise').Pool}
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
