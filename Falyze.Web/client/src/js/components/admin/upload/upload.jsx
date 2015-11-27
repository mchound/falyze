var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    MatchUtils = require('../utils/matchUtils');

module.exports = Lean.createComponent({
    getInitialState: function(){
        return {
            dragOver: false
        }
    },
    onDragOver: function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.setState({ dragOver: true });
    },
    onDragLeave: function(){
        this.setState({ dragOver: false });
    },
    onDrop: function (e) {
        e.stopPropagation()
        e.preventDefault();
        this.setState({ dragOver: false });
        var fr = new FileReader();
        fr.onload = function (e) {
            console.log(MatchUtils.parseFromXls(e.target.result));
        };
        fr.readAsBinaryString(e.dataTransfer.files[0]);
    },
    onWorkerDone: function(matches){
        console.log(matches);
    },
    controller: function (state, props) {
        return {
            dropZoneClass: state.dragOver ? 'drop-zone drag-over' : 'drop-zone'
        };
    },
    index: function (model, state, props, q) {
        return (
            <div data-am-upload>
                <div className={model.dropZoneClass} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
                    <p className="msg">Drop matches here</p>
                </div>
            </div>  
        );
    }
});