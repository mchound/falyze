var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    messageRepo = require('../../../repositories/admin/messageRepo');

module.exports = Lean.createComponent({
    repositories: [messageRepo],
    onMsgClick: function(clickedMsg){
        var msgs = this.repo.msg.getModel();
        this.repo.msg.model.set(msgs.filter((m) => m.key !== clickedMsg.key));
    },
    shouldRender: function (state) {
        return state.repo.msg.length > 0;
    },
    controller: function(){

    },
    index: function (model, state, props, q) {
        return (
                        <ul className="messages">
                {state.repo.msg.map((m, i) => { return (
                    <li key={m.key} className={m.type} onClick={this.onMsgClick.bind(this, m)}>
                        {m.type === 'note' ? 'Message: ' : m.type === 'error' ? 'Error: ' : 'Updating: '}{m.text}
                    </li>
                )})}
            </ul>
        );
    }
})