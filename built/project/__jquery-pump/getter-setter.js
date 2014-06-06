//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module","jquery","lodash"],function(e,t,n){function s(e,t){var n=e[t];if(!n)throw new Error("[jquery-pump|destGet] "+t+" could not be found on formats hash.");return n}var r=e("jquery"),i=e("lodash");t.destGet=function(t,n){var r=t[n.method].apply(t,n.args);if(n.format){var i=s(this.formats,n.format);return i.parse?i.parse.call(this,r):r}return r},t.destSet=function(t,n,r){if(n.format){var o=s(this.formats,n.format);r=o.stringify?o.stringify.call(this,r):r}var u=i.clone(n.args);return u.push(r),t[n.method].apply(t,u)}});