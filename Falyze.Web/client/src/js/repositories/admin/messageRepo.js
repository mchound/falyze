var Lean = require('../../lean.v2/lean');

module.exports = Lean.createRepository({
    alias: 'msg',
    model: Lean.observable([])
});