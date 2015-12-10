var React = require('react'),

    CountryRepo = require('../repositories/dashbaord/countryRepo'),
    SeasonRepo = require('../repositories/dashbaord/seasonRepo'),
    LeagueRepo = require('../repositories/dashbaord/leagueRepo'),
    TeamRepo = require('../repositories/dashbaord/teamRepo'),
    DashboardRepo = require('../repositories/dashbaord/dashboardRepo'),
    
    Actions = require('../actions/actions').dashboard,

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

        CountryRepo.server.get();
        LeagueRepo.server.get();

        Lean.inject({
            'preselection': require('../components/dashboard/preselection/preselection.jsx')
        });

        Actions.preselection.on(this.onPreselection)
    },
    onPreselection: function () {
        Lean.destroy('preselection', 'fadeOut', function () {
            document.querySelector('#test').classList.remove('hidden');
            Lean.inject({
                'matchcount': require('../components/dashboard/matchcount/matchcount.jsx')
            });
        });
    }
}
