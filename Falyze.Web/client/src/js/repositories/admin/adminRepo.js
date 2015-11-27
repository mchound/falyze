var Lean = require('../../lean.v2/lean');

module.exports = Lean.createRepository({
    alias: 'admin',
    model: {
        country: Lean.observable(null),
        league: Lean.observable(null),
        season: Lean.observable(null),
        team: Lean.observable(null),
        alias: Lean.observable(null)
    }//,
    //initialize: function () {
    //    this.subscribeTo(this.model.country, this.onSelectCountry);
    //},
    //onSelectCountry: function () {
    //    this.model.league.set(null);
    //    this.model.team.set(null);
    //    this.model.alias.set(null);
    //}
});