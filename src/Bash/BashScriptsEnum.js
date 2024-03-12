"use strict";
/**
 * Enum for all the Bash Commands
 */
var BashScriptsEnum;
(function (BashScriptsEnum) {
    BashScriptsEnum["Start"] = "start";
    BashScriptsEnum["Restart"] = "restart";
    BashScriptsEnum["Shutdown"] = "shutdown";
    BashScriptsEnum["Backup"] = "backup";
    BashScriptsEnum["Update"] = "update";
    BashScriptsEnum["Custom"] = "custom";
    BashScriptsEnum["Ping"] = "ping";
})(BashScriptsEnum || (BashScriptsEnum = {}));
module.exports = BashScriptsEnum;
