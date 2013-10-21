/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50516
Source Host           : localhost:3306
Source Database       : jikeytest

Target Server Type    : MYSQL
Target Server Version : 50516
File Encoding         : 65001

Date: 2013-10-17 10:35:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `jk_menu`
-- ----------------------------
DROP TABLE IF EXISTS `jk_menu`;
CREATE TABLE `jk_menu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned NOT NULL,
  `menu_name` char(100) NOT NULL,
  `menu_other` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of jk_menu
-- ----------------------------
INSERT INTO `jk_menu` VALUES ('1', '1', '商品管理', '');
INSERT INTO `jk_menu` VALUES ('2', '1', '添加商品', '');
INSERT INTO `jk_menu` VALUES ('3', '2', '阿里妈妈', '');
INSERT INTO `jk_menu` VALUES ('4', '2', '淘宝网址', '');
INSERT INTO `jk_menu` VALUES ('5', '3', '笔记本', '');
INSERT INTO `jk_menu` VALUES ('6', '3', '台式机', '');
INSERT INTO `jk_menu` VALUES ('7', '4', '近代小说', '');
INSERT INTO `jk_menu` VALUES ('8', '4', '外国文学', '');

-- ----------------------------
-- Table structure for `jk_menu_sort`
-- ----------------------------
DROP TABLE IF EXISTS `jk_menu_sort`;
CREATE TABLE `jk_menu_sort` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` int(10) unsigned NOT NULL,
  `sort_name` varchar(100) NOT NULL,
  `parent_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of jk_menu_sort
-- ----------------------------
INSERT INTO `jk_menu_sort` VALUES ('1', '1', '商品管理', '1');
INSERT INTO `jk_menu_sort` VALUES ('2', '1', '商品采集', '2');
INSERT INTO `jk_menu_sort` VALUES ('3', '2', '电子产品', '3');
INSERT INTO `jk_menu_sort` VALUES ('4', '2', '小说', '4');

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
