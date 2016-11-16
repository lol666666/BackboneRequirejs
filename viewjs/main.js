/**
 * @file 定义页面加载及路由入口文件
 * @author Yajiao Wang
 */
define(
function (require) {
    var Backbone = require('backbone');
    var _ = require('underscore');

    var UserModel = require('frame/models/UserModel');
    var BannerView = require('frame/TopMenuView');
    var HomeView = require('home/MainView');
    /**
     * 设置路由信息
     */
    var IndexRouter = Backbone.Router.extend({
        routes: {
            ':name': 'navigator',
            ':name/:query': 'navigator',
            ':name/:query/:page': 'navigator'
        },
        initialize: function (options) {
            this.app = options.app;
        },
        navigator: function (name, query, page) {
            // 登陆信息判断
            /*if (!name || !window.userModel.get('id')) {
                jAlert('请您登录', '提示');
                return;
            }*/
            this.app.bannerView.activeModule(name);
            var module = name + '/MainView';
            var me = this;
            // 加载模块对应的页面，所有的可加载view必须实现render方法，并返回view本身
            require([module], function (View) {
                new View({
                    el: $('#main_content').empty(),
                    userModel: window.userModel
                }).render(name, query, page);
            });
        }
    });

    var App = function (options) {
        this.options = options;
        this.initialize.apply(this, arguments);
    };
    Backbone.url = function (path) {
        return window.location.origin + '/' + path;
    };
    Backbone.getQueryParam = function (url) {
        var theRequest = {};
        if (url.indexOf('?') !== -1) {
            var str = url.substr(1);
            var strs = str.split('&');
            for (var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
            }
        }
        return theRequest;
    };
    _.extend(App.prototype, Backbone.Events, {
        initialize: function (options) {
            window.userModel = this.userModel = new UserModel();
            this.bannerView = new BannerView({
                el: $('body'),
                userModel: this.userModel
            });
            this.homeView = new HomeView({
                el: $('#main_content')
            });
        },
        authAndLoad: function () {
            var me = this;
            var resFunc = function (res) {
                me.bannerView.render();
                if (!window.location.hash) {
                    me.homeView.render();
                }
                me.startRouter();
            };
            resFunc();
            /*this.userModel.fetch({
                success: resFunc,
                error: resFunc
            });*/
        },
        startRouter: function () {
            new IndexRouter({
                app: this
            });
            Backbone.history.start();
        }
    });
    return App;
}
);
