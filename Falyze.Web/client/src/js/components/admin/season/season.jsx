var React = require('react'),
    Entity = require('../entity/entity.jsx'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    SeasonRepo = require('../../../repositories/admin/seasonRepo'),
    _clone = require('lodash/lang/clone'),
    ValInput = require('../../common/form/validationInput.jsx');

module.exports = Entity({
    repositories: [AdminRepo, SeasonRepo],
    entityType: 'season',
    header: 'Season',
    sortBy: function (entity) {
        return -entity.startYear;
    },
    getEntity: function(valgroup){
        return {
            name: valgroup.refs.inpName.get(),
            startYear: valgroup.refs.inpStartYear.get()
        };
    },
    updateEntity: function(original, valgroup){
        var season = _clone(original);
        season.name = valgroup.refs.inpName.get();
        season.startYear = valgroup.refs.inpStartYear.get();
        return season;
    },
    componentWillMount: function () {
        this.repo.season.server.get().then(function () { this.setState({ fetched: true }); }.bind(this));
    },
    getView: function(state, props){
        return !!state.repo.season.length ? 'index' : 'empty';
    },
    getInputs: function (model, state, props, q) {
        return [
            (<ValInput key="1" ref="inpName" label="Name" value={state.isEditing ? model.selected.name : null} cssClass="group mb" required={true} errorMessage="Name is required" />),
            (<ValInput key="2" ref="inpStartYear" label="Start year" value={state.isEditing ? model.selected.startYear : null} cssClass="group mb" required={true} pattern={/^\d{4}$/g} errorMessage="Wrong format, startyear should be formatted as yyyy" />  )
        ];
    },
    empty: function(model, state, props, q){
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No seasons exists</p>
                <button data-am-button="inline link" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add Season</button>
            </div>
        );
    }
});