module.exports = function(req, res, next) {
	if(req.user && true){
		return next();
	}

	return res.redirect("/");

};
