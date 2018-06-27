module.exports = {
	find: function(req,res){
		User.find({sort: "createdAt DESC"})
			.then((users)=>{
				return res.view("users/index",{users: users})
			})
			.catch((err)=>{
				console.log(err)
				return res.redirect("/");
			})
	},

	admin: function(req,res){
		User.findOne({id: req.params.id}).then((user)=>{
			// req.body
			// 1 => administrador
			// 0 => no administrador
			// si el req.body.admin es == 1 se asigna a true, si viene 0 se agina a false
			// si req.admin == 1 , user.admin = true
			user.admin = req.body.admin == "1";
			user.save().then(()=> res.redirect("/user"));
		})
		.catch((err)=>{
			console.log(err);
			return res.redirect("/");
		})
		
	},
}