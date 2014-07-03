//     jquery-pump
//     (c) simonfan
//     jquery-pump is licensed under the MIT terms.

define("__jquery-pump/parse",["require","exports","module","jquery"],function(t,e){function r(t){var e=t.split(s),r=e.shift();return{method:r,args:e}}function i(t){var e=t.match(a),i=r(e[3]);return{format:e[1],selector:e[2],method:i.method,args:i.args}}var s=(t("jquery"),/\s*:\s*/g);e.methodString=r;var a=/(?:(.+?)\s*\|)?(?:(.+?)\s*->)?\s*(.+)\s*/;e.destProp=i}),define("__jquery-pump/build-pipes",["require","exports","module","jquery","lodash","./parse"],function(t,e,r){function i(t,e,r){var i=this.generatePipeId(t);t.data(this.pipeIdDataAttribute,i);var s=this.pipe(i,e,r).to(t);return s}var s=t("jquery"),a=t("lodash"),u=t("./parse");r.exports=function(t,e){a.each(t,function(t){var r=s(t),o={},n=r.metaData(e);a.each(n,function(t,e){a.each(t,function(t){var s=u.destProp(t);if(s.selector){var a=r.find(s.selector),n={};n[e]=s,i.call(this,a,n)}else o[e]?o[e].push(s):o[e]=[s]},this)},this),i.call(this,r,o)},this)}}),define("__jquery-pump/getter-setter",["require","exports","module","jquery","lodash"],function(t,e){function r(t,e){var r=t[e];if(!r)throw new Error("[jquery-pump|destGet] "+e+" could not be found on formats hash.");return r}function i(t,e,r){var i=t[r]||e[r];if(!i)throw new Error("[jquery-pump|destSet] "+r+" could not be found.");return i}var s=(t("jquery"),t("lodash"));e.destGet=function(t,e){var s=i(t,this.methods,e.method),a=s.apply(t,e.args);if(e.format){var u=r(this.formats,e.format);return u.parse?u.parse.call(this,a,t):a}return a},e.destSet=function(t,e,a){if(e.format){var u=r(this.formats,e.format);a=u.stringify?u.stringify.call(this,a,t):a}var o=s.clone(e.args);o.push(a);var n=i(t,this.methods,e.method);return n.apply(t,o)}}),define("__jquery-pump/id",["require","exports","module"],function(t,e){e.generatePipeId=function(){return _.uniqueId(this.pipeIdDataAttribute)},e.pipeIdDataAttribute="jq-pipe-id"}),define("jquery-pump",["require","exports","module","pump","jquery","jquery-meta-data","lodash","./__jquery-pump/build-pipes","./__jquery-pump/getter-setter","./__jquery-pump/id"],function(t,e,r){var i=t("pump"),s=t("jquery"),a=(t("jquery-meta-data"),t("lodash")),u=t("./__jquery-pump/build-pipes"),o=["destGet","destSet","srcGet","srcSet"],n=r.exports=i.extend({initialize:function(t,e){e=e||{};var r=e.destination;a.defaults(e,this.metaDataOptions),a.defaults(e,{prefix:this.prefix}),a.each(o,function(t){this[t]&&(this[t]=a.bind(this[t],this))},this),this.formats=e.formats||this.formats,this.methods=e.methods||this.methods,i.prototype.initialize.call(this,t),u.call(this,r,e)},formats:{},methods:{},prefix:"pipe",metaDataOptions:{parse:function(t){return t.split(/\s*,\s*/g)}},drain:function(t,e,r){return t=t instanceof s?t.data(this.pipeIdDataAttribute):t,i.prototype.drain.call(this,t,e,r)}});n.assignProto(t("./__jquery-pump/getter-setter")).assignProto(t("./__jquery-pump/id")),s.prototype.pump=function(t,e){return e=e||{},e.destination=this,n(t,e)}});