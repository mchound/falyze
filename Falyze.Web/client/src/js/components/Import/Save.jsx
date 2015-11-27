var React = require('react'),
    Lean = require('../../lean/lean'),
    
    Actions = require('../../actions/Actions'),

    ImportStore = require('../../stores/import/ImportStore'),

    Ajax = require('../../lean/store/ajax');

function validateMatches(store) {
    var teams = store.get('teams'),
        aliases = store.get('aliases'),
        country = store.get('country'),
        league = store.get('leagueId'),
        startYear = store.get('startYear'),
        aliases = store.get('aliases'),
        rawMatches = store.get('matches'),
        matches = [],
        errors = [],
        lateDate = false,
        earlyDate = false;

    if(!country){
        errors.push('Select a country');
    }
    if(!league){
        errors.push('Select a league');
    }

    if(errors.length === 0){
        for (var i = 0; i < rawMatches.length; i++) {
            var m = rawMatches[i],
                homeTeam = teams.find((t) => m.homeTeam.toLowerCase() === t.name.toLowerCase()),
                homeTeamAlias = aliases.find((a) => m.homeTeam.toLowerCase() === a.alias.toLowerCase()),
                awayTeam = teams.find((t) => m.awayTeam.toLowerCase() === t.name.toLowerCase()),
                awayTeamAlias = aliases.find((a) => m.awayTeam.toLowerCase() === a.alias.toLowerCase()),
                homeTeam = !!homeTeam ? homeTeam : (!!homeTeamAlias ? teams.find((t) => t.id === homeTeamAlias.teamId) : null),
                awayTeam = !!awayTeam ? awayTeam : (!!awayTeamAlias ? teams.find((t) => t.id === awayTeamAlias.teamId) : null);

            // Set if a match is played late on the year
            if (m.date.getMonth() >= 10) {
                lateDate = true;
            }

            // Set if a match is played early on the year and latedate is already set
            if (!!lateDate && m.date.getMonth() <= 2 && !earlyDate && m.date.getFullYear() === startYear) {
                errors.push('Have you corrected the dates?');
                earlyDate = true;
            }

            // date error
            if (m.date.constructor !== Date) {
                errors.push('Wrong format for match at ' + i);
            }

            // Home team error
            if (!homeTeam || !homeTeam.id) {
                errors.push('Home team not specified for match at ' + (i + 1));
            }

            // Away team error
            if (!awayTeam || !awayTeam.id) {
                errors.push('Away team not specified for match at ' + (i + 1));
            }

            // Home goals error
            if (m.homeTeamGoals === null) {
                errors.push('Home team goals not specified for match at ' + (i + 1));
            }

            // Away goals error
            if (m.awayTeamGoals === null) {
                errors.push('Away team goals not specified for match at ' + (i + 1));
            }

            if (!league) {
                errors.push('League is not specified');
            }

            if (!homeTeam || !awayTeam) debugger;

            matches.push({
                homeTeamId: homeTeam.id,
                awayTeamId: awayTeam.id,
                homeTeamGoals: m.homeTeamGoals,
                awayTeamGoals: m.awayTeamGoals,
                date: m.date.getFullYear() + '-' + (m.date.getMonth() + 1) + '-' + m.date.getDate(),
                countryId: country.id,
                leagueId: league.id,
                startYear: startYear
            });
        }
    }

    return {
        matches: matches,
        errors: errors
    };

}

module.exports = Lean.createController({
    stores: [ImportStore],
    getInitialState: function(){
        return {
            errors: [],
            matches: []
        };
    },
    onValidate: function () {
        var result = validateMatches(this.store.import);
        this.setState({ errors: result.errors, matches: result.matches });
        if (result.errors.length === 0) {
            this.setState({ errors: [] });
            this.onSave(result.matches);
        }
    },
    onSave: function (matches) {
        var _matches = matches || { matches: this.state.matches };
        Actions.Import.setServerStatus.dispatch({status: 'Saving matches'});
        Ajax.post('/api/import/match', _matches,
            function () {
                Actions.Import.setServerStatus.dispatch({ notes: ['Matches saved'], status: ''});
            },
            function (xhr) {
                Actions.Import.setServerStatus.dispatch({errors: [JSON.parse(xhr.response).errorMessage], status: '' });
            }
        );
    },
    shouldRender: function(state, props){
        return state.store.import.matches.length > 0;
    },
    action: function () {
        return {

        }
    },
    view: function (model, state, props) {
        return (
            <div>
                <button data-am-button="green" className="mb" onClick={this.onValidate}>Save matches</button>
                <ul>
                    {state.errors.map((e, i) => {
                        return ( <li key={i}>{e}</li> )
                    })}
                </ul>
            </div>
        );
    }
});