'use strict';

var $ = require('jquery'),
  Backbone = require('backbone'),
  _ = require('lodash'),
  model = require('../models/PlaceModel'),
  config = require('../config'),
  template = require('../templates/New.hbs'),
  FormSerializer = require('form-serializer'),
  serializer = new FormSerializer($)

 require('./../vendor/d3/d3')
 require('./../vendor/topojson/topojson')
 require('./../vendor/datamaps/dist/datamaps.all')

Backbone.$ = $


module.exports = Backbone.View.extend({
  //el: '.main-content',

  initialize: function(){
    console.info('new place view --- initialize')

    this.model = this.model || new model()

    this.model.on('invalid', this.handleError)
  },

  events:{
    'click #save': 'save',
    'click #delete': 'delete',
    'click #cancel': 'cancel'
  },

  render: function(){
    this.template = template(this.model.attributes)
    // Dynamically updates the UI with the view's template
    this.$el.html(this.template);

    // render map
    var self = this
    _.defer(function (){
      self.map = new Datamap({
        element: self.$el.find('#place')[0],
        scope: 'world',
        fills: {
          defaultFill: '#000000',
          'point': '#bb5045'
        },
        geographyConfig: {
          highlightFillColor: '#616263'
        },
        done: function(datamap){
          datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            self.updateBubble(geography)
          })
        }
      })

      var country = self.model.get('country')
      if(country){
        var point = [{
                name: self.model.get('name_es'),
                country: country,
                centered: country,
                radius: 10,
                fillKey: 'point'
              }]
        self.map.bubbles(point)
      }
    })

    return this
  },

  updateBubble: function(geography){
    var id = geography.id
    var name = geography.properties.name

    var item = [{
      name: name,
      centered: id,
      radius: 10,
      fillKey: 'point'
    }]

    this.map.bubbles(item)

    this.$('#country_name_es').val(name)
    this.$('#country_name_en').val(name)
    this.$('#country').val(id)
  },

  save: function(){
    // clean validation feedback
    $('.form-group').removeClass('has-error')

    var info = $('#data').serializeArray()
    var doc = serializer.addPairs(info).serialize()

    this.model.save(doc,{
      success: function(model){
        global.cartapacio.collections.places.add(model)
        global.cartapacio.router.navigate(config.url, {trigger: true})
      }
    })
  },

  delete: function(){
    this.model.destroy({
      success: function(){
        global.cartapacio.router.navigate(config.url, {trigger: true})
      }
    })
  },

  cancel: function(){
    global.cartapacio.router.navigate(config.url, {trigger: true})
  },

  handleError: function(model, err){
    _.each(err, function (item){
      $('#'+item.id).parent().toggleClass('has-error')
    })
  },
});
