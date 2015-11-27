var React = require('react'),
    Entity = require('../entity/entity.jsx'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    LeagueRepo = require('../../../repositories/admin/leagueRepo'),
    _clone = require('lodash/lang/clone'),
    ValInput = require('../../common/form/validationInput.jsx');

module.exports = Entity({
    repositories: [AdminRepo, LeagueRepo],
    entityType: 'league',
    header: 'League',
    getEntity: function(valgroup){
        return {
            name: valgroup.refs.inpName.get(),
            level: valgroup.refs.inpLevel.get(),
            countryId: this.state.repo.admin.country.id
        };
    },
    updateEntity: function(original, valgroup){
        var league = _clone(original);
        season.name = valgroup.refs.inpName.get();
        season.level = valgroup.refs.inpLevel.get();
        return season;
    },
    componentDidMount: function(){
        this.setState({ fetched: true });
    },
    getView: function(state, props){
        return { noCountry: !state.repo.admin.country, empty: state.repo.league.length === 0 };
    },
    getInputs: function (model, state, props, q) {
        return [
            (<ValInput key="1" ref="inpName" label="Name" value={state.isEditing ? model.selected.name : null} cssClass="group mb" required={true} errorMessage="Name is required" />),
            (<ValInput key="2" ref="inpLevel" label="Level" value={state.isEditing ? model.selected.startYear : null} cssClass="group mb" required={true} pattern={/^\d$/g} errorMessage="Wrong format, level must be a number" />  )
        ];
    },
    noCountry: function () {
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No country selected</p>
            </div>
        );
    },
    empty: function(model, state, props, q){
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No leagues for this country</p>
                <button data-am-button="inline link" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add league</button>
            </div>
        );
    }
});