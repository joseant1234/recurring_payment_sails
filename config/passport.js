let passport = require('passport');
let bcyrpt = require('bcrypt-nodejs');
let LocalStrategy = require('passport-local').Strategy;
Promise = require('bluebird');

// serializar la sesion (poner los datos de usuario en la sesion del navegador)
// la variable user de function es el usuario q se ha obtenido del done de la estrategia de autenticacion (localstrategy)
// recibe lo guardado en la estrategia de autenticacion
passport.serializeUser(function(user,done){
	// guarda el id del usuario en la sesion
	done(null,user.id);
});

// deserializar la sesion (sacar los datos del usuario del navegador)
// recibe lo q se guardo en la sesion
passport.deserializeUser(function(userID,done){
	User.findOne({id: userID})
		.then(user => done(null,user))
		.catch(err => done(err,false))
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},function(email,password,done){
	let promiseFindUser = User.findOne({email: email});

	let promiseHashEquals = promiseFindUser.then(function(user){
		if(!user) return false;

		return bcryptFromCallbackToPromise(password,user);
	})

	function bcryptFromCallbackToPromise(password,user){
		return new Promise(function(resolve,reject){
			return bcyrpt.compare(password,user.password,function(err,res){
				if(err){
					reject(err);
				}
				resolve(res);
			})
			
		})
	}


	// spread espera que se realice las promesa que estan en Promise.all
	// los datos q envia cada promesa son recibidos en la function de spread de acuerdo a cada promsea
	// user es de promiseFindUser, passwordCorred es de promsiseHashEquals
	Promise.all([promiseFindUser,promiseHashEquals])
			.spread(function(user,passwordCorrect){
				
				if(!user || !passwordCorrect)
					return done(null,false,{message: "Usuario no encontrado o password incorrecto"});

				let returnUser = {
					email: user.email,
					id: user.id,
					createdAt: user.createdAt
				};
				// done(errores,siHayUsuarioEncontrado,{otras variables});
				done(null,returnUser,{message: "Bienvenido"});

			})
			.catch(err => done(err,false,{message: err}))

}));
