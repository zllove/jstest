/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50516
Source Host           : localhost:3306
Source Database       : jikeytest

Target Server Type    : MYSQL
Target Server Version : 50516
File Encoding         : 65001

Date: 2013-10-14 14:26:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `jk_user`
-- ----------------------------
DROP TABLE IF EXISTS `jk_user`;
CREATE TABLE `jk_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `pwd` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of jk_user
-- ----------------------------
INSERT INTO `jk_user` VALUES ('1', '11', '11');
INSERT INTO `jk_user` VALUES ('6', '22', '22');
INSERT INTO `jk_user` VALUES ('7', '33', '33');
INSERT INTO `jk_user` VALUES ('8', '44', '45');
INSERT INTO `jk_user` VALUES ('9', '557777', '568');
