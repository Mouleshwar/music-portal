// BASE SETUP
// // =============================================

var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser());

var env = app.get('env') == 'development' ? 'dev' : app.get('env');
var port = process.env.PORT || 8080;

//IMPORT MODELS
// ============================

var Sequelize = require('sequelize');

//db config 
var env = "dev";
var config = require('./database.json')[env];
var password = config.password ? config.password : null;

//initialise db connection
var sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		logging: console.log,
			define: {
				timestamps: false
			}
	}	
);

var crypto = require('crypto');
var DataTypes = require("sequelize");

var User = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    instanceMethods: {
      retrieveAll: function(onSuccess, onError) {
		User.findAll({}, {raw: true})
			.success(onSuccess).error(onError);	
	  },
      retrieveById: function(user_id, onSuccess, onError) {
		User.find({where: {id: user_id}}, {raw: true})
			.success(onSuccess).error(onError);	
	  },
      add: function(onSuccess, onError) {
		var username = this.username;
		var password = this.password;
		
		var shasum = crypto.createHash('sha1');
		shasum.update(password);
		password = shasum.digest('hex');
		
		User.build({ username: username, password: password })
			.save().success(onSuccess).error(onError);
	   },
	  updateById: function(user_id, onSuccess, onError) {
		var id = user_id;
		var username = this.username;
		var password = this.password;
		
		var shasum = crypto.createHash('sha1');
		shasum.update(password);
		password = shasum.digest('hex');
					
		User.update({ username: username,password: password},{where: {id: id} })
			.success(onSuccess).error(onError);
	   },
      removeById: function(user_id, onSuccess, onError) {
		User.destroy({where: {id: user_id}}).success(onSuccess).error(onError);	
	  },
	  removeAll: function(onSuccess,onError){
	  	User.destroy({where:{}},{raw: true}).success(onSuccess).error(onError);
	  	console.log("all users deleted");
	  }
    }
  });  


var router = express.Router();

router.route('/users')

.post(function(req,res){
	var username = req.body.username;
	var password = req.body.password;

	var user = User.build({username:username,password:password});
	user.add(function(success){
		res.json({message: "User created!"});
	},
	function(err){
		res.send(get);
	});
})

.get(function(req,res){
	var user = User.build();
	user.retrieveAll(function(users){
		if(users){
			res.json(users);
		} else {
			res.send(401,"User not found");
		}
	},
	function(error){
		res.send("User not found");
	});
});

router.route('/users/delete')
.get(function(req,res){
	var user = User.build();
	user.removeAll(function(users){
		if(users){
			res.send("user deleted");
		} else {
			res.send(401,"401 blah blah");
		}
	},
	function(error){
		res.send("some error occured");
	})
});

router.route('/users/:user_id')

.put(function(req,res){	
	var user = User.build();

	user.username = req.body.username;
	user.password = req.body.password;

	user.updateById(req.params.user_id,function(success){
		console.log(success);
		if(success){
			res.json({message:"User updated!"});
		} else {
			res.send(401,"User not found!");
		}
	}, function(error){
		res.send("User not found!");
	});
})

.get(function(req, res) {
	var user = User.build();
	
	user.retrieveById(req.params.user_id, function(users) {
		if (users) {				
		  res.json(users);
		} else {
		  res.send(401, "User not found");
		}
	  }, function(error) {
		res.send("User not found");
	  });
})

// delete a user by id (accessed at DELETE http://localhost:8080/api/users/:user_id)
.delete(function(req, res) {
	var user = User.build();
	
	user.removeById(req.params.user_id, function(users) {
		if (users) {				
		  res.json({ message: 'User removed!' });
		} else {
		  res.send(401, "User not found");
		}
	  }, function(error) {
		res.send("User not found");
	  });
});

router.use(function(req,res,next){
	console.log("something is going on");
	next();
});

app.use('/api',router);
app.listen(port);
console.log("listening on port" + port);

