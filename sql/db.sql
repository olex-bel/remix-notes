DROP DATABASE IF EXISTS notes;

CREATE DATABASE notes
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C.UTF-8'
    LC_CTYPE = 'C.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE IF NOT EXISTS notes (
	id serial PRIMARY KEY,
	body VARCHAR NOT NULL,
	color_id VARCHAR NOT NULL,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL,
    updated_on timestamp default CURRENT_TIMESTAMP not null,

    CONSTRAINT fk_colors
      FOREIGN KEY(color_id) 
        REFERENCES colors(id)
);

CREATE TABLE IF NOT EXISTS colors (
    id VARCHAR PRIMARY KEY,
    header VARCHAR NOT NULL,
    body VARCHAR NOT NULL,
    text VARCHAR NOT NULL
);

CREATE  FUNCTION update_updated_on_notes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_updated_on
    BEFORE UPDATE
    ON
        notes
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_notes();
