var React = require('react'),
    Lean = require('../../lean/lean'),
    ImportStore = require('../../stores/import/ImportStore'),
    Ajax = require('../../lean/store/ajax'),
    Actions = require('../../actions/Actions').Import;

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function(){
        return {
            editing: false,
            league: null,
            level: null,
            pending: false,
            msg: '',
            leagueId: null,
            leagues: []
        };
    },
    onSubmit: function (e) {
        var leagueName = this.refs.league.getDOMNode().value,
            level = this.refs.level.getDOMNode().value;

        if (!!leagueName && !!level) {
            this.setState({ league: leagueName, level: level, pending: true, leagueId: null });
            Ajax.post('/api/import/league/' + this.state.store.import.country.id + '/' + leagueName + '/' + level, null,
                function (league) {
                    Actions.addLeague.dispatch(league);
                    this.setState({ msg: '', pending: false, league: null, level: null, editing: false, league: null, level: null, leagueId: league.id });
                }.bind(this),
                function (xhr) {
                    var msg = JSON.parse(xhr.responseText).errorMessage;
                    this.setState({ pending: false, msg: msg });
                }.bind(this)
            );
        }
        else {
            this.setState({ league: leagueName, level: level, leagueId: null });
        }

        e.preventDefault();
    },
    onAddClick: function(){
        this.setState({ editing: true });
        var node = this.refs.league.getDOMNode();
        setTimeout(function () { node.focus(); }, 150);
    },
    onLeageChange: function (e) {
        this.setState({ leagueId: e.target.value });
    },
    shouldRender: function(state){
        return !!state.store.import.country;
    },
    isLoading: function(state, props){
        return !!state.store.import.fetchingLeagues;
    },
    action: function (state, props) {
        return {
            leagueNameValid: state.league === null || state.league !== '',
            levelValid: state.level === null || !isNaN(parseInt(state.level)),
            msg: state.msg,
            leagues: state.store.import.leagues.sort((a,b) => a.level - b.level)
        }
    },
    renderLoad: function () {
        return (
            <p>Getting leagues from server, please wait...</p>  
        );
    },
    view: function (model, state, props) {
        return (
            <div data-am-import-league>
                <div data-am-import-form className={state.editing ? 'hidden' : null}>
                    <div className="group mb">
                        <label>League</label>
                        <select value={state.leagueId} ref="selected" onChange={this.onLeageChange}>
                            {model.leagues.map((l) => { return (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            )})}
                        </select>
                    </div>
                    <button data-am-button="link" onClick={this.onAddClick} >Add new</button>
                </div>

                <form onSubmit={this.onSubmit} data-am-import-form className={state.editing ? null : 'hidden'}>
                    <div className="group mb">
                        <label>Name</label>
                        <input type="text" ref="league" className={model.leagueNameValid ? 'mb' : 'mb error'} />
                        <label>Level</label>
                        <input type="text" ref="level" className={model.levelValid ? 'mb' : 'mb error'} />
                        <button data-am-button="green" className="clear stretch-h" type="submit">Save</button>
                        <i className={model.iconClass}></i>
                    </div>
                    <p>{model.msg}</p>
                </form>
            </div>
        );
    }
});