//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module","jquery","./parse-method-string"],function(e,t,n){var r=e("jquery"),i=e("./parse-method-string");t.destGet=function(t,n){var r=i(n);return t[r.method].apply(t,r.args)},t.destSet=function(t,n,r){var s=i(n),o=s.selector,u=s.args;return u.push(r),t=o?t.find(o):t,t[s.method].apply(t,u)}});