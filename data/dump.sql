DROP DATABASE IF EXISTS `memory`;

CREATE DATABASE `memory`;

USE `memory`;

CREATE TABLE `users` (`id` INT PRIMARY KEY AUTO_INCREMENT, `username` VARCHAR(255), `password` VARCHAR(255), `token` VARCHAR(255));

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'thorsten', MD5('thorsten')),
(2, 'sebastian', MD5('sebastian')),
(3, 'workshop', MD5('workshop'));

CREATE TABLE `games` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `created` VARCHAR(255),
  `finished` TINYINT DEFAULT 0,
  `started` TINYINT DEFAULT 0);

INSERT INTO `games` (`id`, `created`, `finished`, `started`) VALUES
(1, '07.03.2012 08:15', 1, 1),
(2, '07.03.2012 08:16', 0, 1),
(3, '07.03.2012 08:17', 0, 0),
(4, '07.03.2012 08:18', 0, 0);

CREATE TABLE `games_users` (
  `user_id` INT,
  `game_id` INT,
  `order` INT,
  `active` TINYINT,
  `turned_by_user` INT,
  PRIMARY KEY (`user_id`, `game_id`));

INSERT INTO `games_users` (`user_id`, `game_id`, `order`) VALUES
(1,1,1), (2,1,2), (1,2,1), (2,2,2), (1,3,1);

CREATE TABLE `cards` (`game_id` INT, `card` VARCHAR(255), `order` INT, `active` TINYINT DEFAULT 1, `status` TINYINT DEFAULT 0);