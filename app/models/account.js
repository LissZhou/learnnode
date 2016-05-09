var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    role: {
	    type: Number,
	    default: 0
	  },
	  meta: {
	    createAt: {
	      type: Date,
	      default: Date.now()
	    },
	    updateAt: {
	      type: Date,
	      default: Date.now()
	    }
	  }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
