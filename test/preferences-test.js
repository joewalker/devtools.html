var chai = require("chai");
var expect = chai.expect;
var Prefs = require("../sham/services").Services.prefs;

afterEach(() => Prefs.resetPrefs());

it("getBoolPref returns a bool pref", function () {
  expect(Prefs.getBoolPref("devtools.toolbox.sideEnabled")).to.be.equal(true);
});
it("getCharPref returns a char pref", function () {
  expect(Prefs.getCharPref("devtools.toolbox.host")).to.be.equal("bottom");
});
it("getIntPref returns an int pref", function () {
  expect(Prefs.getIntPref("devtools.toolbox.footer.height")).to.be.equal(250);
});
it("getters fail when not matching types", function () {
  // expect(() => Prefs.getBoolPref("devtools.toolbox.host")).to.throw(Error);
  // expect(() => Prefs.getCharPref("devtools.toolbox.sideEnabled")).to.throw(Error);
  // expect(() => Prefs.getBoolPref("devtools.toolbox.footer.height")).to.throw(Error);
});
it("setters fail when not matching method types", function () {
  expect(() => Prefs.setBoolPref("devtools.toolbox.host", "hello")).to.throw(Error);
  expect(() => Prefs.setCharPref("devtools.toolbox.sideEnabled", true)).to.throw(Error);
  expect(() => Prefs.setBoolPref("devtools.toolbox.footer.height", 250)).to.throw(Error);
});
it("setters fail when not matching value types", function () {
  expect(() => Prefs.setCharPref("devtools.toolbox.host", 23)).to.throw(Error);
  expect(() => Prefs.setBoolPref("devtools.toolbox.sideEnabled", "ya")).to.throw(Error);
  expect(() => Prefs.setIntPref("devtools.toolbox.footer.height", true)).to.throw(Error);
});
it("setBoolPref sets a bool pref", function () {
  Prefs.setBoolPref("devtools.toolbox.sideEnabled", false);
  expect(Prefs.getBoolPref("devtools.toolbox.sideEnabled")).to.be.equal(false);
});
it("setCharPref sets a char pref", function () {
  Prefs.setCharPref("devtools.toolbox.host", "side");
  expect(Prefs.getCharPref("devtools.toolbox.host")).to.be.equal("side");
});
it("setIntPref sets an int pref", function () {
  Prefs.setIntPref("devtools.toolbox.footer.height", 9999);
  expect(Prefs.getIntPref("devtools.toolbox.footer.height")).to.be.equal(9999);
});
