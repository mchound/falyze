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

function test() {
    SeasonRepo.server.get('/byLeagues/?leagues=44550cd9-0b96-4a7e-95d6-42a98f9a2348;775dc610-b69f-4cfb-af5a-a59a1fb2387a');
    Actions.preselection.dispatch({
        country: {
            id: "72f3c19b-48ba-49a4-9699-49f114d226d8",
            name: "Sweden"
        },
        leagues: [
            { countryId: "72f3c19b-48ba-49a4-9699-49f114d226d8", id: "44550cd9-0b96-4a7e-95d6-42a98f9a2348", level: 1, name: "Allsvenskan" },
            { countryId: "72f3c19b-48ba-49a4-9699-49f114d226d8", id: "775dc610-b69f-4cfb-af5a-a59a1fb2387a", level: 2, name: "Superettan" }
        ],
        seasons: [
            { id: "b9a89fe4-9efa-4d54-8d0c-2654ed5d6148", name: "Season 2015/2016", startYear: 2015 },
            { id: "b5368be4-d9fe-4050-8ae6-d7d546ba3962", name: "Season 2014/2015", startYear: 2014 },
            { id: "af7acb51-e1c7-471f-9d03-fb4265f9f28b", name: "Season 2013/2014", startYear: 2013 },
            { id: "5a3143f8-5ea1-48ef-8a8f-d6271d5f5f72", name: "Season 2012/2013", startYear: 2012 },
            { id: "b043b138-4ef7-40b4-af44-094f491242be", name: "Season 2011/2012", startYear: 2011 },
        ]
    });
}

module.exports = {
    apply: function () {
        CountryRepo.observe(repoCallback);
        LeagueRepo.observe(repoCallback);

        CountryRepo.server.get();
        LeagueRepo.server.get();

        Lean.inject({
            'preselection-slider': require('../components/dashboard/preselection/preselection.jsx')
        });

        Actions.preselection.on(this.onPreselection);

        test();
    },
    onPreselection: function () {
        Lean.destroy('preselection-slider', 'fadeOut', function () {
            document.querySelector('#work-panel').classList.remove('hidden');
            Lean.inject({
                'matchcount': require('../components/dashboard/matchcount/matchcount.jsx'),
                'preselection-static': require('../components/dashboard/preselection/preselection.jsx'),
                'filter-selector': require('../components/dashboard/filterselector/filterselector.jsx'),
                'filter-list': require('../components/dashboard/filters/filterlist.jsx'),
                'filter-result': require('../components/dashboard/filterresult/filterresult.jsx'),
            });
        });
    }
}
