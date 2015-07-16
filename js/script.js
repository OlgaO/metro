!function t(e,r,n){function a(i,s){if(!r[i]){if(!e[i]){var u="function"==typeof require&&require;if(!s&&u)return u(i,!0);if(o)return o(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var c=r[i]={exports:{}};e[i][0].call(c.exports,function(t){var r=e[i][1][t];return a(r?r:t)},c,c.exports,t,e,r,n)}return r[i].exports}for(var o="function"==typeof require&&require,i=0;i<n.length;i++)a(n[i]);return a}({1:[function(t,e,r){"use strict";var n=function(){function t(t,e,r){var n=L.control.UniForm(e,r||null,{collapsed:!1,position:"topright"});n.addTo(t.getMap()),n.renderUniformControl()}return t}();r.LayerControl=n;var a=function(){function t(t){var e=t.getOverlay(),r=t.getMap(),n=new L.Polyline([],{color:"red"});n.addTo(r);var a=new L.CircleMarker([60,30]);e.addEventListener("click",function(t){if(t.shiftKey){var e=r.containerPointToLatLng(new L.Point(t.x,t.y));n.addLatLng(e).redraw(),a.on("mouseout",function(t){return a.closePopup()}),a.addTo(r);var o=n.getLatLngs();if(o.length>1){for(var i=0,s=1;s<o.length;++s)i+=o[s-1].distanceTo(o[s]);L.popup().setLatLng(e).setContent("Popup").openOn(r)}}})}return t}();r.Measurement=a},{}],2:[function(t,e,r){"use strict";{var n=t("./metro-map"),a=function(){return new L.TileLayer("https://{s}.tiles.mapbox.com/v3/inker.mlo91c41/{z}/{x}/{y}.png",{minZoom:9,id:"inker.mlo91c41",reuseTiles:!0,bounds:null,attribution:'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>'})}(),o=function(){return new L.TileLayer("http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}",{minZoom:9,reuseTiles:!0,attribution:'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'})}();new n("map-container","json/graph.json",{Mapbox:a,OpenMapSurfer:o})}!function(){var t=["Plan metro Sankt-Peterburga","Pietarin metron hankesuunnitelma","St Petersburg metro plan proposal"],e=0;setInterval(function(){return document.title=t[++e%t.length]},3e3)}(),console.log("user: "+navigator.userLanguage),console.log("language: "+navigator.language),console.log("browser: "+navigator.browserLanguage),console.log("system: "+navigator.systemLanguage)},{"./metro-map":3}],3:[function(t,e,r){"use strict";var n=window.L,a=t("./svg"),o=t("./util"),i=t("./addons"),s=function(){function t(t,e,r){var a=this,o=this.fetch(e),s=this.fetch("json/hints.json");this.map=new n.Map(t,{inertia:!1}).addLayer(r.Mapbox||r[Object.keys(r).toString()]).setView(new n.LatLng(60,30),11).addControl(new n.Control.Scale({imperial:!1})),new i.LayerControl(this,r),console.log("map should be created by now"),this.addOverlay(),this.addListeners(),o.then(function(t){return a.handleJSON(t)}).then(function(){return s}).then(function(t){return a.appendHintsToGraph(t)}).then(function(){return a.redrawNetwork()})["catch"](function(t){return alert(t)})}return t.prototype.getMap=function(){return this.map},t.prototype.getOverlay=function(){return this.overlay},t.prototype.addOverlay=function(){this.overlay=document.getElementById("overlay"),this.overlay.id="overlay",this.overlay.style.fill="white",this.overlay.style.zIndex="10"},t.prototype.addListeners=function(){var t=this,e=this.map.getPanes().mapPane;this.map.on("movestart",function(e){return t.map.touchZoom.disable()}),this.map.on("move",function(r){return t.overlay.style.transform=e.style.transform}),this.map.on("moveend",function(r){t.map.touchZoom.enable();var n=o.parseTransform(e.style.transform);t.overlay.style.transform=e.style.transform="translate("+n.x+"px, "+n.y+"px)"}),this.map.on("zoomstart",function(e){t.map.dragging.disable(),t.overlay.style.opacity="0.5"}),this.map.on("zoomend",function(e){t.redrawNetwork(),t.overlay.style.opacity=null,t.map.dragging.enable()})},t.prototype.fetch=function(t){return new Promise(function(e,r){var n=new XMLHttpRequest;n.onreadystatechange=function(){4===n.readyState&&(200===n.status?e(n.responseText):r("couldn't fetch "+t+": "+n.status+": "+n.statusText))},n.open("GET",t,!0),n.setRequestHeader("X-Requested-With","XMLHttpRequest"),n.send()})},t.prototype.handleJSON=function(t){this.graph=JSON.parse(t),this.extendBounds(),this.map.setView(this.bounds.getCenter(),11,{pan:{animate:!1},zoom:{animate:!1}})},t.prototype.appendHintsToGraph=function(t){this.graph.hints=JSON.parse(t),console.log(this.graph.hints)},t.prototype.refillSVG=function(){for(var t=void 0;t=this.overlay.firstChild;)this.overlay.removeChild(t);var e=a.createSVGElement("defs");e.id="defs",e.appendChild(a.makeDropShadow()),this.overlay.appendChild(e);var r=a.createSVGElement("g");r.id="origin",["paths","transfers","station-circles","dummy-circles"].forEach(function(t){var e=a.createSVGElement("g");e.id=t,r.appendChild(e)}),this.overlay.appendChild(r);var n=document.getElementById("transfers");n.classList.add("transfer");var o=document.getElementById("station-circles");o.classList.add("station-circle")},t.prototype.extendBounds=function(){var t=this,e=this.graph.platforms[0].location;this.bounds=new n.LatLngBounds(e,e),this.graph.platforms.forEach(function(e){return t.bounds.extend(e.location)})},t.prototype.showPlate=function(t){var e=t.target,r=o.getSVGDataset(e),n=document.getElementById(r.platformId||r.stationId),i=a.makePlate(n),s=e.parentNode,u=s.parentNode;e.onmouseout=function(t){return u.removeChild(i)},u.insertBefore(i,s)},t.prototype.posOnSVG=function(t,e){var r=this.map.latLngToContainerPoint(e);return r.subtract(t.min)},t.prototype.updatePos=function(){var t=this.bounds.getNorthWest(),e=this.bounds.getSouthEast(),r=new n.Bounds(this.map.latLngToContainerPoint(t),this.map.latLngToContainerPoint(e)),a=o.parseTransform(this.overlay.style.transform),i=r.getSize(),s=r.min.subtract(a).subtract(i);this.overlay.style.left=s.x+"px",this.overlay.style.top=s.y+"px";var u=i,l=document.getElementById("origin");l.style.transform="translate("+u.x+"px, "+u.y+"px)";var c=i.multiplyBy(3);this.overlay.style.width=c.x+"px",this.overlay.style.height=c.y+"px"},t.prototype.redrawNetwork=function(){var t=this,e=this;this.refillSVG(),this.updatePos();for(var r={"station-circles":document.createDocumentFragment(),"dummy-circles":document.createDocumentFragment(),transfers:document.createDocumentFragment(),paths:document.createDocumentFragment()},i=new Array(this.graph.platforms.length),s=this.map.getZoom(),u=this.bounds.getNorthWest(),l=this.bounds.getSouthEast(),c=new n.Bounds(this.map.latLngToContainerPoint(u),this.map.latLngToContainerPoint(l)),p=12>s?function(t){return e.posOnSVG(c,e.graph.stations[t.station].location)}:function(t){return e.posOnSVG(c,t.location)},d=this.graph.platforms.map(p),h=.5*(s-7),g=12>s?1.25*h:h,f=.4*g,m=h,y=new Set,v=function(n){var u=t.graph.stations[n],l=o.findCircle(t.graph,u),c=[];if(u.platforms.forEach(function(t){var o=e.graph.platforms[t],u=d[t];if(s>9){var p=a.makeCircle(u,g);a.convertToStation(p,"p-"+t,o,f),p.setAttribute("data-station",n.toString());var h=a.makeCircle(u,2*g);h.classList.add("invisible-circle"),h.setAttribute("data-platformId",p.id),r["station-circles"].appendChild(p),r["dummy-circles"].appendChild(h),h.onmouseover=e.showPlate}if(2===o.spans.length)!function(){var r=[u,u],n=[0,0],a=e.graph.spans[o.spans[0]];a.source===t&&o.spans.reverse();for(var s=0;2>s;++s){var l=e.graph.spans[o.spans[s]],c=l.source===t?l.target:l.source,p=(e.graph.platforms[c],d[c]);n[s]=u.distanceTo(p),r[s]=u.add(p).divideBy(2)}var h=r[1].subtract(r[0]).multiplyBy(n[0]/(n[0]+n[1])),g=r[0].add(h),f=u.subtract(g);i[t]=r.map(function(t){return t.add(f)})}();else if(3===o.spans.length){for(var m=[],v=[],b=0;3>b;++b){var S=e.graph.spans[o.spans[b]];if(S.source===t){var x=(e.graph.platforms[S.target],d[S.target]);m.push(x)}else{var x=(e.graph.platforms[S.source],d[S.source]);v.push(x)}}var w=1===v.length?v[0]:v[0].add(v[1]).divideBy(2),L=1===m.length?m[0]:m[0].add(m[1]).divideBy(2),C=u.distanceTo(w),A=u.distanceTo(L),E=u.add(w).divideBy(2),G=u.add(L).divideBy(2),T=G.subtract(E).multiplyBy(C/(C+A)),P=E.add(T),B=u.subtract(P);i[t]=[E.add(B),G.add(B)]}else i[t]=[u,u];l&&l.indexOf(o)>-1&&(c.push(u),y.add(t))}),l){var p=o.getCircumcenter(c),h=p.distanceTo(c[0]),v=a.makeRingWithBorders(p,h,m,f);r.transfers.appendChild(v)}},b=0;b<this.graph.stations.length;++b)v(b);this.graph.transfers.forEach(function(t){if(!y.has(t.source)||!y.has(t.target)){var n=e.graph.platforms[t.source],o=e.graph.platforms[t.target],i=e.posOnSVG(c,n.location),s=e.posOnSVG(c,o.location),u=a.createSVGElement("line");u.setAttribute("x1",i.x.toString()),u.setAttribute("y1",i.y.toString()),u.setAttribute("x2",s.x.toString()),u.setAttribute("y2",s.y.toString()),u.classList.add("transfer"),u.style.strokeWidth=m.toString(),u.style.opacity="0.25",r.transfers.appendChild(u)}});for(var S=0;S<this.graph.spans.length;++S){var x=this.graph.spans[S],w=x.source,L=x.target,C=(this.graph.platforms[w],this.graph.platforms[L],a.makeCubicBezier([d[w],i[w][1],i[L][0],d[L]])),A=x.routes.map(function(t){return e.graph.routes[t]}),E=A[0].line.match(/[MEL](\d{1,2})/);C.style.strokeWidth=h.toString(),E&&C.classList.add(E[0]),C.classList.add(A[0].line.charAt(0)+"-line"),r.paths.appendChild(C)}Object.keys(r).forEach(function(t){return document.getElementById(t).appendChild(r[t])})},t}();e.exports=s},{"./addons":1,"./svg":4,"./util":5}],4:[function(t,e,r){"use strict";function n(t,e){var r=s("circle");return r.setAttribute("r",e.toString()),r.setAttribute("cy",t.y.toString()),r.setAttribute("cx",t.x.toString()),r}function a(t,e,r,n){t.id=e,t.style.strokeWidth=n+"px",h.setSVGDataset(t,{lat:r.location.lat,lng:r.location.lng,ru:r.name,fi:r.altName})}function o(t){if(4!==t.length)throw new Error("there should be 4 points");var e=s("path"),r=t.map(function(t){return t.x+","+t.y});return r.unshift("M"),r.splice(2,0,"C"),e.setAttribute("d",r.join(" ")),e}function i(t,e,r,a){var o=s("g");o.classList.add("transfer");var i=.5*r;return[e,e-i,e+i].forEach(function(i){var s=n(t,i);s.style.strokeWidth=(i===e?r:a)+"px",o.appendChild(s)}),o}function s(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function u(){var t=s("filter");return t.id="shadow",t.setAttribute("width","200%"),t.setAttribute("height","200%"),t.innerHTML='\n        <feOffset result="offOut" in="SourceAlpha" dx="0" dy="2" />\n        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />\n        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />\n    ',t}function l(t,e){var r=d.createSVGElement("rect"),n=12,a=e.reduce(function(t,e){return t.length<e.length?e:t}),o=new p.Point(10+6*a.length,6+n*e.length);r.setAttribute("width",o.x.toString()),r.setAttribute("height",o.y.toString());var i=t.subtract(o);r.setAttribute("x",i.x.toString()),r.setAttribute("y",i.y.toString()),r.setAttribute("filter","url(#shadow)"),r.classList.add("plate-box");var s=d.createSVGElement("text");s.setAttribute("fill","black"),s.classList.add("plate-text");for(var u=0;u<e.length;++u){var l=t.subtract(new p.Point(3,o.y-(u+1)*n)),c=d.createSVGElement("tspan");c.setAttribute("x",l.x.toString()),c.setAttribute("y",l.y.toString()),c.textContent=e[u],s.appendChild(c)}var h=d.createSVGElement("g");return h.appendChild(r),h.appendChild(s),h}function c(t){var e=d.createSVGElement("g"),r=d.createSVGElement("line"),n=new p.Point(Number(t.getAttribute("cx")),Number(t.getAttribute("cy"))),a=Number(t.getAttribute("r")),o=Math.trunc(a),i=new p.Point(4+o,8+o),s=new p.Bounds(n,n.subtract(i));r.setAttribute("x1",s.min.x.toString()),r.setAttribute("y1",s.min.y.toString()),r.setAttribute("x2",s.max.x.toString()),r.setAttribute("y2",s.max.y.toString()),r.classList.add("plate-pole");var u=h.getSVGDataset(t),c=u.ru,g=u.fi,f=g?"fi"===h.getUserLanguage()?[g,c]:[c,g]:[c];c in h.englishStationNames&&f.push(h.englishStationNames[c]);var m=l(s.min,f),y=d.createSVGElement("switch");return y.appendChild(m),e.appendChild(r),e.appendChild(y),e.id="plate",e}var p=window.L,d=t("./svg"),h=t("./util");r.makeCircle=n,r.convertToStation=a,r.makeCubicBezier=o,r.makeRingWithBorders=i,r.createSVGElement=s,r.makeDropShadow=u,r.makePlate=c},{"./svg":4,"./util":5}],5:[function(t,e,r){"use strict";function n(){return(navigator.userLanguage||navigator.language).slice(0,2).toLowerCase()}function a(t){var e=t.match(/translate(3d)?\((-?\d+).*?,\s?(-?\d+).*?(,\s?(-?\d+).*?)?\)/i);return e?new p.Point(Number(e[2]),Number(e[3])):new p.Point(0,0)}function o(t,e){var r=e.platforms.map(function(e){return t.platforms[e]});return 3===r.length&&r.every(function(t){return 2===t.transfers.length})?r:null}function i(t){if(3!==t.length)throw new Error("must have 3 vertices");console.log(t[1]);var e=t[1].subtract(t[0]),r=t[2].subtract(t[0]),n=e.x*e.x+e.y*e.y,a=r.x*r.x+r.y*r.y;return new p.Point(r.y*n-e.y*a,e.x*a-r.x*n).divideBy(2*(e.x*r.y-e.y*r.x)).add(t[0])}function s(t){if(t.dataset)return t.dataset;for(var e=t.attributes,r={},n=0;n<e.length;++n){var a=e[n].name;a.startsWith("data-")&&(r[a.slice(5)]=t.getAttribute(a))}return r}function u(t,e){Object.keys(e).forEach(function(r){return t.setAttribute("data-"+r,e[r])})}function l(t,e){return t.x*e.x+t.y*e.y}function c(t,e){return l(t,e)/t.distanceTo(e)}var p=window.L;r.getUserLanguage=n,r.parseTransform=a,r.findCircle=o,r.getCircumcenter=i,r.getSVGDataset=s,r.setSVGDataset=u,r.englishStationNames={"Centraľnyj voxal":"Central Raiway Station",Aeroport:"Airport"},r.dot=l,r.angle=c},{}]},{},[2]);