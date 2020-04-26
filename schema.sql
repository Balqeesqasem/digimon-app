DROP TABLE IF EXISTS exam ;
CREATE TABLE exam(
    id SERIAL PRIMARY KEY ,
    name VARCHAR(255),
    img TEXT ,
    level TEXT
)