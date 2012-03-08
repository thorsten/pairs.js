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
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  `finished` TINYINT DEFAULT 0,
  `started` TINYINT DEFAULT 0);

INSERT INTO `games` (`id`, `created`, `finished`, `started`) VALUES
(1, '2012-07-03 08:15', 1, 1),
(2, '2012-07-03 08:16', 0, 1),
(3, '2012-07-03 08:17', 0, 0),
(4, '2012-07-03 08:18', 0, 0);

CREATE TABLE `games_users` (`user_id` INT, `game_id` INT);

INSERT INTO `games_users` (`user_id`, `game_id`) VALUES
(1,1), (2,1), (1,2), (2,2), (1,3);