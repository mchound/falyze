var React = require('react'),
    Lean = require('../../../lean/lean'),
    
    Actions = require('../../../actions/Actions'),

    ImportStore = require('../../../stores/Import/ImportStore'),

    Ajax = require('../../../lean/store/ajax');

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function () {
        return {
            msg: null,
            teamName: null
        };
    },
    onSubmit: function(e){
        e.preventDefault();
        var teamName = this.refs.teamName.getDOMNode().value;
        Ajax.post('/api/import/team/' + teamName + '/' + this.state.store.import.country.id, null,
            function (team) {
                Actions.Import.addTeam.dispatch(team);
                this.setState({ teamName: null, msg: teamName + ' added' });
            }.bind(this),
            function (xhr) {
                if (xhr.status !== 404) {
                    this.setState({ msg: JSON.parse(xhr.responseText).errorMessage });
                }
                else {
                    this.setState({ msg: 'Server seems to disappeared...' });
                }
            }.bind(this)
        );
    },
    onTeamNameChange: function(e){
        this.setState({ teamName: e.target.value });
    },
    shouldRender: function(state, props){
        return !!state.store.import.country;
    },
    view: function (model, state, props) {
        return (
            <form data-am-import-form onSubmit={this.onSubmit}>
                <div className="group mb">
                    <label>Create team</label>
                    <input ref="teamName" className="okable" value={state.teamName} onChange={this.onTeamNameChange} />
                    <button data-am-button="green">Save</button>
                </div>
                <p>{state.msg}</p>
            </form>
        );
    }
})