const os = require("os");
const orig = os.hostname;
os.hostname = function () {
  const h = orig.call(os);
  return /[^\x00-\x7F]/.test(h) ? "qt-app-local" : h;
};
