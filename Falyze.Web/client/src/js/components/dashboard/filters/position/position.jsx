var React = require('react'),
    Lean = require('../../../../lean.v2/lean'),

    DashboardRepo = require('../../../../repositories/dashbaord/dashboardRepo');

module.exports = Lean.createComponent({
    displayName: 'PositionFilter',
    controller: function (state, props) {
        return {
            
        }
    },
    index: function (model, state, props, q) {
        return (
            <li data-am-filter="position">
                <div className="row">
                    <div className="col-sm-12">
                        <div data-am-card="light">
                            <header className="header">Position</header>
                            <section className="body">

                            </section>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div data-am-card="light">
                            <header className="header">Position</header>
                            <section className="body"></section>
                        </div>
                    </div>
                </div>
            </li>
        );
}
});