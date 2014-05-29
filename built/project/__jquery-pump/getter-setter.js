//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module","jquery","./parse"],function(e,t,n){var r=e("jquery"),i=e("./parse");t.destGet=function(t,n){var r=i.methodString(n),s=r.args;return t[r.method].apply(t,r.args)},t.destSet=function(t,n,r){var s=i.methodString(n),o=s.args;return o.push(r),t[s.method].apply(t,o)}});