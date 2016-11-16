/**
 * @file 模板入口文件
 * @author Yajiao Wang (wangyajiao@baidu.com)
 */
define(
function (require) {
    var Backbone = require('backbone');
    var _ = require('underscore');

    var content = require('text!tmp/templates/content.html');

    return Backbone.View.extend({
        render: function () {
            this.$el.html(_.template(content));
            return this;
        }
    });
}
);
