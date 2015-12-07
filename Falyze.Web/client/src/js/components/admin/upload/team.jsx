var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    TeamRepo = require('../../../repositories/admin/teamRepo'),
    AliasRepo = require('../../../repositories/admin/aliasRepo'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    UploadRepo = require('../../../repositories/admin/uploadRepo'),

    MsgUtils = require('../utils/msgUtils').messages;

module.exports = Lean.createComponent({
    repositories: [UploadRepo],
    getIntiialState: function(){
        return {
            addAlias: false
        };
    },
    onAddTeamClick: function () {
        var team = {
            name: this.props.item.name,
            countryId: AdminRepo.model.country.get().id
        };
        MsgUtils.add('team - adding', 'Saving team', 'add');
        TeamRepo.server.post(team).then(this.onTeamAdded).error(this.onServerError);
    },
    onTeamAdded: function(team){
        MsgUtils.remove('team - adding');
        MsgUtils.add('team - added', 'team added', null, 3000);
        AdminRepo.model.team.set(team);
    },
    onAliasChange: function (e) {
        if (!e.target.value || e.target.value === '') {
            return;
        }
        var alias = {
            alias: this.props.item.name,
            teamId: e.target.value
        };
        MsgUtils.add('alias - adding', 'Saving alias', 'add');
        AliasRepo.server.post(alias).then(this.onAliasAdded).error(this.onServerError);
    },
    onAliasAdded: function(alias){
        MsgUtils.remove('alias - adding');
        MsgUtils.add('alias - added', 'team added', null, 3000);
        if (this.isMounted()) {
            this.setState({ addAlias: false });
        }
    },
    onServerError: function(xhr){
        MsgUtils.add('team - error', xhr.responseText, 'error');
    },
    controller: function (state, props) {
        return {
            view: { addAlias: state.addAlias, newTeam: !props.item.team && !props.item.alias, team: !!props.item.team, alias: !!props.item.alias },
            teams: TeamRepo.getModel().sort((a,b) => a.name.localeCompare(b.name))
        }
    },
    addAlias: function(model, state, props, q){
        return (
            <tr>
                <td>{props.item.name}</td>
                <td>
                    <select onChange={this.onAliasChange}>
                        <option>Select team</option>
                        {model.teams.map((t) => {return (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        )})}
                    </select>
                </td>
            </tr>  
        );
    },
    newTeam: function(model, state, props, q){
        return (
            <tr>
                <td>{props.item.name}</td>
                <td>
                    <button data-am-button="green thin" onClick={this.onAddTeamClick}>Team</button>
                    <button data-am-button="green thin" onClick={this.changeState.bind(this, {addAlias: true})} className="ml-S">Alias</button>
                </td>
            </tr>
        );
    },
    alias: function(model, state, props, q){
        return (
            <tr>
                <td>{props.item.name}</td>
                <td>Alias for {props.item.aliasFor.name}</td>
            </tr>
        );
    },
    team: function (model, state, props, q) {
        return (
            <tr>
                <td>{props.item.name}</td>
                <td>Existing</td>
            </tr>
        );
    }
});