//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module"],function(e,t,n){var r=/\s*:\s*/g,i=/(?:(.+?)\|)?(.+?)$/;n.exports=function(t){var n=t.match(i),s=n[2].split(r),o=s.shift();return{selector:n[1],method:o,args:s}}});