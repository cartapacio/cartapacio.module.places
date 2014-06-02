'use strict';

var $ = require('jquery'),
  Backbone = require('backbone'),
  config = require('../config')

Backbone.$ = $

module.exports = Backbone.Model.extend({

  urlRoot: config.CARTAPACIO_SERVER + '/doc',

  idAttribute: '_id',

  // Default values for all of the Model attributes
  defaults: {
    doctype: 'place',
    country:'',
    country_name_es: '',
    country_name_en: ''
  },

  // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
  validate: function(attrs) {
    var errors = []

    if(!attrs.country_name_es){
      errors.push({
        id: 'country_name_es',
        msg: 'empty name'
      })
    }

    if(!attrs.country_name_en){
      errors.push({
        id: 'country_name_en',
        msg: 'empty name'
      })
    }

    return errors.length > 0 ? errors : false
  }

})
