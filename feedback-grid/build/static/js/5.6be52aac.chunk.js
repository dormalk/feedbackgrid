(this["webpackJsonpfeedback-grid"]=this["webpackJsonpfeedback-grid"]||[]).push([[5],{30:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return r}));var c=function(){return Math.random().toString(36).substr(2,9)},r=function(){var e=localStorage.getItem("myUid");if(e)return e;var t=c();return localStorage.setItem("myUid",t),t}},39:function(e,t,n){},55:function(e,t,n){"use strict";n.r(t);var c=n(4),r=n(0),i=n.n(r),a=(n(39),n(9)),o=n(30),s=n(1),d=n(2);t.default=function(){var e=i.a.useState(),t=Object(c.a)(e,2),n=t[0],r=t[1],l=Object(s.f)();return Object(d.jsx)("div",{className:"container",children:Object(d.jsxs)("div",{className:"card",children:[Object(d.jsx)("h3",{children:"FEEDBACK GRID"}),Object(d.jsxs)("p",{children:["With online ",Object(d.jsx)("b",{children:"FEEDBACK GRID"})," you can create interactive grid to qustions your team and get anonynus and authentic feedback."]}),Object(d.jsx)("hr",{style:{borderWidth:"0.2px",borderColor:"lightgrey"}}),Object(d.jsxs)("div",{className:"card__footer",children:[Object(d.jsx)(a.b,{to:"/gridview/".concat(Object(o.a)(),"?mode=new"),className:"btn start",children:"START ONLINE FEEDBACK GRID"}),Object(d.jsx)("div",{className:"or-dlimeter",children:"or"}),Object(d.jsxs)("div",{className:"join-wrapper",children:[Object(d.jsx)("input",{type:"text",className:"join-input",onChange:function(e){r(e.target.value)}}),Object(d.jsx)("button",{href:null,onClick:function(){""===n||void 0===n?alert("Please enter a grid id"):fetch("".concat("https://feedback-grid.herokuapp.com","/api/grid/check/").concat(n)).then((function(e){if(!e.ok)throw new Error("Grid does not exist");l("/gridview/".concat(n,"?mode=join"))})).catch((function(e){return alert(e)}))},className:"btn join",disabled:""===n||void 0===n,children:"JOIN NOW"})]})]})]})})}}}]);
//# sourceMappingURL=5.6be52aac.chunk.js.map