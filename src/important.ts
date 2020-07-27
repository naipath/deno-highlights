// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("https://deno.land/x/cowsay/src/balloon", [], function (exports_1, context_1) {
    "use strict";
    var say, think;
    var __moduleName = context_1 && context_1.id;
    function format(text, delimiters, wrap) {
        const lines = split(text, wrap);
        const maxLength = max(lines);
        let balloon;
        if (lines.length === 1) {
            balloon = [
                " " + top(maxLength),
                delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
                " " + bottom(maxLength),
            ];
        }
        else {
            balloon = [" " + top(maxLength)];
            for (let i = 0, len = lines.length; i < len; i += 1) {
                let delimiter;
                if (i === 0) {
                    delimiter = delimiters.first;
                }
                else if (i === len - 1) {
                    delimiter = delimiters.last;
                }
                else {
                    delimiter = delimiters.middle;
                }
                balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
            }
            balloon.push(" " + bottom(maxLength));
        }
        return balloon.join("\n");
    }
    function split(text, wrap) {
        text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, "")
            .replace(/\t/g, "        ");
        let lines = [];
        if (!wrap) {
            lines = text.split("\n");
        }
        else {
            let start = 0;
            while (start < text.length) {
                const nextNewLine = text.indexOf("\n", start);
                const wrapAt = Math.min(start + wrap, nextNewLine === -1 ? text.length : nextNewLine);
                lines.push(text.substring(start, wrapAt));
                start = wrapAt;
                if (text.charAt(start) === "\n") {
                    start += 1;
                }
            }
        }
        return lines;
    }
    function stringWidth(str) {
        return str.length;
    }
    function max(lines) {
        let mx = 0;
        for (let i = 0, len = lines.length; i < len; i += 1) {
            if (stringWidth(lines[i]) > mx) {
                mx = stringWidth(lines[i]);
            }
        }
        return mx;
    }
    function pad(text, length) {
        return text + (new Array(length - stringWidth(text) + 1)).join(" ");
    }
    function top(length) {
        return new Array(length + 3).join("_");
    }
    function bottom(length) {
        return new Array(length + 3).join("-");
    }
    return {
        setters: [],
        execute: function () {
            exports_1("say", say = (text, wrap) => {
                const delimiters = {
                    first: ["/", "\\"],
                    middle: ["|", "|"],
                    last: ["\\", "/"],
                    only: ["<", ">"],
                };
                return format(text, delimiters, wrap);
            });
            exports_1("think", think = (text, wrap) => {
                const delimiters = {
                    first: ["(", ")"],
                    middle: ["(", ")"],
                    last: ["(", ")"],
                    only: ["(", ")"],
                };
                return format(text, delimiters, wrap);
            });
        }
    };
});
System.register("https://deno.land/x/cowsay/src/replacer", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function default_1(cow, variables) {
        const eyes = escapeRe(variables.eyes);
        const eyeL = eyes.charAt(0);
        const eyeR = eyes.charAt(1);
        const tongue = escapeRe(variables.tongue);
        if (cow.indexOf("$the_cow") !== -1) {
            cow = extractTheCow(cow);
        }
        return cow
            .replace(/\$thoughts/g, variables.thoughts)
            .replace(/\$eyes/g, eyes)
            .replace(/\$tongue/g, tongue)
            .replace(/\$\{eyes\}/g, eyes)
            .replace(/\$eye/, eyeL)
            .replace(/\$eye/, eyeR)
            .replace(/\$\{tongue\}/g, tongue);
    }
    exports_2("default", default_1);
    function escapeRe(s) {
        if (s && s.replace) {
            return s.replace(/\$/g, "$$$$");
        }
        return s;
    }
    function extractTheCow(cow) {
        cow = cow.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, "");
        const match = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cow);
        if (!match) {
            console.error("Cannot parse cow file\n", cow);
            return cow;
        }
        else {
            return match[1].replace(/\\{2}/g, "\\").replace(/\\@/g, "@").replace(/\\\$/g, "$");
        }
    }
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/cowsay/src/cows/cows", [], function (exports_3, context_3) {
    "use strict";
    var atom, bearface, biohazard, box, cat, cat2, coffee, cube, cow, fox, hand, kitten, mule, world, yasuna;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            exports_3("atom", atom = `# atom
# via http://pastebin.com/1AZwKrKp
$the_cow = <<EOC;
       $thoughts
        $thoughts
                  =/;;/-
                 +:    //
                /;      /;
               -X        H.
 .//;;;:;;-,   X=        :+   .-;:=;:;%;.
 M-       ,=;;;#:,      ,:#;;:=,       ,\@
 :%           :%.=/++++/=.\$=           %=
  ,%;         %/:+/;,,/++:+/         ;+.
    ,+/.    ,;\@+,        ,%H;,    ,/+,
       ;+;;/= \@.  .H##X   -X :///+;
       ;+=;;;.\@,  .XM\@\$.  =X.//;=%/.
    ,;:      :\@%=        =\$H:     .+%-
  ,%=         %;-///==///-//         =%,
 ;+           :%-;;;:;;;;-X-           +:
 \@-      .-;;;;M-        =M/;;;-.      -X
  :;;::;;-.    %-        :+    ,-;;-;:==
               ,X        H.
                ;/      %=
                 //    +;
                  ,////,

EOC
`);
            exports_3("bearface", bearface = `$the_cow = <<EOC;
 $thoughts
  $thoughts
     .--.              .--.
    : (\\ ". _......_ ." /) :
     '.    '        '    .'
      /'   _        _   '\\
     /     $eye}      {$eye     \\
    |       /      \\       |
    |     /'        '\\     |
     \\   | .  .==.  . |   /
      '._ \\.' \\__/ './ _.'
      /  '''._-''-_.'''  \\
EOC
`);
            exports_3("biohazard", biohazard = `# biohazard symbol
# via http://pastebin.com/1AZwKrKp
$the_cow = <<EOC;
     $thoughts
      $thoughts
              =+\$HM####\@H%;,
           /H###############M\$,
           ,\@################+
            .H##############+
              X############/
               \$##########/
                %########/
                 /X/;;+X/
 
                  -XHHX-
                 ,######,
 \#############X  .M####M.  X#############
 \##############-   -//-   -##############
 X##############%,      ,+##############X
 -##############X        X##############-
  %############%          %############%
   %##########;            ;##########%
    ;#######M=              =M#######;
     .+M###\@,                ,\@###M+.
        :XH.                  .HX:

EOC
`);
            exports_3("box", box = `# Box
$the_cow = <<EOC;
     $thoughts
      $thoughts
         __________________
        /\\  ______________ \\
       /::\\ \\ZZZZZZZZZZZZ/\\ \\
      /:/\\.\\ \\        /:/\\:\\ \\
     /:/Z/\\:\\ \\      /:/Z/\\:\\ \\
    /:/Z/__\\:\\ \\____/:/Z/  \\:\\ \\
   /:/Z/____\\:\\ \\___\\/Z/    \\:\\ \\
   \\:\\ \\ZZZZZ\\:\\ \\ZZ/\\ \\     \\:\\ \\
    \\:\\ \\     \\:\\ \\ \\:\\ \\     \\:\\ \\
     \\:\\ \\     \\:\\ \\_\\;\\_\\_____\\;\\ \\
      \\:\\ \\     \\:\\_________________\\
       \\:\\ \\    /:/ZZZZZZZZZZZZZZZZZ/
        \\:\\ \\  /:/Z/    \\:\\ \\  /:/Z/
         \\:\\ \\/:/Z/      \\:\\ \\/:/Z/
          \\:\\/:/Z/________\\;\\/:/Z/
           \\::/Z/_______itz__\\/Z/
            \\/ZZZZZZZZZZZZZZZZZ/
EOC
`);
            exports_3("cat", cat = String.raw `# Cat
#
# used https://github.com/paulkaefer/flipFile.py
#  python flipFile.py cat " "
# and 
#  cat cat_flipped | sed 's/\\/\\\\/g' > cat.cow
#
$the_cow = <<EOC;
  $thoughts
   $thoughts                       _
                          / )      
                         / /       
      //|                \\ \\       
   .-'^ \\   .-'''''-.     \\ \\      
 o' {|}  \\_/         \\    / /      
 '--,  _ //   .---.   \\  / /       
   ^^^' )/  ,/     \\   \\/ /        
        (  /)      /\\/   /         
        / / (     / (   /          
    ___/ /) (  __/ __\\ (           
   (((__)((__)((__(((___)          
EOC
`);
            exports_3("cat2", cat2 = `#
#	Cat picture by Joan Stark
#	Transformed into cowfile by Myroslav Golub
#
$the_cow = <<EOC;
       $thoughts  
        $thoughts
         $thoughts
          $thoughts
          |\\___/|
         =) $eyeY$eye (=            
          \\  ^  /
           )=*=(       
          /     \\
          |     |
         /| | | |\\
         \\| | |_|/\\
         //_// ___/
             \\_) 
EOC
`);
            exports_3("coffee", coffee = `$the_cow = <<EOC;
$thoughts      {
 $thoughts  }   }   {
   {   {  }  }
    }   }{  {
   {  }{  }  }
  ( }{ }{  { )
 .-{   }   }-.
( ( } { } { } )
|'-.._____..-'|
|             ;--.
|   (__)     (__  \\
|   ($eyes)      | )  )
|    \\/       |/  /
|     $tongue      /  /
|            (  /
\\             y'
 '-.._____..-'
EOC
`);
            exports_3("cube", cube = `# Cube
#
# from http://www.reddit.com/r/commandline/comments/2lb5ij/what_is_your_favorite_ascii_art/cltrase
#   also available at https://gist.github.com/th3m4ri0/6e3f631866da31d05030
# 
$the_cow = <<EOC;
   $thoughts
    $thoughts
       ____________
      /\\  ________ \\
     / /\\ \\______/\\ \\
    / / /\\ \\  / /\\ \\ \\
   / / /__\\ \\/ / /\\ \\ \\
  / /_/____\\ \\/_/__\\_\\ \\
  \\ \\ \\____/ / ________ \\
   \\ \\ \\  / / /\\ \\  / / /
    \\ \\ \\/ / /\\ \\ \\/ / /
     \\ \\/ / /__\\_\\/ / /
      \\  / /______\\/ /
       \\/___________/
EOC
`);
            exports_3("cow", cow = `$the_cow = <<"EOC";
   $thoughts   ^__^
    $thoughts  ($eyes)\\_______
       (__)\\       )\\/\\
        $tongue ||----w |
           ||     ||
EOC
`);
            exports_3("fox", fox = `# Fox
# http://www.retrojunkie.com/asciiart/animals/foxes.htm
$the_cow = <<EOC;
$thoughts
 $thoughts
   /\\   /\\   Todd Vargo
  //\\\\_//\\\\     ____
  \\_     _/    /   /
   / * * \\    /^^^]
   \\_\\O/_/    [   ]
    /   \\_    [   /
    \\     \\_  /  /
     [ [ /  \\/ _/
    _[ [ \\  /_/
EOC
`);
            exports_3("hand", hand = `##
## これが私の本当の姿だ！
##  
##
$the_cow = <<EOC;
       $thoughts
        $thoughts
                           __ 
                  l^ヽ    /  }    _
                  |  |   /  /   ／  )
                  |  |  /  /  ／  ／ _
                  j. し'  / ／  ／ ／  )
                 /  .＿__ ´  ／ ／  ／
                /   {  /:｀ヽ ｀¨ ／
               /     ∨::::::ﾊ   ／
              |廴     ＼:::ノ}  /
    {￣￣￣￣ヽ  廴     ｀ー'  ー-､
    ヽ ＿＿_   ＼ 廴        ＿＿＿ﾉ
        ／       ＼ 辷_´￣
      ／           ﾍ￣
    ／             ,ﾍ
                  /、ﾍ
                 /＼__ﾉ
EOC
`);
            exports_3("kitten", kitten = `# Kitten
#
# based on rfksay by Andrew Northern
# http://robotfindskitten.org/aw.cgi?main=software.rfk#rfksay
#
$the_cow = <<EOC;
   $thoughts
    $thoughts

     |\\_/|
     |o o|__
     --*--__\\
     C_C_(___)
EOC
`);
            exports_3("mule", mule = `# Mule
#
# based on mule from http://rossmason.blogspot.com/2008/10/friday-ascii-art.html 
#
$the_cow = <<EOC;
     $thoughts
      $thoughts 
  /\\          /\\                               
 ( \\\\        // )                              
  \\ \\\\      // /                               
   \\_\\\\||||//_/                                
     / _  _ \\/                                 
                                               
     |(o)(o)|\\/                                
     |      | \\/                               
     \\      /  \\/_____________________         
      |____|     \\\\                  \\\\        
     /      \\     ||                  \\\\       
     \\ 0  0 /     |/                  |\\\\      
      \\____/ \\    V           (       / \\\\     
       / \\    \\     )          \\     /   \\\\    
      / | \\    \\_|  |___________\\   /     "" 
                  ||  |     \\   /\\  \\          
                  ||  /      \\  \\ \\  \\         
                  || |        | |  | |         
                  || |        | |  | |         
                  ||_|        |_|  |_|         
                 //_/        /_/  /_/          
EOC
`);
            exports_3("world", world = `# World
$the_cow = <<EOC;
   $thoughts
    $thoughts
          _,--',   _._.--._____
   .--.--';_'-.', ";_      _.,-'
  .'--'.  _.'    {''-;_ .-.>.'
        '-:_      )  / '' '=.
          ) >     {_/,     /~)
          |/               '^ .'
EOC
`);
            exports_3("yasuna", yasuna = `##
$the_cow = <<EOC;
   $thoughts
    $thoughts
  
            . .: ───:. .
         .／.: .: .: .: .: ヽ
        .:   .:l.:   .: .: .:.
        |.l:..ﾊ.ハ..|ヽ.ﾄ､:: |
        |:l.:/ヽ､_ヽ|_ノV:.:.|
        |:lﾊ.  {j    {j  |:ヽl
        ﾉ:l} ''        ''|:ノヽ／ )
        ヽﾍ:ヽ.､ r---､  ｨﾉ ┬' '／
     γ::ヽ  ｀^Y'TﾇΤ' {__├'''
     ｀‐< ＼_ ハ |:|  Y
          ヽ_>､|  |:|／|
               /   V   l
             〈        〉
           〈:｀-:';'-´:〉
            .>-:ｧ─--‐r-:ｨ
            /  /     |  |
           /  /      |  |
          /-,/       |--|
         に7         |二|
EOC
`);
        }
    };
});
System.register("https://deno.land/x/cowsay/src/models/IOptions", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/cowsay/src/cows", ["https://deno.land/x/cowsay/src/replacer", "https://deno.land/x/cowsay/src/cows/cows"], function (exports_5, context_5) {
    "use strict";
    var replacer_ts_1, cows, get, listSync;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (replacer_ts_1_1) {
                replacer_ts_1 = replacer_ts_1_1;
            },
            function (cows_1) {
                cows = cows_1;
            }
        ],
        execute: function () {
            exports_5("get", get = (cow) => {
                const text = cows[cow];
                return (options) => {
                    return replacer_ts_1.default(text, options);
                };
            });
            exports_5("listSync", listSync = () => {
                return [
                    "atom",
                    "bearface",
                    "biohazard",
                    "box",
                    "cat",
                    "cat2",
                    "coffee",
                    "cube",
                    "cow",
                    "fox",
                    "hand",
                    "kitten",
                    "mule",
                    "world",
                    "yasuna",
                ];
            });
        }
    };
});
System.register("https://deno.land/x/cowsay/src/faces", [], function (exports_6, context_6) {
    "use strict";
    var modes, faces;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            modes = [
                {
                    eyes: "oo",
                    tongue: "  ",
                },
                {
                    eyes: "==",
                    tongue: "  ",
                },
                {
                    eyes: "xx",
                    tongue: "U ",
                },
                {
                    eyes: "$$",
                    tongue: "  ",
                },
                {
                    eyes: "@@",
                    tongue: "  ",
                },
                {
                    eyes: "**",
                    tongue: "U ",
                },
                {
                    eyes: "--",
                    tongue: "  ",
                },
                {
                    eyes: "OO",
                    tongue: "  ",
                },
                {
                    eyes: "..",
                    tongue: "  ",
                },
            ];
            exports_6("faces", faces = (options) => {
                if (options.mode) {
                    const m = modes[options.mode];
                    return m;
                }
                return {
                    eyes: options.eyes || "oo",
                    tongue: options.tongue || "  ",
                };
            });
        }
    };
});
System.register("https://deno.land/x/cowsay/mod", ["https://deno.land/x/cowsay/src/balloon", "https://deno.land/x/cowsay/src/cows", "https://deno.land/x/cowsay/src/faces"], function (exports_7, context_7) {
    "use strict";
    var baloon, cows, faces_ts_1, say, think, list;
    var __moduleName = context_7 && context_7.id;
    function doIt(options, sayAloud) {
        let cowName;
        if (options.random) {
            const cowsList = cows.listSync();
            const nb = Math.floor(Math.random() * cowsList.length);
            cowName = cowsList[nb];
        }
        else {
            cowName = options.cow || "cow";
        }
        const cow = cows.get(cowName);
        const face = faces_ts_1.faces(options);
        face.thoughts = sayAloud ? "\\" : "o";
        const action = sayAloud ? "say" : "think";
        return baloon[action](options.text, options.wrap ? options.wrapLength : undefined) + "\n" + cow(face);
    }
    return {
        setters: [
            function (baloon_1) {
                baloon = baloon_1;
            },
            function (cows_2) {
                cows = cows_2;
            },
            function (faces_ts_1_1) {
                faces_ts_1 = faces_ts_1_1;
            }
        ],
        execute: function () {
            exports_7("say", say = (options) => {
                return doIt(options, true);
            });
            exports_7("think", think = (options) => {
                return doIt(options, false);
            });
            exports_7("list", list = () => {
                return cows.listSync();
            });
        }
    };
});
System.register("https://deno.land/std/fmt/colors", [], function (exports_8, context_8) {
    "use strict";
    var noColor, enabled, ANSI_PATTERN;
    var __moduleName = context_8 && context_8.id;
    function setColorEnabled(value) {
        if (noColor) {
            return;
        }
        enabled = value;
    }
    exports_8("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
        return enabled;
    }
    exports_8("getColorEnabled", getColorEnabled);
    function code(open, close) {
        return {
            open: `\x1b[${open.join(";")}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
        };
    }
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    function reset(str) {
        return run(str, code([0], 0));
    }
    exports_8("reset", reset);
    function bold(str) {
        return run(str, code([1], 22));
    }
    exports_8("bold", bold);
    function dim(str) {
        return run(str, code([2], 22));
    }
    exports_8("dim", dim);
    function italic(str) {
        return run(str, code([3], 23));
    }
    exports_8("italic", italic);
    function underline(str) {
        return run(str, code([4], 24));
    }
    exports_8("underline", underline);
    function inverse(str) {
        return run(str, code([7], 27));
    }
    exports_8("inverse", inverse);
    function hidden(str) {
        return run(str, code([8], 28));
    }
    exports_8("hidden", hidden);
    function strikethrough(str) {
        return run(str, code([9], 29));
    }
    exports_8("strikethrough", strikethrough);
    function black(str) {
        return run(str, code([30], 39));
    }
    exports_8("black", black);
    function red(str) {
        return run(str, code([31], 39));
    }
    exports_8("red", red);
    function green(str) {
        return run(str, code([32], 39));
    }
    exports_8("green", green);
    function yellow(str) {
        return run(str, code([33], 39));
    }
    exports_8("yellow", yellow);
    function blue(str) {
        return run(str, code([34], 39));
    }
    exports_8("blue", blue);
    function magenta(str) {
        return run(str, code([35], 39));
    }
    exports_8("magenta", magenta);
    function cyan(str) {
        return run(str, code([36], 39));
    }
    exports_8("cyan", cyan);
    function white(str) {
        return run(str, code([37], 39));
    }
    exports_8("white", white);
    function gray(str) {
        return run(str, code([90], 39));
    }
    exports_8("gray", gray);
    function bgBlack(str) {
        return run(str, code([40], 49));
    }
    exports_8("bgBlack", bgBlack);
    function bgRed(str) {
        return run(str, code([41], 49));
    }
    exports_8("bgRed", bgRed);
    function bgGreen(str) {
        return run(str, code([42], 49));
    }
    exports_8("bgGreen", bgGreen);
    function bgYellow(str) {
        return run(str, code([43], 49));
    }
    exports_8("bgYellow", bgYellow);
    function bgBlue(str) {
        return run(str, code([44], 49));
    }
    exports_8("bgBlue", bgBlue);
    function bgMagenta(str) {
        return run(str, code([45], 49));
    }
    exports_8("bgMagenta", bgMagenta);
    function bgCyan(str) {
        return run(str, code([46], 49));
    }
    exports_8("bgCyan", bgCyan);
    function bgWhite(str) {
        return run(str, code([47], 49));
    }
    exports_8("bgWhite", bgWhite);
    function clampAndTruncate(n, max = 255, min = 0) {
        return Math.trunc(Math.max(Math.min(n, max), min));
    }
    function rgb8(str, color) {
        return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_8("rgb8", rgb8);
    function bgRgb8(str, color) {
        return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_8("bgRgb8", bgRgb8);
    function rgb24(str, color) {
        if (typeof color === "number") {
            return run(str, code([38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 39));
        }
        return run(str, code([
            38,
            2,
            clampAndTruncate(color.r),
            clampAndTruncate(color.g),
            clampAndTruncate(color.b),
        ], 39));
    }
    exports_8("rgb24", rgb24);
    function bgRgb24(str, color) {
        if (typeof color === "number") {
            return run(str, code([48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 49));
        }
        return run(str, code([
            48,
            2,
            clampAndTruncate(color.r),
            clampAndTruncate(color.g),
            clampAndTruncate(color.b),
        ], 49));
    }
    exports_8("bgRgb24", bgRgb24);
    function stripColor(string) {
        return string.replace(ANSI_PATTERN, "");
    }
    exports_8("stripColor", stripColor);
    return {
        setters: [],
        execute: function () {
            noColor = globalThis.Deno?.noColor ?? true;
            enabled = !noColor;
            ANSI_PATTERN = new RegExp([
                "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
            ].join("|"), "g");
        }
    };
});
System.register("file:///Users/tvs/workspace/openvalue/deno-playground/src/5%20Modules", ["https://deno.land/x/cowsay/mod", "https://deno.land/std/fmt/colors"], function (exports_9, context_9) {
    "use strict";
    var o, msg, colors_ts_1;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (o_1) {
                o = o_1;
            },
            function (colors_ts_1_1) {
                colors_ts_1 = colors_ts_1_1;
            }
        ],
        execute: function () {
            msg = o.say({ text: "hello from OpenValue" });
            console.log(msg);
            console.log(colors_ts_1.blue(msg));
        }
    };
});

__instantiate("file:///Users/tvs/workspace/openvalue/deno-playground/src/5%20Modules", false);
