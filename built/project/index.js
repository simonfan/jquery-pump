//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module","pump","jquery","jquery-meta-data"],function(e,t,n){function u(e){var t=e.split(o),n=t.shift();return{method:n,args:t}}var r=e("pump"),i=e("jquery"),s=e("jquery-meta-data"),o=/\s*:\s*/g,a=n.exports=r.extend({initialize:function(t,n){n=n||{};var s=n.destination;_.defaults(n,this.metaDataOptions),_.defaults(n,{prefix:this.prefix}),r.prototype.initialize.call(this,t),_.each(s,function(e){var t=i(e),r=t.metaData(n),s=this.pipe(r);s.to(t)},this)},prefix:"pipe",metaDataOptions:{parse:function(t){return t.split(/\s*,\s*/g)}},destGet:function(t,n){var r=u(n);return t[r.method].apply(t,r.args)},destSet:function(t,n,r){var i=u(n),s=i.args;return s.push(r),t[i.method].apply(t,s)}});i.prototype.pump=function(t,n){return n=n||{},n.destination=this,a(t,n)}});