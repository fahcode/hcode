"use strict";

function cov_2ilfsqrguw() {
  var path = "unknown.js";
  var hash = "d94e3131388dc5c1c68f4582bd03958662cf9961";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "unknown.js",
    statementMap: {
      "0": {
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 10
        }
      },
      "1": {
        start: {
          line: 2,
          column: 8
        },
        end: {
          line: 2,
          column: 9
        }
      },
      "2": {
        start: {
          line: 4,
          column: 2
        },
        end: {
          line: 4,
          column: 28
        }
      },
      "3": {
        start: {
          line: 6,
          column: 11
        },
        end: {
          line: 6,
          column: 12
        }
      },
      "4": {
        start: {
          line: 7,
          column: 0
        },
        end: {
          line: 9,
          column: 1
        }
      },
      "5": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 8,
          column: 20
        }
      },
      "6": {
        start: {
          line: 10,
          column: 9
        },
        end: {
          line: 10,
          column: 10
        }
      },
      "7": {
        start: {
          line: 11,
          column: 0
        },
        end: {
          line: 18,
          column: 1
        }
      },
      "8": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 18
        }
      },
      "9": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 10
        }
      },
      "10": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 18
        }
      },
      "11": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 10
        }
      },
      "12": {
        start: {
          line: 19,
          column: 0
        },
        end: {
          line: 19,
          column: 23
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "d94e3131388dc5c1c68f4582bd03958662cf9961"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2ilfsqrguw = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2ilfsqrguw();
var a = (cov_2ilfsqrguw().s[0]++, 17);
var b = (cov_2ilfsqrguw().s[1]++, 3);

function fn2(b) {
  cov_2ilfsqrguw().s[2]++;
  console.log(b ? "1" : "2");
}

var data = (cov_2ilfsqrguw().s[3]++, 1);
cov_2ilfsqrguw().s[4]++;

if (!data || typeof data !== "object") {
  cov_2ilfsqrguw().s[5]++;
  console.log("abc");
} else {}

var dd = (cov_2ilfsqrguw().s[6]++, 1);
cov_2ilfsqrguw().s[7]++;

switch (dd) {
  case 3:
    cov_2ilfsqrguw().s[8]++;
    console.log(1);
    cov_2ilfsqrguw().s[9]++;
    break;
    cov_2ilfsqrguw().s[10]++;
    console.log(1);

  default:
    cov_2ilfsqrguw().s[11]++;
    break;
}

cov_2ilfsqrguw().s[12]++;
console.log(fn2(false));