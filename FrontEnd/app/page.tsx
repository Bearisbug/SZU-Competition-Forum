"use client";
import React, { useEffect } from "react";

export default function TagCloud() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden; 
      }
    `;
    document.head.appendChild(style);

    return () => {
      // 卸载组件时移除样式
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="tagcloud-wrapper">
      <div
        className="tagcloud-controls"
        //@ts-ignore
        style={{ "--num-elements": 20 }}
      >
        {/* 控制按钮 */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="tagcloud-control-button"
            //@ts-ignore
            style={{ "--index": i + 1 }}
          >
            <input type="radio" name="tagcloud-control-input" />
          </div>
        ))}

        {/* 旋转标签云 */}
        <div className="tagcloud-rotation">
          <ul
            className="tagcloud-tags"
            //@ts-ignore
            style={{ "--num-elements": 93 }}
          >
            <li
              className="tagcloud-tag"
              //@ts-ignore
              //@ts-ignore
              style={{ "--index": 1 }}
            >
              <div>
                <a
                  href="https://www.tiaozhanbei.net"
                  className="text-xl"
                  target="_blank"
                  rel="noreferrer"
                >
                  挑战杯
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag"
              //@ts-ignore
              style={{ "--index": 2 }}
            >
              <div>
                <a href="https://nuxt.com/" target="_blank" rel="noreferrer">
                  Nuxt.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 3 }}
            >
              <div>
                <a
                  href="https://github.com/CesiumGS/cesium"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cesium
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 4 }}
            >
              <div>
                <a href="https://zzz.dog/" target="_blank" rel="noreferrer">
                  Zdog
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 5 }}
            >
              <div>
                <a href="http://cy.ncss.cn" target="_blank" rel="noreferrer">
                  互联网+
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 6 }}
            >
              <div>
                <a
                  href="https://github.com/micku7zu/vanilla-tilt.js"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tilt.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 7 }}
            >
              <div>
                <a href="https://threejs.org/" target="_blank" rel="noreferrer">
                  Three.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 8 }}
            >
              <div>
                <a
                  href="https://angularjs.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Angular
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 9 }}
            >
              <div>
                <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
                  React
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 10 }}
            >
              <div>
                <a href="https://icpc.global" target="_blank" rel="noreferrer">
                  ACM
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 11 }}
            >
              <div>
                <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
                  Next.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 12 }}
            >
              <div>
                <a
                  href="https://www.gatsbyjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Gatsby
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 13 }}
            >
              <div>
                <a
                  href="https://expressjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Express.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 14 }}
            >
              <div>
                <a
                  href="https://www.sencha.com/products/extjs/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ExtJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 15 }}
            >
              <div>
                <a
                  href="https://www.robomaster.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  RobotMaster
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 16 }}
            >
              <div>
                <a
                  href="https://backbonejs.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Backbone.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 17 }}
            >
              <div>
                <a href="https://jquery.com/" target="_blank" rel="noreferrer">
                  jQuery
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 18 }}
            >
              <div>
                <a
                  href="https://playcanvas.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  PlayCanvas
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 19 }}
            >
              <div>
                <a
                  href="https://polymer-library.polymer-project.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Polymer
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 20 }}
            >
              <div>
                <a
                  href="https://www.mcm.edu.cn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  数学建模
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 21 }}
            >
              <div>
                <a href="https://emberjs.com/" target="_blank" rel="noreferrer">
                  Ember.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 22 }}
            >
              <div>
                <a
                  href="https://alpinejs.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Alpine.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 23 }}
            >
              <div>
                <a
                  href="https://nodejs.org/en/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Node.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 24 }}
            >
              <div>
                <a href="https://d3js.org/" target="_blank" rel="noreferrer">
                  D3.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 25 }}
            >
              <div>
                <a
                  href="https://gplt.patest.cn"
                  className="text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  天梯赛
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 26 }}
            >
              <div>
                <a href="https://lodash.com/" target="_blank" rel="noreferrer">
                  Lodash
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 27 }}
            >
              <div>
                <a href="https://pixijs.com/" target="_blank" rel="noreferrer">
                  PixiJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 28 }}
            >
              <div>
                <a href="https://animejs.com/" target="_blank" rel="noreferrer">
                  Anime.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 29 }}
            >
              <div>
                <a
                  href="https://rishabhp.github.io/bideo.js/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bideo.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 30 }}
            >
              <div>
                <a
                  href="https://www.chartjs.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chart.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 31 }}
            >
              <div>
                <a
                  href="https://nosir.github.io/cleave.js/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cleave.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 32 }}
            >
              <div>
                <a
                  href="https://glimmerjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Glimmer
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 33 }}
            >
              <div>
                <a
                  href="https://sarcadass.github.io/granim.js/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Granim.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 34 }}
            >
              <div>
                <a
                  href="https://github.com/alvarotrigo/fullPage.js/"
                  target="_blank"
                  rel="noreferrer"
                >
                  fullPage.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 35 }}
            >
              <div>
                <a
                  href="https://leafletjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Leaflet
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 36 }}
            >
              <div>
                <a
                  href="https://multiple.js.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Multiple.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 37 }}
            >
              <div>
                <a
                  href="https://momentjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Moment.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 38 }}
            >
              <div>
                <a
                  href="https://masonry.desandro.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Masonry
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 39 }}
            >
              <div>
                <a
                  href="http://omniscientjs.github.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Omniscient
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 40 }}
            >
              <div>
                <a
                  href="http://parsleyjs.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Parsley
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 41 }}
            >
              <div>
                <a
                  href="https://popper.js.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Popper.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 42 }}
            >
              <div>
                <a
                  href="https://github.com/sindresorhus/screenfull.js/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Screenfull.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 43 }}
            >
              <div>
                <a href="https://vocajs.com/" target="_blank" rel="noreferrer">
                  Voca
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 44 }}
            >
              <div>
                <a
                  href="https://getbootstrap.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bootstrap
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 45 }}
            >
              <div>
                <a href="https://mochajs.org/" target="_blank" rel="noreferrer">
                  Mocha
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 46 }}
            >
              <div>
                <a
                  href="https://ionicframework.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ionic
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 47 }}
            >
              <div>
                <a href="https://webix.com/" target="_blank" rel="noreferrer">
                  Webix
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 48 }}
            >
              <div>
                <a
                  href="https://www.meteor.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Meteor.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 49 }}
            >
              <div>
                <a href="https://p5js.org/" target="_blank" rel="noreferrer">
                  p5
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 50 }}
            >
              <div>
                <a
                  href="https://www.babylonjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Babylon.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 51 }}
            >
              <div>
                <a
                  href="https://github.com/aframevr/aframe"
                  target="_blank"
                  rel="noreferrer"
                >
                  Aframe
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 52 }}
            >
              <div>
                <a href="https://zeptojs.com/" target="_blank" rel="noreferrer">
                  Zepto
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 53 }}
            >
              <div>
                <a
                  href="https://createjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CreateJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 54 }}
            >
              <div>
                <a
                  href="https://nightwatchjs.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Nightwatch.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 55 }}
            >
              <div>
                <a
                  href="https://stimulus.hotwired.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Stimulus
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 56 }}
            >
              <div>
                <a
                  href="https://nativescript.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  NativeScript
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 57 }}
            >
              <div>
                <a href="https://relay.dev/" target="_blank" rel="noreferrer">
                  Relay
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 58 }}
            >
              <div>
                <a
                  href="https://cycle.js.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cycle.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 59 }}
            >
              <div>
                <a
                  href="https://flightjs.github.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Flight
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 60 }}
            >
              <div>
                <a
                  href="http://trykickoff.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kickoff
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 61 }}
            >
              <div>
                <a href="https://cylonjs.com/" target="_blank" rel="noreferrer">
                  Cylon.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 62 }}
            >
              <div>
                <a href="https://jestjs.io/" target="_blank" rel="noreferrer">
                  Jest
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 63 }}
            >
              <div>
                <a
                  href="https://feathersjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Feathers
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 64 }}
            >
              <div>
                <a
                  href="http://bootboxjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bootbox.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 65 }}
            >
              <div>
                <a
                  href="https://modernizr.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Modernizr
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 66 }}
            >
              <div>
                <a href="https://cube.dev/" target="_blank" rel="noreferrer">
                  Cube.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 67 }}
            >
              <div>
                <a
                  href="https://requirejs.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  RequireJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 68 }}
            >
              <div>
                <a
                  href="https://jasmine.github.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jasmine
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 69 }}
            >
              <div>
                <a href="https://qunitjs.com/" target="_blank" rel="noreferrer">
                  QUnit
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 70 }}
            >
              <div>
                <a
                  href="https://github.com/soulwire/sketch.js"
                  target="_blank"
                  rel="noreferrer"
                >
                  sketch.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 71 }}
            >
              <div>
                <a
                  href="https://github.com/wso2/jaggery"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jaggery
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 72 }}
            >
              <div>
                <a
                  href="https://kangoextensions.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kango
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 73 }}
            >
              <div>
                <a
                  href="https://www.cappuccino.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cappuccino
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 74 }}
            >
              <div>
                <a href="https://konvajs.org/" target="_blank" rel="noreferrer">
                  Konva
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 75 }}
            >
              <div>
                <a
                  href="https://sproutcore.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  SproutCore
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 76 }}
            >
              <div>
                <a href="https://webix.com/" target="_blank" rel="noreferrer">
                  Webix
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 77 }}
            >
              <div>
                <a
                  href="https://github.com/quirkey/sammy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sammy
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 78 }}
            >
              <div>
                <a
                  href="https://seemple.js.org/#!home"
                  target="_blank"
                  rel="noreferrer"
                >
                  Seemple.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 79 }}
            >
              <div>
                <a href="https://socket.io/" target="_blank" rel="noreferrer">
                  Socket.IO
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 80 }}
            >
              <div>
                <a href="https://xstyled.dev/" target="_blank" rel="noreferrer">
                  xstyled
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 81 }}
            >
              <div>
                <a
                  href="http://vanilla-js.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  VanillaJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 82 }}
            >
              <div>
                <a
                  href="https://github.com/linnovate/mean"
                  target="_blank"
                  rel="noreferrer"
                >
                  MEAN
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 83 }}
            >
              <div>
                <a
                  href="https://github.com/flatiron/flatiron"
                  target="_blank"
                  rel="noreferrer"
                >
                  Flatiron
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 84 }}
            >
              <div>
                <a
                  href="https://ripplejs.github.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ripple.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 85 }}
            >
              <div>
                <a href="https://sailsjs.com/" target="_blank" rel="noreferrer">
                  Sails.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 86 }}
            >
              <div>
                <a
                  href="https://mochi.github.io/mochikit/"
                  target="_blank"
                  rel="noreferrer"
                >
                  MochiKit
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 87 }}
            >
              <div>
                <a
                  href="https://optimizely.github.io/nuclear-js/"
                  target="_blank"
                  rel="noreferrer"
                >
                  NuclearJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 88 }}
            >
              <div>
                <a
                  href="https://ampersandjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ampersand.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 89 }}
            >
              <div>
                <a
                  href="https://heisenbergjs.github.io/heisenberg/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Heisenberg.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 90 }}
            >
              <div>
                <a
                  href="https://marionettejs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Marionette
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 91 }}
            >
              <div>
                <a href="https://pagerjs.com/" target="_blank" rel="noreferrer">
                  pager.js
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 92 }}
            >
              <div>
                <a href="https://canjs.com/" target="_blank" rel="noreferrer">
                  CanJS
                </a>
              </div>
            </li>
            <li
              className="tagcloud-tag" //@ts-ignore
              style={{ "--index": 93 }}
            >
              <div>
                <a href="http://rivetsjs.com/" target="_blank" rel="noreferrer">
                  Rivets.js
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
