var React = require('react'),

    viewHelper = require('./viewHelper.js'),

    __assign = require('lodash/object/assign'),

    __capitalize = require('lodash/string/capitalize');

function controller(options){

    var internalRenderLoad = function(){
	    return (<p>Loading...</p>);
	}

	var internalRender = function(){
	    var viewModel = this.state,
            renderState = !!this.getRenderState ? this.getRenderState(this.state, this.props) : null,
            partials = {};

		if(!!this.action){
			viewModel = this.action(this.state, this.props);
		}

		if(!!this.partialViews && this.partialViews.constructor === Object){
		    for(var p in this.partialViews){
		        partials[p] = this.partialViews[p].call(this, viewModel, this.state, this.props, viewHelper);
		    }
		}

		if(this.view.constructor === Function){
		    return this.view.call(this, viewModel, this.state, this.props, viewHelper, partials);
		}
		else if(this.view.constructor === Object){
		    return this.view[renderState].call(this, viewModel, this.state, this.props, viewHelper, partials);
		}
	}

	var initializeStores = function(){
	    this.store = {};
	    this.stores.forEach(function(store){
	        this.store[store.alias] = store;
	    }.bind(this));
	}

	var attachStores = function(){
	    this.stores.forEach(function(store){
	        var storeChangeCallback = function(){
	            if(this.isMounted()){
	                var state = this.state;
	                var componentCallbackName = 'on' + __capitalize(store.alias) + 'Update';
	                state.store[store.alias] = store.get();
	                if(!!this[componentCallbackName]){
	                    this[componentCallbackName].apply(this, arguments);
	                }
	                this.setState(state);
	            }
	        }.bind(this);
	        store.on(storeChangeCallback);
	        this.storeCallbacks[store.alias] = storeChangeCallback;
	    }.bind(this));
	}

	var disposeStores = function(){
	    this.stores.forEach(function(store){
	        store.off(this.storeCallbacks[store.alias]);
	    }.bind(this));
	}

	var getStateFromStores = function(){
	    var stores = {};
	    this.stores.forEach(function(store){
            stores[store.alias] = store.get();
	    }.bind(this));
	    return stores;
	}

	var reactClassDef = {
	    storeCallbacks: {},
	    initializeStores: function(){
	        if(!!this.stores && !!this.stores.length){
	            initializeStores.call(this);
	        }
	    },
	    getInitialState: function(){
	        var initialState = !!options.getInitialState ? options.getInitialState.call(this) : {},
	            storeState = !!this.stores && !!this.stores.length ? getStateFromStores.call(this) : {};
	        initialState = __assign({store: storeState}, initialState);
	        return initialState;
	    },
	    componentWillMount: function(){
	        if(!!options.componentWillMount){
	            options.componentWillMount.call(this);
	        }
	    },
	    componentDidMount: function(){
	        if(!!this.stores && !!this.stores.length){
	            attachStores.call(this);
	        }
	        if(!!options.componentDidMount){
	            options.componentDidMount.call(this);
	        }
	    },
	    componentWillUnmount: function(){
	        if(!!this.stores && !!this.stores.length){
	            disposeStores.call(this);
	        }
	        if(!!options.componentWillUnmount){
	            options.componentWillUnmount.call(this);
	        }
	    },
	    render: function(){
	        if(!!this.shouldRender && !this.shouldRender.call(this, this.state, this.props)) return null;
	        else if(!!this.isLoading && this.isLoading.call(this, this.state, this.props)) return !!this.renderLoad ? this.renderLoad() : internalRenderLoad();
	        else return internalRender.call(this)
	    },

	    // Helper methods
	    getRefNode: function(ref){
	        return this.refs[ref].getDOMNode();
	    },

	    setStateShort: function(state){
	        this.setState(state);
	    }
	};

	var classProps = {};
    __assign(classProps, options, reactClassDef);

	classProps.initializeStores();

	return React.createClass(classProps);

}

module.exports = controller;