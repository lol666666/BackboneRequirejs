/**
 * @file 模板入口文件
 * @author Yajiao Wang
 */
define(
function (require) {
    var Backbone = require('backbone');
    var _ = require('underscore');

    var content = require('text!module-stat/templates/content.html');

    return Backbone.View.extend({
        render: function () {
            this.$el.html(_.template(content));
            return this;
        }
    });
}
);
