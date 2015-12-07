var React = require('react'),
    Lean = require('../../../lean.v2/lean'),
    
    _uniq = require('lodash/array/uniq'),
    
    Select = require('../../common/Select/Select.jsx'),

    MatchUtils = require('../utils/matchUtils'),

    Ajax = require('../../../utils/ajax'),

    TeamRepo = require('../../../repositories/admin/teamRepo'),
    AliasRepo = require('../../../repositories/admin/aliasRepo'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    SeasonRepo = require('../../../repositories/admin/seasonRepo'),
    UploadRepo = require('../../../repositories/admin/uploadRepo');

module.exports = Lean.createComponent({
    repositories: [AdminRepo, UploadRepo, TeamRepo, AliasRepo],
    onChangeSeason: function (selected) {
        if (!selected.length || this.state.repo.upload.season === selected[0].value) {
            UploadRepo.model.season.set(null);
        }
        UploadRepo.model.season.set(selected[0].value);
    },
    onSaveClick: function () {
        var countryId = this.state.repo.admin.country.id,
            leagueId = this.state.repo.admin.league.id,
            season = SeasonRepo.getModel().find((s) => s.startYear === this.state.repo.upload.season);
        var matches = this.state.repo.upload.matches.filter((m) => m.startYear === season.startYear).map((m) => ({
            date: m.date.substring(0, 10),
            homeTeamId: MatchUtils.findTeam(m.homeTeam, this.state.repo.team, this.state.repo.alias).id,
            awayTeamId: MatchUtils.findTeam(m.awayTeam, this.state.repo.team, this.state.repo.alias).id,
            homeGoals: m.result.split('-')[0].trim(),
            awayGoals: m.result.split('-')[1].trim()
        }));
        Ajax.post('api/admin/match/' + countryId + '/' + leagueId + '/' + season.id, matches,
            function (resp) {
                console.log(resp);
            },
            function (xhr) {
                console.log(xhr);
            });
    },
    controller: function (state, props) {
        var matches = state.repo.upload.matches;
        return {
            view: !!state.repo.upload.matches.length ? 'index' : 'empty',
            matches: matches,
            seasons: _uniq(matches, (m) => m.startYear).map((m) => ({ value: m.startYear, text: m.startYear, sortBy: -m.startYear, selected: state.repo.upload.season === m.startYear })),
            filteredMatches: !matches.length || !state.repo.upload.season ? [] : matches.filter((m) => m.startYear === state.repo.upload.season),
            saveButtonAttr: !!MatchUtils.validate(state.repo.admin.country, state.repo.admin.league, matches, state.repo.upload.season, TeamRepo.getModel(), AliasRepo.getModel()).length ? 'disabled' : 'green'
        };
    },
    empty: function(){
        return (<p>No matches uploaded...</p>);
    },
    index: function (model, state, props, q) {
        return (
            <div data-am-uploadmatches>
                <div className="header clearfix">
                    <div className="left">
                        <Select defaultText="Filter on season" items={model.seasons} onChange={this.onChangeSeason} />
                    </div>
                    <div className="left">
                        <button data-am-button={model.saveButtonAttr} className="ml" onClick={this.onSaveClick}>Save</button>
                    </div>
                    <p className="right">{model.matches.length + ' matches uploaded'}</p>
                </div>
                <div className={q.hide(!model.filteredMatches.length, null, 'matches')}>
                    <table className="matches">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Home Team</th>
                                <th>Result</th>
                                <th>Away Team</th>
                            </tr>
                        </thead>
                        <tbody>
                            {model.filteredMatches.map((m, i) => { return (
                                <tr key={i}>
                                    <td>{m.date.substring(0, 10)}</td>
                                    <td className="home-team">{m.homeTeam}</td>
                                    <td className="result">{m.result}</td>
                                    <td className="away-team">{m.awayTeam}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});