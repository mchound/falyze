var React = require('react'),
    Entity = require('../entity/entity.jsx'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    AliasRepo = require('../../../repositories/admin/aliasRepo'),
    _clone = require('lodash/lang/clone'),
    ValInput = require('../../common/form/validationInput.jsx');

module.exports = Entity({
    repositories: [AdminRepo, AliasRepo],
    entityType: 'alias',
    header: 'Team alias',
    getEntity: function(valgroup){
        return {
            alias: valgroup.refs.inpName.get(),
            teamId: this.state.repo.admin.team.id
        };
    },
    updateEntity: function(original, valgroup){
        var alias = _clone(original);
        alias.alias = valgroup.refs.inpName.get();
        return alias;
    },
    componentDidMount: function(){
        this.setState({ fetched: true });
    },
    getSelectItems: function(state){
        return state.repo[this.entityType].map((e) => ({ value: e.id, text: e.alias, sortBy: e.alias, selected: !!state.selected && e.id === state.selected.id }));
    },
    getView: function(state, props){
        return { noTeam: !state.repo.admin.team, empty: state.repo.alias.length === 0 };
    },
    getInputs: function (model, state, props, q) {
        return [
            (<ValInput key="1" ref="inpName" label="Name" value={state.isEditing ? model.selected.alias : null} cssClass="group mb" required={true} errorMessage="Name is required" />),
        ];
    },
    noTeam: function () {
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No team selected</p>
            </div>
        );
    },
    empty: function(model, state, props, q){
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No aliases for this team</p>
                <button data-am-button="inline link" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add alias</button>
            </div>
        );
    }
});