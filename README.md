# Javascript, express 를 활용한 간단한 웹 게임 페이지

### node.js / mysql 설치

cmd - cd (download path)
npm i express
npm i express-session
npm i mysql

### Database 초기 세팅

cmd - cd (mysql install path)

mysql -u root -p / 비밀번호 입력

dbinit.txt 내용 복사후 실행
CREATE USER 'brick'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON *.* TO 'brick'@'localhost';
FLUSH PRIVILEGES;

ALTER USER 'brick'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345';
FLUSH PRIVILEGES;

CREATE DATABASE Brick;

USE brick;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score INT DEFAULT 0
); 

### localhost:3000/ 접속
