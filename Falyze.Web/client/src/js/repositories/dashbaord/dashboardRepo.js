var Lean = require('../../lean.v2/lean');

module.exports = Lean.createRepository({
    alias: 'dashbaord',
    model: {
        country: Lean.observable(null),
        leagues: Lean.observable([]),
        seasons: Lean.observable([])
    }
});