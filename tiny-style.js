var TinyStyle = (function () {
	var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || 
		function (func) {
			func();
		};
	function dashify (s) {
		return s.replace(/([A-Z])/g, function(c){ 
			return "-" + c.toLowerCase();
		});
	}
	function TinyStyle () {
		var ruleset = {};
		var sheet = document.createElement("style");
		sheet.type = "text/css";
		document.head.appendChild(sheet);
		function render () {
			waiting = false;
			var css = "\n";
			for (var sel in ruleset) {
				css += sel + " {\n";
				selRules = ruleset[sel];
				for (var rule in selRules) if (selRules[rule])
				css += "  " + rule + ": " + selRules[rule] + ";\n";
				css += "}\n";
			}
			sheet.innerHTML = css;
		}
		var waiting;
		function select (sel) {
			return {
				css: function (rules, val) {
					if (val) {
						var r = rules;
						rules = {};
						rules[r] = val;
					}
					else if (typeof rules != "object")
						return ruleset[sel] ? ruleset[sel][dashify(rules)] : undefined;
					ruleset[sel] = selRules = ruleset[sel] || {};
					for (var rule in rules)
						selRules[dashify(rule)] = rules[rule];
					if (!waiting) {
						raf(render);
						waiting = true;
					}
				}
			};
		}
		select.stylesheet = sheet;
		select.remove = function () {
			try {
				document.head.removeChild(sheet);
			} catch (e) {}
		};
		return select;
	}
	return TinyStyle;
})();
if (typeof module != "undefined")
	module.exports = TinyStyle;