CREATE TABLE `users` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(100) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `verified` boolean NOT NULL,
  `role` integer NOT NULL
);

CREATE TABLE `users_racers` (
  `user_id` integer NOT NULL,
  `racer_id` integer NOT NULL,
  PRIMARY KEY (`user_id`, `racer_id`)
);

CREATE TABLE `racers` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(60) UNIQUE NOT NULL
);

CREATE TABLE `bookings` (
  `session_date` date NOT NULL,
  `racer_id` integer NOT NULL,
  `paid` boolean,
  `expiresAt` date NOT NULL,
  PRIMARY KEY (`racer_id`, `session_date`)
);

CREATE TABLE `roles` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(60) UNIQUE NOT NULL
);

CREATE TABLE `tokens` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `token` varchar(12) UNIQUE NOT NULL,
  `user_id` integer NOT NULL,
  `expiresAt` date NOT NULL,
  `type` integer NOT NULL
);

CREATE TABLE `token_types` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type` varchar(30) UNIQUE NOT NULL
);

CREATE INDEX `users_index_0` ON `users` (`email`);

/* PlanetScale doesn't support foreign key constraints ...

ALTER TABLE `users_racers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `users_racers` ADD FOREIGN KEY (`racer_id`) REFERENCES `racers` (`id`);

ALTER TABLE `bookings` ADD FOREIGN KEY (`racer_id`) REFERENCES `racers` (`id`);

ALTER TABLE `roles` ADD FOREIGN KEY (`id`) REFERENCES `users` (`role`);

ALTER TABLE `tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `tokens` ADD FOREIGN KEY (`type`) REFERENCES `token_types` (`id`);

*/

INSERT INTO roles (name) VALUES ("admin"), ("user");

INSERT INTO token_types (type) VALUES ("passwordReset");