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

var User = sequelize.define('gigs', {
    date: DataTypes.STRING
    time: DataTypes.STRING,
    band: DataTypes.STRING,
    venue: DataTypes.STRING
  }, {
    instanceMethods: {
      retrieveAll: function(onSuccess, onError) {
		User.findAll({}, {raw: true})
			.success(onSuccess).error(onError);	
	  },
      add: function(onSuccess, onError) {
		var date = this.date;
		var time = this.time;
		var band = this.band;
		var venue = this.venue;
				
		User.build({ date: date, time: time, band: band, venue: venue })
			.save().success(onSuccess).error(onError);
	   },
	  updateById: function(id, onSuccess, onError){
	  		var id = id;
	  		var date = this.date;
	  		var time = this.time;
	  		var band = this.band;
	  		var venue = this.venue;

	  		User.update({date: date, time: time,band: band, venue: venue},{where: {id: id} })
	  		.success(onSuccess).error(onError);
	  },
      removeById: function(id, onSuccess, onError) {
		User.destroy({where: {id: id}}).success(onSuccess).error(onError);	
	  },
	  removeAll: function(onSuccess,onError){
	  	User.destroy({where:{}},{raw: true}).success(onSuccess).error(onError);
	  	console.log("all users deleted");
	  }
    }
  });  


var router = express.Router();

router.route('/gigs/add')

.post(function(req,res){
	var date = req.body.date;
	var time = req.body.time;
	var band = req.body.band;
	var venue = req.body.venue;

	var gig = User.build({date: date, time: time, band: band, venue: venue});
	gig.add(function(success){
		res.json({message: "User created!"});
	},
	function(err){
		res.send(get);
	});
});

router.route('/gigs')

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

router.route('/gigs/update/:id')

.put(function(req,res){
	var user = User.build();

	var date = req.body.date;
	var time = req.body.time;
	var band = req.body.band;
	var venue = req.body.venue;
	
	user.updateById(req.params.id,function(users){
		if(users){
			res.send("Gig Updated");
		} else {
			res.send(401,"401 blah blah");
		}
	},
	function(error){
		res.send("some error occured");
	})
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

