// Generated by CoffeeScript 1.6.3
(function() {
  var assert, removeNode;

  assert = {
    equal: function(x, y) {
      if (x !== y) {
        throw Error("assertion failed: " + x + " does not equal " + y);
      }
    },
    notEqual: function(x, y) {
      if (x === y) {
        throw Error("assertion failed: " + x + " equals " + y);
      }
    },
    "false": function(x) {
      if (x !== false) {
        throw Error("assertion failed: " + x + " should be false");
      }
    },
    "true": function(x) {
      if (x !== true) {
        throw Error("assertion failed: " + x + " should be true");
      }
    },
    defined: function(x) {
      if (x === void 0) {
        throw Error("assertion failed: variable is undefined");
      }
    }
  };

  removeNode = function(node) {
    var _ref;
    return node != null ? (_ref = node.parentNode) != null ? typeof _ref.removeChild === "function" ? _ref.removeChild(node) : void 0 : void 0 : void 0;
  };

  describe('Adding and Removing Stylesheets', function() {
    return describe('Creating and Removing stylesheets from the DOM', function() {
      var countStylesheets, ts1, ts2;
      ts1 = null;
      ts2 = null;
      countStylesheets = function() {
        return document.getElementsByTagName("style").length;
      };
      it('Should allow multiple different stylesheets to be created', function() {
        var before, diff;
        before = countStylesheets();
        ts1 = TinyStyle();
        ts2 = TinyStyle();
        assert.defined(ts1);
        assert.defined(ts2);
        diff = countStylesheets() - before;
        return assert.equal(diff, 2);
      });
      it('Should make style node accessible as ts.stylesheet', function() {
        return assert.equal(ts1.stylesheet.nodeName, "STYLE");
      });
      return it('Should allow removing stylesheets', function() {
        var before, diff;
        before = countStylesheets();
        removeNode(ts1.stylesheet);
        removeNode(ts2.stylesheet);
        diff = countStylesheets() - before;
        return assert.equal(diff, -2);
      });
    });
  });

  describe('Adding and Removing Rules', function() {
    var para, ts;
    ts = null;
    para = document.createElement("p");
    para.className = "para";
    document.body.appendChild(para);
    beforeEach(function() {
      return ts = TinyStyle();
    });
    afterEach(function() {
      return removeNode(ts.stylesheet);
    });
    after(function() {
      return removeNode(para);
    });
    describe('Adding and retrieving rules', function() {
      it('Adding single rules using object syntax', function() {
        ts("body").css({
          color: "blue"
        });
        assert.equal(ts("body").css("color"), "blue");
        return assert.equal(getComputedStyle(document.body).color, "rgb(0, 0, 255)");
      });
      it('Adding multiple rules using object syntax', function() {
        ts("p").css({
          color: "blue",
          "font-weight": "600",
          "font-size": "24px"
        });
        assert.equal(ts("p").css("color"), "blue");
        assert.equal(ts("p").css("font-weight"), "600");
        assert.equal(ts("p").css("font-size"), "24px");
        assert.equal(getComputedStyle(para).color, "rgb(0, 0, 255)");
        assert.equal(getComputedStyle(para).fontWeight, "600");
        return assert.equal(getComputedStyle(para).fontSize, "24px");
      });
      it('Adding single rules using string syntax', function() {
        ts(".para").css("display", "none");
        assert.equal(ts(".para").css("display"), "none");
        return assert.equal(getComputedStyle(para).display, "none");
      });
      it('Rules apply to nodes added after rule added', function() {
        var newPara;
        ts(".para").css("position", "absolute");
        newPara = document.createElement("p");
        newPara.className = "para";
        document.body.appendChild(newPara);
        assert.equal(getComputedStyle(newPara).position, "absolute");
        return removeNode(newPara);
      });
      it('CamelCase and dash syntax are mixable', function() {
        ts("div").css("font-family", "sans-serif");
        ts("a").css({
          paddingLeft: "10em"
        });
        assert.equal(ts("div").css("fontFamily"), "sans-serif");
        return assert.equal(ts("a").css("padding-left"), "10em");
      });
      return it('Querying an undefined rule returns undefined', function() {
        ts("div").css("font-family", "sans-serif");
        assert.equal(ts("div").css("height"), void 0);
        return assert.equal(ts("span").css("font-family"), void 0);
      });
    });
    return describe('Removing rules', function() {
      it('Removing stylesheet should stop rules', function() {
        ts("body").css({
          width: "1000px"
        });
        assert.equal(getComputedStyle(document.body).width, "1000px");
        removeNode(ts.stylesheet);
        return assert.notEqual(getComputedStyle(document.body).width, "1000px");
      });
      return it('Setting to null should stop rules', function() {
        ts(".para").css({
          marginTop: "50px"
        });
        assert.equal(getComputedStyle(para).marginTop, "50px");
        ts(".para").css({
          marginTop: null
        });
        return assert.notEqual(getComputedStyle(para).marginTop, "50px");
      });
    });
  });

}).call(this);