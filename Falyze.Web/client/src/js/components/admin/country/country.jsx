var React = require('react'),
    Entity = require('../entity/entity.jsx'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    CountryRepo = require('../../../repositories/admin/countryRepo'),
    _clone = require('lodash/lang/clone'),
    ValInput = require('../../common/form/validationInput.jsx');

module.exports = Entity({
    repositories: [AdminRepo, CountryRepo],
    entityType: 'country',
    header: 'Country',

    getEntity: function(valgroup){
        return {
            name: valgroup.refs.inpName.get()
        };
    },
    updateEntity: function(original, valgroup){
        var country = _clone(original);
        country.name = valgroup.refs.inpName.get();
        return season;
    },
    onEntityChangeOverride: function(country){
        this.repo.admin.model.league.set(null);
        this.repo.admin.model.team.set(null);
    },
    componentWillMount: function () {
        this.repo.country.server.get().then(function () { this.setState({ fetched: true }); }.bind(this));
    },
    getView: function(state, props){
        return 'index';
    },
    getInputs: function (model, state, props, q) {
        return [<ValInput key="1" ref="inpName" label="Name" value={state.isEditing ? model.selected.name : null} cssClass="group mb" required={true} />];
    },
    empty: function(model, state, props, q){
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No countries exists</p>
                <button data-am-button="inline link" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add Country</button>
            </div>
        );
    }
});