/**
 * RegistrationsController
 *
 * @description :: Server-side logic for managing Registrations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show: function(req,res){
		// Mostrar el formulario
		res.view('registrations/show');
	},
	create: function(req,res){
		// Crear el usuario
		User.findOne({email: req.body.email})
			.then(function(user){
				if(user) 
					return res.view('registrations/show',{
						error: 'Ya existe el correo'
					});

				return User.create({
					email: req.body.email,
					password: req.body.password
				}).then(function(u){
					// El usuario se ha creado

					// envia a loguearse
					req.login(u,function(err){
						if(err)
							return res.view('auth/show',{error: err});
						return res.view('homepage',{user: u})
					});
					
				})
			})
			.catch(function(err){
				console.log(err);
				return res.view('registrations/show',{
					error: err
				});
			})
	}
};

