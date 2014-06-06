//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module","jquery","lodash"],function(e,t,n){var r=e("jquery"),i=e("lodash");t.destGet=function(t,n){var r=t[n.method].apply(t,n.args);return n.format?this.formats[n.format].parse.call(this,r):r},t.destSet=function(t,n,r){r=n.format?this.formats[n.format].stringify.call(this,r):r;var s=i.clone(n.args);return s.push(r),t[n.method].apply(t,s)}});