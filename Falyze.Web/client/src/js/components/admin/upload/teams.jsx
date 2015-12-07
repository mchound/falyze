var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    _uniq = require('lodash/array/uniq'),

    UploadRepo = require('../../../repositories/admin/uploadRepo'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),
    TeamRepo = require('../../../repositories/admin/teamRepo'),
    AliasRepo = require('../../../repositories/admin/aliasRepo'),

    Team = require('./team.jsx');

function _getAllTeams(matches, teams, aliases) {
    if (!matches.length || !teams || !aliases) {
        return [];
    }
    var teamNames = _uniq(matches, (m) => m.homeTeam).map((m) => m.homeTeam),
        matched = [];

    return teamNames.map((tn) => {
        var alias = aliases.find((a) => a.alias.toLowerCase() === tn.toLowerCase());
        return {
            name: tn,
            team: teams.find((t) => t.name.toLowerCase() === tn.toLowerCase()),
            alias: alias,
            aliasFor: !!alias ? teams.find((t) => t.id === alias.teamId) : null
        };
    });
}

function teamSorter(a, b) {
    var orderA = (!a.team && !a.alias) ? 2 : (!!a.team ? 1 : 0),
        orderB = (!b.team && !b.alias) ? 2 : (!!b.team ? 1 : 0),
        order = orderB - orderA;
    if (order === 0) {
        return a.name.localeCompare(b.name);
    }
    return order;
}

module.exports = Lean.createComponent({
    repositories: [UploadRepo, AdminRepo, TeamRepo, AliasRepo],
    controller: function (state, props) {
        return {
            view: !state.repo.upload.matches.length || !state.repo.admin.country ? 'empty' : 'index',
            message: !state.repo.upload.matches.length ? 'No matches uploaded' : 'No country selected',
            teams: _getAllTeams(state.repo.upload.matches, state.repo.team, state.repo.alias).sort(teamSorter)
        };
    },
    empty: function (model, state, props, q) {
        return (<p>{model.message}</p>)
    },
    index: function (model, state, props, q) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>Status</th>
                    </tr>
                </thead>
                {model.teams.map(q.itemMapper(Team, null, {}))}
            </table>
        );
    }
});