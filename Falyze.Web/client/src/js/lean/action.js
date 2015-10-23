var action = function(alias){
	var

	_callbacks = [];

	this.alias = alias;

	this.on = function(callback){
		_callbacks.push(callback);
	};

	this.dispatch = function(payload){
		var callbacks = Array.apply(_callbacks, _callbacks);
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](payload);
		}
	}
};

module.exports = action;