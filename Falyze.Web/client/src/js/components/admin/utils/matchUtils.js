var _uniq = require('lodash/array/uniq');

function _getStartYear(season) {
    var year = season.split('-')[0];
    if (year.length === 2) {
        var iYear = parseInt(year);
        return iYear > 80 ? 1900 + iYear : 2000 + iYear;
    }
    return parseInt(year);
}

module.exports = {
    parseFromXls: function (data) {
        var removes = ['res', 'ht res', 'Avg H Odds', 'Max H Odds', 'Avg D Odds', 'Max D Odds', 'Avg A Odds', 'Max A Odds', 'Avg ov25', 'Max ov25', 'Avg un25', 'Max un25'];
        var node = document.createElement('div');
        var start = (/<table/g).exec(data).index;
        var end = (/<\/table/g).exec(data).index + 8;
        var source = data.substring(start, end);
        node.innerHTML = source;

        for (var i = 0; i < removes.length; i++) {
            var r = removes[i].toLowerCase();
            var ths = node.querySelectorAll('th');
            var index;
            var q;
            for (q = 0; q < ths.length; q++) {
                if (ths[q].innerText.toLowerCase() === r) {
                    index = q;
                    break;
                }
            }
            ths[q].remove();
            var cols = node.querySelectorAll('tr td:nth-child(' + (q + 1) + ')');
            for (var c = 0; c < cols.length; c++) {
                cols[c].remove();
            }
        }

        var trs = node.querySelectorAll('tr');
        var matches = [];
        for (var r = 1; r < trs.length; r++) {
            matches.push({
                date: trs[r].childNodes[0].innerText,
                league: trs[r].childNodes[1].innerText,
                homeTeam: trs[r].childNodes[2].innerText,
                awayTeam: trs[r].childNodes[3].innerText,
                result: trs[r].childNodes[4].innerText,
                htResult: trs[r].childNodes[5].innerText,
                hTimes: trs[r].childNodes[6].innerText,
                aTimes: trs[r].childNodes[7].innerText,
                startYear: _getStartYear(trs[r].childNodes[8].innerText),
            });
        }

        return matches;
    },
    validate: function (country, league, allMatches, season, teams, aliases) {
        if (!country) {
            return ['No country selected'];
        }
        else if (!league) {
            return ['No league selected']
        }
        else if (!season) {
            return ['No season selected'];
        }
        else if (!allMatches || allMatches.length === 0) {
            return ['No matches to validate'];
        }
        var matches = allMatches.filter((m) => m.startYear === season),
            teamNames = _uniq(matches, (m) => m.homeTeam.toLowerCase()).map((m) => m.homeTeam.toLowerCase()),
            teamMatches = {},
            validationResults = [];

        if (matches.length % 2 !== 0) {
            validationResults.push('Odd number of matches');
        }

        for (var i = 0; i < teamNames.length; i++) {
            teamMatches[teamNames[i]] = {};
            var teamMatches = matches.filter((m) => m.homeTeam.toLowerCase() === teamNames[i] || m.awayTeam.toLowerCase() === teamNames[i]),
                team = teams.find((t) => teamNames[i] === t.name.toLowerCase()),
                alias = aliases.find((a) => a.alias.toLowerCase() === teamNames[i]);
            if (teamMatches.length !== teamNames.length * 2 - 2) {
                validationResults.push('Wrong number of matches for team ' + teamNames[i]);
            }
            if (!team && !alias) {
                validationResults.push('No team for team name: ' + teamNames[i]);
            }

        }
        return validationResults;
    },
    findTeam: function (teamName, teams, aliases) {
        var team = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase()),
            alias = aliases.find((a) => a.alias.toLowerCase() === teamName.toLowerCase());
        if (!!team) {
            return team;
        }
        else if (!!alias) {
            return teams.find((t) => t.id === alias.teamId);
        }
    }
}