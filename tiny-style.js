var TinyStyle = (function () {
	function render (sheet, ruleset) {
		var css = "\n";
		for (var sel in ruleset) {
			css += sel + " {\n";
			selRules = ruleset[sel];
			for (var rule in selRules) if (selRules[rule])
				css += "	" + rule + ": " + selRules[rule] + ";\n";
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
		ruleset = {};
		sheet = document.createElement("style");
		sheet.type = "text/css";
		document.head.appendChild(sheet);
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
					render(sheet, ruleset);
				}
			};
		};
		select.stylesheet = sheet;
		return select;
	}
	return TinyStyle;
})();
if (typeof module != "undefined")
	module.exports = TinyStyle;