CREATE TABLE `users` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(100) UNIQUE NOT NULL,
  `password_hash` varchar(255),
  `verified` boolean NOT NULL,
  `role_id` integer NOT NULL,
  `first_name` varchar(30),
  `last_name` varchar(50),
  `address_1` varchar(100),
  `address_2` varchar(100),
  `city` varchar(50),
  `postcode` varchar(10),
  `emergency_name` varchar(50),
  `emergency_email` varchar(100),
  `emergency_mobile` varchar(20),
  `secondary_name` varchar(50),
  `secondary_email` varchar(100),
  `secondary_mobile` varchar(20),
  `freetext` varchar(255)
);

CREATE TABLE `users_racers` (
  `user_id` integer NOT NULL,
  `racer_id` integer NOT NULL,
  PRIMARY KEY (`user_id`, `racer_id`)
);

CREATE TABLE `roles` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(60) UNIQUE NOT NULL
);

CREATE TABLE `genders` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(10) UNIQUE NOT NULL
);

CREATE TABLE `tokens` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `token` varchar(12) UNIQUE NOT NULL,
  `user_id` integer NOT NULL,
  `expiresAt` date NOT NULL,
  `type_id` integer NOT NULL
);

CREATE TABLE `racers` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) NOT NULL,
  `second_name` varchar(60) NOT NULL,
  `dob` date NOT NULL,
  `gender_id` integer,
  `concession` boolean,
  `club_id` integer,
  `club_expiry` date,
  `verified` boolean,
  `competency` varchar(255)
);

CREATE TABLE `token_types` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type` varchar(30) UNIQUE NOT NULL
);

CREATE TABLE `bookings` (
  `session_date` date NOT NULL,
  `racer_id` integer NOT NULL,
  `paid` boolean,
  `expiresAt` date NOT NULL,
  PRIMARY KEY (`racer_id`, `session_date`)
);

CREATE TABLE `clubs` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `contact_name` varchar(100),
  `conact_email` varchar(100),
  `affiliated` boolean
);

CREATE TABLE `sessions` (
  `date` date UNIQUE PRIMARY KEY NOT NULL,
  `limit` integer,
  `message` varchar(255)
);

CREATE INDEX `users_index_0` ON `users` (`email`);

CREATE INDEX `tokens_index_1` ON `tokens` (`token`);

CREATE UNIQUE INDEX `racers_index_2` ON `racers` (`first_name`, `second_name`);

/* PlanetScale doesn't support foreign key constraints ...

ALTER TABLE `users_racers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `users_racers` ADD FOREIGN KEY (`racer_id`) REFERENCES `racers` (`id`);

ALTER TABLE `bookings` ADD FOREIGN KEY (`racer_id`) REFERENCES `racers` (`id`);

ALTER TABLE `roles` ADD FOREIGN KEY (`id`) REFERENCES `users` (`role_id`);

ALTER TABLE `tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `tokens` ADD FOREIGN KEY (`type_id`) REFERENCES `token_types` (`id`);

ALTER TABLE `bookings` ADD FOREIGN KEY (`session_date`) REFERENCES `sessions` (`date`);

ALTER TABLE `clubs` ADD FOREIGN KEY (`id`) REFERENCES `racers` (`club_id`);

ALTER TABLE `genders` ADD FOREIGN KEY (`id`) REFERENCES `racers` (`gender_id`);

*/

INSERT INTO roles (name) VALUES ("admin"), ("user");

INSERT INTO token_types (type) VALUES ("passwordReset"), ("accountRequest");

INSERT INTO genders (name) VALUES ("Female"), ("Male");