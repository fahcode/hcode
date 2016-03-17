CREATE DATABASE IF NOT EXISTS myDatas;
USE myDatas;

set names utf8;
DROP TABLE IF EXISTS wish;
CREATE TABLE wish(
	id int unsigned auto_increment key,
	uid varchar(200) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into wish(id,uid) values('1','70');