var CountryRepo = require('../repositories/dashbaord/countryRepo'),
    SeasonRepo = require('../repositories/dashbaord/seasonRepo'),
    LeagueRepo = require('../repositories/dashbaord/leagueRepo'),

    Lean = require('../lean.v2/lean');

var cbCount = 2;

var repoCallback = function () {
    cbCount--;
    if (cbCount === 0) {
        document.querySelector('[data-am-splash]').remove();
    }
}


module.exports = {
    apply: function () {
        CountryRepo.observe(repoCallback);
        LeagueRepo.observe(repoCallback);

        Lean.inject({
            'preselection': require('../components/dashboard/preselection/preselection.jsx')
        });
    }
}
