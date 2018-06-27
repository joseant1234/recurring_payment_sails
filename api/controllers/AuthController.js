/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let passport = require('passport');

module.exports = {
	show: function(req,res){
		res.view('auth/show');
	},

	create: function(req,res){
		// envia a la variable locals el objeto req.user para q pueda ser usado en la vista
		// es accedida en la vista p= user
		// res.locals.user = req.user;

		// Crear la sesion
		passport.authenticate('local',function(err,user,extraInfo){
			if(err || !user)
				return res.view('auth/show',{});

			// guarada la sesion
			req.login(user,function(err){
				if(err)
					return res.view('auth/show',{error: err});
				return res.view('homepage',{user: user})
			});
		})(req,res);
	},

	destroy: function(req,res){
		// req.session guarada las sesiones de la aplicacion
		// passport hace referencia a la estrategia de autheticacion
		// si existe una sesion lo pone en null
		if(typeof req.session.passport != "undefined"){
			req.session.passport.user = null;
		}
		res.redirect("/");

	}
};

