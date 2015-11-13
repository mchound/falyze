var React = require('react'),
    Lean = require('../../../lean/lean'),

    ImportStore = require('../../../stores/import/ImportStore');

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function(){
        return {
            editAlias: false
        };
    },
    onSubmitAlias: function(e){
        e.preventDefault();
    },
    action: function(state, props){
        
    },
    view: function (model, state, props, q) {
        return (
            <tr className="newTeam">
                <td>{props.item.nr + 1}</td>
                <td onClick={this.setStateShort.bind(this, {editAlias: false})}>{props.item.name}</td>
                <td className={q.hide(state.editAlias)}><button data-am-button="green thinner">Create</button></td>
                <td className={q.hide(state.editAlias)}><button onClick={this.setStateShort.bind(this, {editAlias: !state.editAlias})} data-am-button="green thinner">As alias</button></td>
                <td className={q.hide(!state.editAlias)} colSpan="2">
                    <form onSubmit={this.onSubmitAlias} data-am-import-form>
                        <select className="smaller">
                            {state.store.import.teams.map( (t) => { return (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            )})}
                        </select>
                        <button data-am-button="green thinner">Save</button>
                    </form>
                </td>
            </tr>
        );
    }
});