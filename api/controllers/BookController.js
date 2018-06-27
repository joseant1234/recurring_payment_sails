/**
 * BookController
 *
 * @description :: Server-side logic for managing Books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// restfull route
	find: function(req,res){
		// el metodo exec es neceario porque la consulta a la BD es de manera asincrona
		// exec se ejecuta cuando la termino la consulta
		// en mongodb un documento es el registro (objeto), collection son las tablas en sql
		// Book.find return un arreglo
		Book.find({
			limit: 20,
			sort: "createdAt DESC"
		}).exec(function(err,docs){
			// se puede utilizar el metodo de express
			return res.view('books/index',{books: docs});
		});
	},
	// restfull route
	findOne: function(req,res){
		// Book.findOne return un objeto
		// el parametro se obtiene req.params.nombreParametro
		Book.findOne({id: req.params.id}).exec(function(err,book){
			if(err) console.log(err)
			return res.view('books/show',{book: book});	
		});
		
	},
	// action route
	new: function(req,res){
		var formURL = '/book';
		return res.view('books/new',{formURL: formURL, book: {customDate: function(){return ''}} });	
	},

	create: function(req,res){
		// HAY 2 MANERAS DE GUARAR ARCHIVOS:
		// GUARDAR EL REGISTRO EN LA BD y luego arhcivo
		// Primero guardar el archivo y luego guardarlo en la BD
		// Los archvios se guardar por default en la carpeta .tmp
		// SE SELECCIONA LA ESTRATEGIA DE GUARADAR EL ARCHVIO Y LUEGO LA BD
		req.file('avatar').upload({
			// lo que esta dentro de assets es publico
			dirname: '../../assets/images/books/avatars'
		},function(err,files){
			// negotiate intenta encontrar la respuesta al error, es un metodo de sails
			if(err) res.negotiate(err);
			var options = {
				title: req.body.title,
				description: req.body.description,
				pages: req.body.pages,
				publishedAt: req.body.publishedAt
			};

			if(files.length > 0){
				// pop saca el ultimo elemento del arreglo del resultado de split
				// split para windwos \\
				// split para linux /
				options['avatarUrl'] = files[0].fd.split("\\").pop();
			}

			Book.create(options,function(err,newBook){
				res.redirect('/book/'+newBook.id);
			});
			// muestra los datos del los archivos
			// res.send(files);
			// muestra en el navegador la var options
			// res.send(options);
		})

	},

	edit: function(req,res){
		Book.findOne({id: req.params.id}).exec(function(err,book){
			if(err) console.log(err)
			var formURL = "/book/"+req.params.id+"?_method=PUT";
			return res.view('books/edit',{book: book, formURL: formURL});
		});
	},

	update: function(req,res){
		let datosActualizar = {};

		if(req.body.title) datosActualizar['title'] = req.body.title;
		if(req.body.description) datosActualizar['description'] = req.body.description;
		if(req.body.pages) datosActualizar['pages'] = req.body.pages;
		if(req.body.publishedAt) datosActualizar['publishedAt'] = req.body.publishedAt;

		req.file('book').upload({
			// esta carpeta es privada
			dirname: '../../books/files'
		},function(err,files){
			if(err) res.negotiate(err);

			if(files.length > 0){
				datosActualizar['pdfUrl'] = files[0].fd.split("\\").pop();
			}

			// update actualiza todos los recursos que cumplan con la condicion en el update, este caso es el id
			Book.update({id: req.params.id},datosActualizar)
				.exec(function(err,librosActualizados){
					if(err) res.negotiate(err);
					res.view('books/show',{book: librosActualizados[0]});
				});
		});

	},

	delete: function(req,res){
		Book.findOne({id: req.params.id}).exec(function(err,book){
			if(err) console.log(err)
			return res.view('books/delete',{book: book});
		});
	},

	destroy: function(req,res){
		Book.destroy({id: req.params.id}).exec(function(err){
			return res.redirect("/book");
		});
	}
};

