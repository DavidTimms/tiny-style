var TinyStyle = (function () {
	var tsCount = 1;
	function render (sheet, ruleset) {
		var css = "\n";
		for (var sel in ruleset) {
			css += sel + " {\n";
			selRules = ruleset[sel];
			for (var rule in selRules) {
				css += "	" + rule + ": " + selRules[rule] + ";\n";
			}
			css += "}\n";
		}
		sheet.innerHTML = css;
	}
	function dashify (s) {
		return s.replace(/([A-Z])/g, function(c){ 
			return "-" + c.toLowerCase();
		});
	}
	function TinyStyle () {
		var sheet = document.createElement("style");
		sheet.id = "tiny-style-" + tsCount++;
		sheet.type = "text/css";
		document.head.appendChild(sheet);
		ruleset = {};
		return function (sel) {
			return {
				css: function (rules, val) {
					if (val) {
						var r = rules;
						rules = {};
						rules[r] = val;
					}
					else if (typeof rules != "object")
						return ruleset[sel][rules];
					ruleset[sel] = selRules = ruleset[sel] || {};
					for (var rule in rules)
						selRules[dashify(rule)] = rules[rule];
					render(sheet, ruleset);
				}
			};
		};
	}
	return TinyStyle;
})();
if (typeof module != "undefined")
	module.exports = TinyStyle;