#!/usr/bin/env node

var _USAGE = "\n\
    Usage:\n\
        node build.js [slide-name]\n\
";

var _CONSOLE_COLOR = {
        _RED:       "\u001b[31m",
        _YELLOW:    "\u001b[33m",
        _CLEAR:     "\u001b[0m"
    };

var argv    = process.argv.slice(2); // [slide-name]
var Process = require("child_process");
var slideName = argv[0] || "WebModule";

if (!slideName) {
    console.log(_CONSOLE_COLOR._RED + _USAGE + _CONSOLE_COLOR._CLEAR);
    return;
}

/* slide directory and files

    ./
        Task.js.md         <- slide source
        Task.js/
            index.html     <- slide page
            template.html  <- slide template
 */

var command = "pandoc --section-divs -s -t html5" +
              " --template ./" + slideName + "/template.html" +
              " ./" + slideName + ".md" +
              " -o ./" + slideName + "/index.html";

Process.exec(command, function(err, stdout, stderr) {
                console.log(_CONSOLE_COLOR._YELLOW + "    build  " + _CONSOLE_COLOR._CLEAR + command);

                Process.exec("open ./" + slideName + "/index.html", function() {
                });
             });

