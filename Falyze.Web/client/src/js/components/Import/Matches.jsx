var React = require('react'),
    Lean = require('../../lean/lean'),
    
    ImportStore = require('../../stores/import/ImportStore'),

    Actions = require('../../actions/Actions');

function formatDate(digit) {
    return ('00' + digit).slice(-2);
}

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function () {
        return {
            showMatches: true
        };
    },
    onMatchClick: function (index) {
        var matches = this.state.store.import.matches,
            startYear = this.state.store.import.startYear;
        for (var i = 0; i < matches.length; i++) {
            if (i >= index) {
                matches[i].date.setFullYear(startYear + 1);
            }
            else {
                matches[i].date.setFullYear(startYear);
            }
        }
        Actions.Import.addMatches.dispatch(matches);
    },
    onResultClick: function (index) {
        var match = this.state.store.import.matches[index];

        if (!match.incomplete) {
            return;
        }

        match.editResult = true;
        Actions.Import.addMatches.dispatch(this.state.store.import.matches);
    },
    onResultEdit: function (index) {
        var result = this.refs.editResult.getDOMNode().value,
            test = (/\d+\-\d+/g).test(result),
            match = this.state.store.import.matches[index];
        if (test) {
            match.homeTeamGoals = parseInt(result.split('-')[0]);
            match.awayTeamGoals = parseInt(result.split('-')[1]);
            match.incomplete = false;
        }

        match.editResult = undefined;
        Actions.Import.addMatches.dispatch(this.state.store.import.matches);
    },
    shouldRender: function(state){
        return state.store.import.matches.length > 0;
    },
    action: function (state, props) {
        return {
            btnToggleTableText: state.showMatches ? 'Hide matches' : 'Show matches',
            matches: state.store.import.matches
        }
    },
    view: function (model, state, props, q) {

        var matches = null;

        if (!!model.matches.length) {
            matches = model.matches.map((m, i) => {
                var result = null;
                if (!!m.editResult) {
                    result = (<input ref="editResult" onBlur={this.onResultEdit.bind(this, i)} />)
                }
                else {
                    result = m.homeTeamGoals + ' - ' + m.awayTeamGoals;
                }

                return (
                    <tr key={m.date + m.homeTeam}>
                        <td>{i + 1}</td>
                        <td className="date" onClick={this.onMatchClick.bind(this, i)}>{m.date.getFullYear() + '-' + formatDate(m.date.getMonth() + 1) + '-' + formatDate(m.date.getDate())}</td>
                        <td className="home-team">{m.homeTeam}</td>
                        <td className="result" onClick={this.onResultClick.bind(this, i)}>{result}</td>
                        <td className="away-team">{m.awayTeam}</td>
                        <td className="note">{!!m.incomplete || !!m.note ? m.note : null}</td>
                    </tr>
                );
            });
        }

        return (
            <div data-am-import-matches>
                <button data-am-button="green" onClick={this.setStateShort.bind(this, {showMatches: !state.showMatches})}>{model.btnToggleTableText}</button>
                <table className={state.showMatches ? 'matches' : 'hidden'}>
                    <tbody>
                        {matches}
                    </tbody>
                </table>
            </div>
        );
    }
});