/**
 * @file 控制页面banner部分的View
 * @author Yajiao Wang
 */
define(
function (require) {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var $ = require('jquery');
    var menus = require('frame/MenuConfig');
    var view = null;

    return Backbone.View.extend({
        events: {
            'click .togglemenu': 'bottomMenuClickHandler',
            'click .headerbigmenu li, #header_logo': 'bigMenuClickHandler',
            'click .headermenu li': 'headerMenuClickHandler',
            'click .userinfo': 'userInfoClickHandler',
            'mouseenter .menucoll > ul > li, .menucoll2 > ul > li': 'mouseOverHandler',
            'mouseleave .menucoll > ul > li, .menucoll2 > ul > li': 'mouseOverHandler',
            'click .vernav > ul > li > a, .vernav2 > ul > li > a': 'leftSubmenuClickHandler'
        },
        initialize: function (options) {
            this.userModel = options.userModel;
            this.menuObj = {};// 记录当前页面目录选中状态对象
            this.menus = menus;
            view = this;
        },
        render: function (name, query, page) {
            this.renderMenus();
            if (!this.userModel || !this.userModel.get('name')) {
                $('.username').html('请登陆');
                $('#email').hide();
            } else {
                $('.username').html(this.userModel.get('name'));
                $('#email').show();
            }
            this.bodyClickListener();
            this.$content = $('#main_content');
            return this;
        },
        /**
         * 刷新页面后，渲染头部一级菜单渲染函数
         */
        renderMenus: function () {
            var bigMenuArr = [];
            _.each(menus, function (value, key) {
                var verMenu = (value.verMenu && (_.keys(value.verMenu).length > 0)) ? 'show' : 'hide';
                var href = value.view ? ('"#' + value.view + '"') : '';
                href = href ? href : ('"' + value.url + '" target="_blank"');
                bigMenuArr.push('<li data-action="' + key + '" data-vermenu="'
                    + verMenu + '"><a href=' + href + '>' + value.name + '</a></li>');
            });
            $('#big_menu').html(bigMenuArr.join(''));
        },
        /**
         * 点击头部一级菜单后，展示隐藏二级菜单的渲染函数
         * @param {Object} subMenu 二级菜单对象
         */
        renderSubMenus: function (subMenu) {
            if (_.keys(subMenu).length === 0) {
                $('#sub_menu').parents('div.header').hide();
                $('#ver_menu').css('top','inherit');
                return;
            }
            var subMenuArr = [];
            _.each(subMenu, function (value, key) {
                var verMenu = (value.verMenu && (_.keys(value.verMenu).length > 0)) ? 'show' : 'hide';
                subMenuArr.push('<li data-action="' + key
                    + '" data-vermenu="' + verMenu
                    + '"><a href="#' + (value.view ? value.view : '') + '"><span class="'
                    + value.iconClass + '"></span>'
                    + value.name + '</a></li>');
            });
            $('#sub_menu').html(subMenuArr.join('')).parents('div.header').show();
        },

        /**
         * 点击二级菜单后，展示左侧菜单
         * @param {Object} menus 左侧菜单栏对象
         */
        renderLeftVerMenus: function (menus) {
            var getVerMenu = function (data, subId) {
                var verMenu = data.verMenu;
                if (!verMenu) {
                    if (subId === 'offlinequery') {
                        var whs = 'http://duomo.baidu.com/zhinv/hqltaskadd?queryType=20103';
                        return '<li><a class="' + data.iconClass
                            + '" onClick="window.open(' + '\''  + whs + '\'' + ')">' + data.name + '</a></li>';
                    }
                    return '<li><a class="' + data.iconClass + '" href="#' + subId + '">' + data.name + '</a></li>';
                    }
                var str = '<li><a class="' + data.iconClass + '" href="" data-sub="#' + subId + '">' + data.name + '</a>'
                        + '<span class="arrow"></span><ul id="' + subId + '">';
                var arr = [];
                _.each(verMenu, function (value, key) {
                    arr.push('<li><a href="#' + key + '">' + value.name + '</a></li>');
                });
                str += arr.join('') + '</ul></li>';
                return str;
            };
            var liArr = [];
            _.each(menus.verMenu, function (value, key) {
                liArr.push(getVerMenu(value, key));
            });
            $('#ver_menu').html(liArr.join(''));
        },
        /**
         * 当收起左边菜单栏时，鼠标移动进入或退出时打开或隐藏子菜单栏
         * @param {Object} evt 鼠标滑过事件对象
         */
        mouseOverHandler: function (evt) {
            var me = $(evt.currentTarget);
            if(evt.type === 'mouseenter') {
                me.addClass('hover');
                me.find('ul').show(); 
            } else {
                me.removeClass('hover').find('ul').hide();    
            } 
        },

        /**
         * body事件监听器
         */
        bodyClickListener: function () {
            $(document).click(function (event) {
                var ud = $('.userinfodrop');
                var nb = $('.noticontent');
                // hide user drop menu when clicked outside of this element
                if (event && !$(event.target).is('.userinfodrop')
                    && !$(event.target).is('.userdata')
                    && ud.is(':visible')) {
                    ud.hide();
                    $('.userinfo').removeClass('active');
                }
                // hide notification box when clicked outside of this element
                if (event && !$(event.target).is('.noticontent') && nb.is(':visible')) {
                    nb.remove();
                    $('.notification').removeClass('active');
                }
            });
        },

        /**
         * 二级头部菜单点击事件处理器
         * @param {Object} evt 鼠标点击事件
         */
        headerMenuClickHandler: function (evt) {
            if (!evt.currentTarget) {
                return;
            }
            var $tar = $(evt.currentTarget);
            var action = $tar.data('action');
            if (action !== view.menuObj['activeHeaderMenu']) {
                view.$content.empty();
            }
            var verMenu = $tar.data('vermenu');
            if (!$tar.hasClass('current')) {
                $tar.siblings().removeClass('current');
                $tar.addClass('current');
            }

            view.setVerMenuVisible(verMenu);
            view.renderLeftVerMenus(menus[view.menuObj['activeBigMenu']]['subMenu'][action]);
            view.menuObj['activeHeaderMenu'] = action;
        },

        /**
         * 右上角用户信息点击事件处理器
         * @param {Object} evt 点击事件
         * @return {boolean} d 是否点击的标志信息
         */
        userInfoClickHandler: function (evt) {
            if (!$(this).hasClass('active')) {
                $('.userinfodrop').show();
                $(this).addClass('active');
            } else {
                $('.userinfodrop').hide();
                $(this).removeClass('active');
            }
            // remove notification box if visible
            $('.notification').removeClass('active');
            $('.noticontent').remove();
            return false;
        },

        /**
         * 一级头部菜单点击事件处理器
         * @param {Object} evt 点击事件
         */
        bigMenuClickHandler: function (evt) {
            if (!evt.currentTarget) {
                return;
            }
            var $tar = $(evt.currentTarget);
            var action = $tar.data('action');
            // 当前选中的大标题再次被点击
            if (action && action === view.menuObj.activeBigMenu) {
                return;
            }
            // 如果该菜单是url链接则不走原逻辑
            var url = $(evt.target).attr('href');
            if (url && url.indexOf('http:') === 0) {
                return;
            }
            view.$content.empty();
            var verMenu = $tar.data('vermenu');
            if (!$tar.hasClass('current')) {
                $tar.siblings().removeClass('current');
                $tar.addClass('current');
            }
            view.setVerMenuVisible(verMenu);
            view.menuObj['activeBigMenu'] = action;
            view.renderSubMenus(menus[action]['subMenu']);
        },

        /**
         * 左侧verMenu点击事件处理器
         * @param {Object} evt 鼠标点击事件
         */
        leftSubmenuClickHandler: function (evt) {
            var $tar = $(evt.target);
            var url = $tar.data('sub');
            // 如果li直接跳转，则不阻止默认行为
            if (!url) {
                $tar.siblings().removeClass('current');
                $tar.addClass('current');
                return;
            }
            evt.preventDefault();
            if ($(url).is(':visible')) {
                if(!$tar.parents('div').hasClass('menucoll') &&
                    !$tar.parents('div').hasClass('menucoll2')) {
                    $(url).slideUp();
                }
            } else {
                $('.vernav ul ul, .vernav2 ul ul').each(function(){
                    $(this).slideUp();
                });
                if(!$tar.parents('div').hasClass('menucoll') &&
                   !$tar.parents('div').hasClass('menucoll2')) {
                    $(url).slideDown();
                }
            }
        },

        /**
         * 点击左侧菜单栏下的圆圈箭头，收起展开左侧垂直菜单栏事件处理器
         * @param {Object} evt 鼠标点击事件
         */
        bottomMenuClickHandler: function (evt) {
            var $tar = $(evt.target)
            if (!$tar.hasClass('togglemenu_collapsed')) {
                if($('.vernav').length > 0) {
                    if($('.vernav').hasClass('iconmenu')) {
                        $('body').addClass('withmenucoll');
                        $('.iconmenu').addClass('menucoll');
                    } else {
                        $('body').addClass('withmenucoll');
                        $('.vernav').addClass('menucoll').find('ul').hide();
                    }
                } else if($('.vernav2').length > 0) {
                    $('body').addClass('withmenucoll2');
                    $('.iconmenu').addClass('menucoll2');
                } 
                $tar.addClass('togglemenu_collapsed');
                $('.iconmenu > ul > li > a').each(function(){
                    var label = $(this).text();
                    $('<li><span>'+label+'</span></li>')
                        .insertBefore($(this).parent().find('ul li:first-child'));
                });
            } else {
                if($('.vernav').length > 0) {
                    if($('.vernav').hasClass('iconmenu')) {
                        $('body').removeClass('withmenucoll');
                        $('.iconmenu').removeClass('menucoll');
                    } else {
                        $('body').removeClass('withmenucoll');
                        $('.vernav').removeClass('menucoll').find('ul').show();
                    }
                } else if($('.vernav2').length > 0) {  
                    $('body').removeClass('withmenucoll2');
                    $('.iconmenu').removeClass('menucoll2');
                }
                $tar.removeClass('togglemenu_collapsed');   
                
                $('.iconmenu ul ul li:first-child').remove();
            }
        },
        navClickHandler: function (evt) {
            var $li = $(evt.currentTarget);
            $li.siblings().removeClass('active');
            $li.addClass('active');
        },
        activeModule: function (name) {
            if (name) {
                this.headerMenuClick(name);
                if (name === 'home') {
                    view.clearMenus(name);
                    $('body').css('overflow', 'hidden');
                } else {
                    $('body').css('overflow', 'auto');
                }
                var $tar = $('#ver_menu a[href="#' + name + '"]');
                var bigLi = $tar.parents('li');
                bigLi.siblings().find('li').removeClass('current');
                bigLi.siblings().removeClass('current');
                bigLi.addClass('current');
            }
        },
        clearMenus: function (name) {
            view.setVerMenuVisible(false);
            view.menuObj.activeBigMenu = name;
            view.renderSubMenus(menus['home']['subMenu']);
        },
        headerMenuClick: function (name) {
            var arr = this.findPath(name);
            if ((arr.length + '').indexOf('245') < -1) {
                return;
            }
            var evt = {};
            evt.currentTarget = $('#big_menu li[data-action="' + arr[0] + '"]')[0];
            this.bigMenuClickHandler(evt);
            evt.currentTarget = $('#sub_menu li[data-action="' + (arr.length > 2 ? arr[2] : name) + '"]')[0];
            this.headerMenuClickHandler(evt);
        },

        findPath: function (name) {
            var pathArr = [];
            var flag = false;
            var getKey = function (data) {
                var keys = _.keys(data);
                if (_.indexOf(keys, name) >= 0) {
                    return name;
                } else {
                    for (var i = 0; i < keys.length; i++) {
                        if (!flag) {
                            if (_.isObject(data[keys[i]])) {
                                pathArr.push(keys[i]);
                                var res = getKey(data[keys[i]]);
                                if (res) {
                                    flag = true;
                                    break;
                                } else if (!flag) {
                                    pathArr.pop();
                                }
                            }
                        } else {
                            break;
                        }
                    }
                }
            };
            getKey(this.menus);
            return pathArr;

        },

        /**
         * 设置左边栏分割线的显示与否，并将content内容区域全屏
         * @param {boolean} flag 标志是否显示左侧菜单
         */
        setVerMenuVisible: function (flag) {
            if (flag === 'show') {
                $('body').addClass('withvernav');
                $('#main_content').addClass('centercontent');
                $('#ver_menu').parent().show();
            } else {
                $('body').removeClass('withvernav');
                $('#main_content').removeClass('centercontent');
                $('#ver_menu').parent().hide();
            }
        }
    });
}
);
