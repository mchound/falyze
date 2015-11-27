var React = require('react'),
    Lean = require('../../../lean/lean'),

    ImportStore = require('../../../stores/import/ImportStore'),

    Actions = require('../../../actions/Actions'),

    Ajax = require('../../../lean/store/ajax');

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function(){
        return {
            editAlias: false
        };
    },
    onSubmitAlias: function(e){
        e.preventDefault();
        var teamId = this.refs.team.getDOMNode().value;

        Ajax.post('/api/import/team/alias', {teamId: teamId, alias: this.props.item.name},
            function (alias) {
                Actions.Import.addAlias.dispatch(alias);
            }.bind(this),
            function (xhr) {
                console.log(xhr);
            }
        );
    },
    onCreate: function(){
        Ajax.post('/api/import/team/' + this.props.item.name + '/' + this.state.store.import.country.id, null,
            function (team) {
                Actions.Import.addTeam.dispatch(team);
            }.bind(this),
            function (xhr) {
                console.log(xhr);
            }
        );
    },
    action: function(state, props){
        return {
            teams: state.store.import.teams.sort((a, b) => { return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : (a.name.toLowerCase() === b.name.toLowerCase() ? 0 : -1)} )
        }
    },
    view: function (model, state, props, q) {
        return (
            <tr className="newTeam">
                <td>{props.item.nr + 1}</td>
                <td onClick={this.setStateShort.bind(this, {editAlias: false})}>{props.item.name}</td>
                <td className={q.hide(state.editAlias)}><button data-am-button="green thinner" onClick={this.onCreate}>Create</button></td>
                <td className={q.hide(state.editAlias)}><button onClick={this.setStateShort.bind(this, {editAlias: !state.editAlias})} data-am-button="green thinner">As alias</button></td>
                <td className={q.hide(!state.editAlias)} colSpan="2">
                    <form onSubmit={this.onSubmitAlias} data-am-import-form>
                        <select className="smaller" ref="team">
                            {model.teams.map( (t) => { return (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            )})}
                        </select>
                        <button data-am-button="green thinner" type="submit">Save</button>
                    </form>
                </td>
            </tr>
        );
    }
});