var TinyStyle = (function () {
	function render (sheet, ruleset, sel, renderCache) {
		var selStr = sel + " {\n";
		var selRules = ruleset[sel];
		for (var rule in selRules) if (selRules[rule])
			selStr += "	" + rule + ": " + selRules[rule] + ";\n";
		selStr += "}\n";
		renderCache[sel] = selStr;
		var css = "\n";
		for (var s in renderCache)
			css += renderCache[s];
		sheet.innerHTML = css;
	}
	function dashify (s) {
		return s.replace(/([A-Z])/g, function(c){ 
			return "-" + c.toLowerCase();
		});
	}
	function TinyStyle () {
		ruleset = {};
		renderCache = {};
		var sheet = document.createElement("style");
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
					render(sheet, ruleset, sel, renderCache);
				}
			};
		};
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