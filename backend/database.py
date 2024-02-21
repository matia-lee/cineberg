import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database creation and table initialization commands
create_database_query = "CREATE DATABASE IF NOT EXISTS user_movies;"
use_database_query = "USE user_movies;"
create_users_table_query = """
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL
);
"""
create_movies_table_query = """
CREATE TABLE IF NOT EXISTS movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT
);
"""
create_liked_movies_table_query = """
CREATE TABLE IF NOT EXISTS liked_movies (
  user_id INT,
  movie_id INT,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);
"""
# Add your queries for disliked_movies and watched_movies tables here

# Function to create a connection
def create_connection(host_name, user_name, user_password):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            password=user_password
        )
        print("MySQL Database connection successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

# Function to execute a query
def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"The error '{e}' occurred")

def main():
    # Connect to MySQL
    connection = create_connection(
        os.getenv("db_host"), 
        os.getenv("db_user"), 
        os.getenv("db_password")
    )

    # Create database and tables
    if connection is not None:
        execute_query(connection, create_database_query)
        # Reconnect or switch to the user_movies database here if necessary
        execute_query(connection, use_database_query)  # This line may not be necessary with mysql.connector, depending on your version
        execute_query(connection, create_users_table_query)
        execute_query(connection, create_movies_table_query)
        execute_query(connection, create_liked_movies_table_query)
        # Execute additional table creation queries here
    else:
        print("Error! cannot create the database connection.")

if __name__ == "__main__":
    main()

