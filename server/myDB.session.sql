USE register;


-- @block -- USERS
CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- @block -- LISTS
CREATE TABLE lists(
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- @block -- TASKS
CREATE TABLE tasks(
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner_id) REFERENCES lists(id) ON DELETE CASCADE
);
