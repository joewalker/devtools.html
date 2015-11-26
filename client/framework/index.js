
require("babel-polyfill");
const Toolbox = require("devtools/client/framework/toolbox");

Toolbox.getWSTarget().then(target => {
  const toolbox = new Toolbox.Toolbox(target, "inspector", "bottom");
  return toolbox.open().then(() => console.log("Open finished"));
});
