'use strict';

var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('lodash'),
  template = require('../templates/Index.hbs'),
  config = require('../config')

require('jquery-ui/sortable')

Backbone.$ = $

module.exports = Backbone.View.extend({

  initialize: function(){
    console.info('places index --- initialize')

  },

  events:{
    'click #new': 'new',
    'click .detail': 'detail',
    'click .delete': 'delete'
  },

  render: function(){
    this.template = template({models: this.collection.models})
    // Dynamically updates the UI with the view's template
    this.$el.html(this.template);

    var self = this

    this.$('#item-list').sortable({
      axis: 'y',
      update: function (){
        self.sort($(this).sortable('toArray'))
      }
    })
    this.$('#item-list').disableSelection()

    return this
  },

  new: function(){
    global.cartapacio.router.navigate(config.url + 'new', {trigger: true})
  },

  sort: function(order){
    _.each(order, function (item, index){
      var model = this.collection.get(item)
      model.set({order: index})
      model.save()
    }, this)
  },

  delete: function(e){
    var target = $(e.currentTarget).attr('data-id')
    var item = this.collection.get(target)

    item.destroy({
      wait: true,
      success: function(){
         $(e.currentTarget).closest('li').remove()
      }
    })
  },

  detail: function(e){
    e.preventDefault()

    var target = $(e.currentTarget).attr('data-id')
    global.cartapacio.router.navigate( config.url + 'view/'+target, {trigger: true})
  },

})


