/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// importando la libreria
let bcrypt = require('bcrypt-nodejs')
module.exports = {

  attributes: {
  	email:{
  		type: 'string',
  		required: true,
  		unique: true
  	},
  	password:{
  		type: 'string',
  		required: true
  	},
    admin:{
      type: 'boolean',
      defaultsTo: false
    }
  },
  beforeCreate: function(user,callback){
  	bcrypt.hash(user.password,null,null,(err,hash)=>{
            if(err) return callback();
            user.password = hash;
            callback();  
  		   		
  		   })

  }
};

