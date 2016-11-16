define(
function () {
    return {
            home: {
                name: '首页',
                subMenu: {},
                view: 'home'
            },
            report: {
                name: '表单信息',
                view: 'module-detail',
                subMenu: {
                    dumina: {
                        name: '表单提交',
                        view: 'module-detail',
                        iconClass: 'icon icon-flatscreen',
                        verMenu: {
                            coredata: {
                                name: '基本表单',
                                iconClass: 'editor',
                                verMenu: {
                                    'module-detail': {name: '表单验证'},
                                    'module-stat': {name: '表单属性'}
                                }
                            },
                            other: {
                                name: '其它表彰',
                                iconClass: 'error'
                            }
                        }
                    },
                    dumiplugin: {
                        name: '网页元素',
                        view: 'startdataplugin',
                        iconClass: 'icon icon-message',
                        verMenu: {
                            coredata: {
                                name: '网页元素1',
                                iconClass: 'editor',
                                verMenu: {
                                    startdataplugin: {name: '网页元素1-1'},
                                    // showclickpercent: {name: '展点比'},
                                    retentionrateplugin: {name: '网页元素1-2'},
                                    userattributeplugin: {name: '网页元素1-3'}
                                }
                            }
                        }
                    }
                }
            },
            blog: {
                name: '管理博客',
                view: 'blog',
                subMenu: {
                    resva: {name: '已发表', iconClass: 'icon icon-message', view: 'blog'},
                    sessionva: {name: '反馈信息', iconClass: 'icon icon-speech', view: 'comment'}
                }
            },
            message: {
                name: '消息管理',
                view: 'message',
                subMenu: {}
            },
            monitor: {
                name: '链接百度',
                subMenu: {},
                url: 'http://www.baidu.com/'
                // 在新窗口中打开该链接，区别与view,view值在本窗口中打开页面，且是本站内容
            }
    };
});
