CREATE USER 'keto'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'keto'@'%';
FLUSH PRIVILEGES;