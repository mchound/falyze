var Lean = require('../lean/lean');

module.exports = {
    Prerequisites: Lean.createAction(['changeCountry', 'changeLeague', 'changeSeason', 'confirm']),
    Filter: Lean.createAction(['update', 'updateTeam']),
    TeamStat: Lean.createAction(['update'])
};