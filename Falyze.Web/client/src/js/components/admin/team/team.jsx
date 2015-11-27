var React = require('react'),
    Entity = require('../entity/entity.jsx'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    TeamRepo = require('../../../repositories/admin/teamRepo'),
    _clone = require('lodash/lang/clone'),
    ValInput = require('../../common/form/validationInput.jsx');

module.exports = Entity({
    repositories: [AdminRepo, TeamRepo],
    entityType: 'team',
    header: 'Team',
    getEntity: function(valgroup){
        return {
            name: valgroup.refs.inpName.get(),
            countryId: this.state.repo.admin.country.id
        };
    },
    updateEntity: function(original, valgroup){
        var team = _clone(original);
        team.name = valgroup.refs.inpName.get();
        return team;
    },
    componentDidMount: function(){
        this.setState({ fetched: true });
    },
    getView: function(state, props){
        return { noCountry: !state.repo.admin.country, empty: state.repo.team.length === 0 };
    },
    getInputs: function (model, state, props, q) {
        return [
            (<ValInput key="1" ref="inpName" label="Name" value={state.isEditing ? model.selected.name : null} cssClass="group mb" required={true} errorMessage="Name is required" />),
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
                <p className="mb-S">No teams for this country</p>
                <button data-am-button="inline link" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add team</button>
            </div>
        );
    }
});