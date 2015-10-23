function dom(node) {
    this.node = node;
}

function domCollection(nodes){
    for (var i = 0; i < nodes.length; i++) {
        this[i] = new dom(nodes[i]);
    }
    this.length = nodes.length;
}

domCollection.prototype.do = function (action, params) {
    for (var i = 0; i < this.length; i++) {
        this[i][action].apply(this[i], params);
    }
}

dom.prototype.hide = function () {
    this.node.leanDisplay = this.node.style.display === 'none' ? undefined : this.node.style.display;
    this.node.style.display = 'none';
}

domCollection.prototype.hide = function () {
    this.do('hide');
}

dom.prototype.show = function () {
    if (this.node.style.display === 'none') {
        this.node.style.display = this.node.leanDisplay || 'block';
    }
}

domCollection.prototype.show = function () {
    this.do('show');
}

dom.prototype.visibility = function (visible) {
    if (!!visible) {
        this.show();
    }
    else {
        this.hide();
    }
}

domCollection.prototype.visibility = function (visible) {
    this.do('visibility', [visible]);
}

dom.prototype.addClass = function (className) {
    this.node.classList.add(className);
}

domCollection.prototype.addClass = function (className) {
    this.do('addClass', [className]);
}

dom.prototype.removeClass = function (className) {
    this.node.classList.remove(className);
}

domCollection.prototype.removeClass = function (className) {
    this.do('removeClass', [className]);
}

dom.prototype.attr = function (attr, value) {
    if (!!value) {
        this.node.setAttribute(attr, value);
    }
    else {
        return this.node.getAttribute(attr);
    }
}

domCollection.prototype.attr = function (attr, value) {
    this.do('attr', [attr, value]);
}

dom.prototype.style = function (rule, value) {
    if (value !== undefined) {
        this.node.style[rule] = value;
    }
    else {
        return this.node.style[rule];
    }
}

domCollection.prototype.style = function (rule, value) {
    this.do('style', [rule, value]);
}

dom.prototype.query = function (selector) {
    return new domCollection(this.node.querySelectorAll(selector));
}

module.exports = dom;