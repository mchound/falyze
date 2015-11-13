var React = require('react'),
    Lean = require('../../../lean/lean'),
    ImportStore = require('../../../stores/Import/ImportStore'),
    Actions = require('../../../actions/Actions'),
    Ajax = require('../../../lean/store/ajax');

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function () {

    },
    onRename: function(id){
        this.setState({ renameId: id });
        var node = this.refs[id].getDOMNode();
        setTimeout(function () {
            node.focus();
            node.select();
        }, 200);
    },
    onDelete: function(id){
        this.setState({ deleteId: id });
    },
    onSubmit: function (e) {
        e.preventDefault();
        var name = this.refs[this.state.renameId].getDOMNode().value;
        if (!name || name === '') {
            return;
        }
        Ajax.put('/api/import/team/rename/' + this.state.renameId + '/' + name, null,
            function (team) {
                Actions.Import.renameTeam.dispatch(team);
                this.setState({ renameId: null });
            }.bind(this),
            function (xhr) {
                console.log(xhr);
            }
        );
    },
    onConfirmDelete: function(){
        Ajax.remove('/api/import/team/' + this.state.deleteId,
            function (id) {
                Actions.Import.deleteTeam.dispatch(this.state.deleteId);
                this.setState({ deleteId: null });
            }.bind(this),
            function (xhr) {
                console.log(xhr.response);
            }
        );
    },
    shouldRender: function(state, props){
        return !!state.store.import.country;
    },
    action: function (state, props) {
        return {
            teams: state.store.import.teams
        };
    },
    view: function (model, state, props, q) {
        return (
            <div data-am-import-teams>
                <h2>Country teams</h2>
                <table className="teams">
                    <tbody>
                        {model.teams.map((t, i) => { return (
                            <tr key={t.id}>
                                <td>{i + 1}</td>
                                <td onClick={this.setStateShort.bind(this, {renameId: null})}>{t.name}</td>
                                <td className={q.hide(state.renameId === t.id || state.deleteId === t.id)}><button data-am-button="green thinner" onClick={this.onRename.bind(this, t.id)}>Rename</button></td>
                                <td className={q.hide(state.renameId === t.id || state.deleteId === t.id)}><button data-am-button="green thinner" onClick={this.onDelete.bind(this, t.id)}>Delete</button></td>
                                <td className={q.hide(state.renameId !== t.id)} colSpan="2">
                                    <form data-am-import-form onSubmit={this.onSubmit}>
                                        <input ref={t.id} defaultValue={t.name} />
                                    </form>
                                </td>
                                <td className={q.hide(state.deleteId !== t.id )} colSpan="2">
                                    <div className="btn-group">
                                        <button data-am-button="red thinner" onClick={this.onConfirmDelete}>Confirm</button>
                                        <button data-am-button="thinner" onClick={this.setStateShort.bind(this, {deleteId: null})}>Cancel</button>
                                    </div>
                                </td>
                            </tr>
                        );})}
                    </tbody>
                </table>
            </div>  
        );
    }
})