/**
 * Copyright (c) 2011 Jikeytang (http://jikey.cnblog.com/)
 * Version: 0.0.1
 * Demo: http://jikey.cnblog.com/
 */
(function(){
    if(!window.generateDOM){ window['generateDOM'] = {}; };
    var domCode = '',
        nodeNameCounters = [],
        requiredVariables = '',
        newVariables = '';

    generateDOM = {
        // 转义
        encode: function(str){
            if(!str) { return null; }
            str = str.replace(/\\/g, '\\\\');
            str = str.replace(/';/g, "\\'");
            str = str.replace(/\s+^/g, '\\n');
            return str;
        },
        // 检查变量是不是$开始的
        checkForVariable: function(v){
            if(v.indexOf('$') == -1){
                v = '\'' + v + '\'';
            } else {
                // 因ie会添加锚的完整路径，故需要取该字符串从$到结尾处的子字符串
                v = v.substring(v.indexOf('$') + 1);
                requiredVariables += 'var ' + v + ';\n';
            }
            return v;
        },
        /**
         * 入口方法
         * @param strHTML
         * @param strRoot
         */
        generate: function(strHTML, strRoot){
            var that = this,
                domRoot = document.createElement('div');
            domRoot.innerHTML = strHTML;
            // 重置变量
            domCode = '';
            nodeNameCounters = [];
            requiredVariables = '';
            newVariables = '';
            // 使用processNode()处理domRoot中的所有子节点
            var node = domRoot.firstChild;
            while(node){
                ADS.walkTheDOMRecursive(that, that.processNode, node, 0, strRoot);
                node = node.nextSibling;
            }
            // 输出生成的代码
            domCode = '/* requiredVariables in this code\n' + requiredVariables + '*/\n\n'
                    + domCode + '\n\n'
                    + '/* new objects in this code\n' + newVariables + '*/\n\n';
            return domCode;
        },
        /**
         * 每个节点关联的属性
         * @param tabCount
         * @param refParent
         */
        processAttribute: function(self, tabCount, refParent){
            var that = self;
            // 跳过文本节点
            if(this.nodeType != ADS.node.ATTRIBUTE_NODE) return;
            // 取得属性值
            var attrValue = (this.nodeValue ? that.encode(this.nodeValue.trim()) : '');
            if(this.nodeValue == 'cssText') alert('true');
            // 如果没有值则返回
            if(!attrValue) return;
            // 确定缩进的级别
            var tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');
            // 根据nodeName进行判断，除了class和style需要特殊注意外，所有的类型按常规来处理
            switch(this.nodeName){
                default: 
                    if(this.nodeName.substring(0, 2) == 'on'){
                        // 如果是以'on'开头，需要重新创建一个给该属性赋值的函数
                        domCode += tabs
                                + refParent
                                + '.'
                                + this.nodeName
                                + '= function(){' + attrValue + '}\n';
                    } else {
                        // 其它情况
                        domCode += tabs
                                + refParent
                                + '.setAttribute(\''
                                + this.nodeName
                                + '\', '
                                + that.checkForVariable(attrValue)
                                + ');\n';
                    }
                    break;
                case 'class':
                    domCode += tabs
                            + refParent
                            + '.className = '
                            + that.checkForVariable(attrValue)
                            + ';\n';
                    break;
                case 'style':
                    // 用临近的空格来分割样式属性的值
                    var style = attrValue.split(/\s*;\s*/);
                    if(style){
                        for(var pair in style){
                            if(!style[pair]) continue;
                            var prop = style[pair].split(/\s*:\s*/);
                            if(!prop[1]) continue;
                            // 将css-property格式的属性转化为cssProperty格式
                            prop[0] = ADS.camelize(prop[0]);
                            var propValue = that.checkForVariable(prop[1]);
                            if(prop[0] == 'float'){
                                // float 保留字，cssFloat w3c, styleFloat ie
                                domCode += tabs
                                        + refParent
                                        + '.style.cssFloat = '
                                        + propValue
                                        + ';\n';
                                domCode += tabs
                                        + refParent
                                        + '.style.styleFloat = '
                                        + propValue
                                        + ';\n';
                            } else {
                                domCode += tabs
                                        + refParent
                                        + '.style.'
                                        + prop[0]
                                        + '='
                                        + propValue + ';\n';
                            }
                        }
                    }
                    break;
            }
        },
        /**
         * 分析树中的每个节点，确定节点的类型、值和属性
         * @param tabCount 需重复的制表符
         * @param refParent 被引用的父对象
         */
        processNode: function(self, tabCount, refParent){
            // 根据树的深度级别重复制表符，以便对每一行进行正确的缩进
            var that = self,
                tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');
            // 确定节点类型并处理元素和文本节点
           
            switch(this.nodeType){
                case ADS.node.ELEMENT_NODE: // 如果是元素节点
                    // 计数器加１，并创建一个使用标签和计数器的值表示新的变量，例如：a1,a2,a3
                    if(nodeNameCounters[this.nodeName]){
                        ++nodeNameCounters[this.nodeName];
                    } else {
                        nodeNameCounters[this.nodeName] = 1;
                    }
                    var ref = this.nodeName.toLowerCase() + nodeNameCounters[this.nodeName];
                    domCode += tabs
                            + 'var '
                            + ref
                            + ' = document.createElement(\''
                            + this.nodeName + '\');\n';
                    // 将新变量添加到列表中以便在结果中报告他们
                    newVariables += '' + ref + ';\n';
                    // 检测是否存在属性，如果是则循环遍历这些属性，并使用processAttribute()方法遍历它们的DOM树
                    if(this.attributes){
                        for(var i=0; i<this.attributes.length; i++){
                            ADS.walkTheDOMRecursive(that, that.processAttribute, this.attributes[i], tabCount, ref );
                        }
                    }
                    break;
                case ADS.node.TEXT_NODE: // 如果是文本节点
                    // 检测文本节点中除了空白符之外的值
                    var value = (this.nodeValue ? that.encode(this.nodeValue.trim()) : '');
                    if(value){
                        // 计数器加１，并创建一个使用txt和计数器的值表示新变量，例如：txt1,txt2,txt3
                        if(nodeNameCounters['txt']){
                            ++nodeNameCounters['txt'];
                        } else {
                            nodeNameCounters['txt'] = 1;
                        }
                        var ref = 'txt' + nodeNameCounters['txt'];
                        // 检查是不是$var的值
                        value = that.checkForVariable(value);
                        // 添加创建这个元素的DOM代码
                        domCode += tabs
                                + 'var '
                                + ref
                                + ' = document.createTextNode(' + value + ');\n';
                        // 将新变量添加到列表中以便在结果中报告他们
                        newVariables += '' + ref + ';\n';
                    } else {
                        // 如果不存在值(或者只有空白符)则返回，即这个节点将不会被添加到父节点中
                        return;
                    }
                    break;
                default:
                    // 忽略其它情况
                    break;
            }
            // 添加将这个节点到其父节点的代码
            if(refParent){
                domCode += tabs + refParent + '.appendChild(' + ref + ');\n';
            }
            return ref;
        }
    };
})();