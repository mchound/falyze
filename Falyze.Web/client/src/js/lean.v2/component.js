var React = require('react'),
    
    viewHelper = require('./viewHelper'),

    _assign = require('lodash/object/assign');

var attachRepos = function () {
    this.repositories.forEach(function (repo) {
        var cb = function (newVal, oldVal) {
            if (this.isMounted()) {
                this.state.repo[repo.alias] = repo.getModel();
                this.setState(this.state);
            }
        }.bind(this);
        repo.observe(cb);
        this.repoCallbacks[repo.alias] = cb;
    }.bind(this));
}

var disposeRepos = function () {
    this.repositories.forEach(function (repo) {
        repo.mute(this.repoCallbacks[repo.alias]);
    }.bind(this));
}

var getStateFromRepos = function () {
    var repos = {};
    this.repositories.forEach(function (repo) {
        repos[repo.alias] = repo.getModel();
    }.bind(this));
    return repos;
}

var getViewName = function (viewContext) {
    if (!viewContext || !viewContext.view) {
        return 'index';
    }
    else if (!!viewContext.view && viewContext.view.constructor === String) {
        return viewContext.view;
    }
    else if(!!viewContext.view && viewContext.view.constructor === Object){
        for (var viewName in viewContext.view) {
            if (viewContext.view[viewName] === true) {
                return viewName;
            }
        }
        return 'index';
    }
}

var internalRender = function () {
    var viewModel = this.state;

    if (!!this.controller) {
        var viewContext = this.controller(this.state, this.props);
        var viewModel = !!viewContext && !!viewContext.viewModel ? viewContext.viewModel : viewContext;
        var view = getViewName(viewContext);
        var viewResult = this[view].call(this, viewModel, this.state, this.props, viewHelper);
        var viewResult = !!this._layout ? this._layout.call(this, viewResult, viewModel, this.state, this.props, viewHelper) : viewResult;

        return viewResult;
    }

    //if (!!this.action) {
    //    viewModel = this.action(this.state, this.props);
    //}

    //if (this.view.constructor === Function) {
    //    return this.view.call(this, viewModel, this.state, this.props, viewHelper);
    //}
}

var initializeRepos = function () {
    this.repo = {};
    this.repositories.forEach(function (repo) {
        this.repo[repo.alias] = repo;
    }.bind(this));
}

function component(options) {
    var reactClassDef = {
        repoCallbacks: {},
        initializeRepos: function () {
            if (!!this.repositories && !!this.repositories.length) {
                initializeRepos.call(this);
            }
        },
        getInitialState: function () {
            var initialState = !!options.getInitialState ? options.getInitialState.call(this) : {},
	            repoState = !!this.repositories && !!this.repositories.length ? getStateFromRepos.call(this) : {};
            return _assign({ repo: repoState }, initialState);
        },
        componentWillMount: function () {
            if (!!options.componentWillMount) {
                options.componentWillMount.call(this);
            }
        },
        componentDidMount: function () {
            if (!!this.repositories && !!this.repositories.length) {
                attachRepos.call(this);
            }
            if (!!options.componentDidMount) {
                options.componentDidMount.call(this);
            }
        },
        componentWillUnmount: function () {
            if (!!this.repositories && !!this.repositories.length) {
                disposeRepos.call(this);
            }
            if (!!options.componentWillUnmount) {
                options.componentWillUnmount.call(this);
            }
        },
        render: function () {
            if (!!this.shouldRender && !this.shouldRender.call(this, this.state, this.props)) return null;
            else if (!!this.isLoading && this.isLoading.call(this, this.state, this.props)) return !!this.renderLoad ? this.renderLoad() : internalRenderLoad();
            else return internalRender.call(this)
        },
        changeState: function (state) {
            this.setState(state);
        }
    };

    var classProps = {};
    _assign(classProps, options, reactClassDef);

    classProps.initializeRepos();

    return React.createClass(classProps);
}

module.exports = component;