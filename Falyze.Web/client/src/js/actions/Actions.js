var Lean = require('../lean/lean');

module.exports = {
    Prerequisites: Lean.createAction(['changeCountry', 'changeLeague', 'changeSeason', 'confirm']),
    Filter: Lean.createAction(['update', 'updateTeam', 'updateManyTeam']),
    TeamStat: Lean.createAction(['update']),
    Import: Lean.createAction(['setCountry', 'addLeague', 'setLeague', 'addMatches', 'setStartYear', 'addTeam', 'renameTeam', 'deleteTeam'])
};