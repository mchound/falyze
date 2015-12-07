var Lean = require('../../lean.v2/lean');

module.exports = Lean.createRepository({
    alias: 'upload',
    model: {
        matches: Lean.observable([]),
        season: Lean.observable(null),
        valid: Lean.observable(false)
    }
});