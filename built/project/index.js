//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define(["require","exports","module","pump","jquery","jquery-meta-data","./__jquery-pump/getter-setter"],function(e,t,n){var r=e("pump"),i=e("jquery"),s=e("jquery-meta-data"),o=n.exports=r.extend({initialize:function(t,n){n=n||{};var s=n.destination;_.defaults(n,this.metaDataOptions),_.defaults(n,{prefix:this.prefix}),r.prototype.initialize.call(this,t),_.each(s,function(e){var t=i(e),r=t.metaData(n),s=this.pipe(r);s.to(t)},this)},prefix:"pipe",metaDataOptions:{parse:function(t){return t.split(/\s*,\s*/g)}}});o.assignProto(e("./__jquery-pump/getter-setter")),i.prototype.pump=function(t,n){return n=n||{},n.destination=this,o(t,n)}});