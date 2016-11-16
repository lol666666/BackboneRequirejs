/**
 * @file 请求用户接口
 * @author Yajiao Wang
 */
define(
function (require) {
    var Backbone = require('backbone');

    return Backbone.Model.extend({
        defaults: {
            id: 0,
            name: ''
        },
        url: function () {
            return Backbone.url('user/detail');
        }
    });
}
);
