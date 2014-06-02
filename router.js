'use strict';

var $ = require('jquery'),
  Backbone = require('backbone')

Backbone.$ = $
require('backbone.subroute')
require('./less/main.less')

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
}

var indexView = require('./views/IndexView'),
  NewView = require('./views/NewView')


module.exports = Backbone.SubRoute.extend({
  routes:{
    '': 'index',
    'new': 'new',
    'view/:id': 'detail'
  },

  index: function(){
    console.info('subrouter -- places home')

    this.appView(new indexView({
      collection: global.cartapacio.collections.places
    }))
  },

  new: function(){
    console.info('subrouter -- places new')
    this.appView(new NewView())
  },

  detail: function(id){
    console.info('subrouter -- categories detail')
    var model = global.cartapacio.collections.places.get(id)
    this.appView(new NewView({model:model}))
  },


  appView: function(view){
    var self = this
    if (this.currentView){
      self.currentView.close();
    }


    this.currentView = view;
    this.currentView.render();
    $('.main-content').html(this.currentView.el);

  }
})
