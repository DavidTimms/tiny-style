var TinyStyle = (function () {

	// get browser-specific requestAnimationFrame function or a fallback for
	// browsers which don't support RAF
	var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || 
		function (func) {
			func();
		};

	// convert CamelCase string to dash-case
	function dashify (s) {
		return s.replace(/([A-Z])/g, function(c){ 
			return "-" + c.toLowerCase();
		});
	}

	// factory function to create stylesheet
	function TinyStyle () {

		// object containing all CSS rules
		var ruleset = {};

		// the stylesheet DOM element
		var sheet = document.createElement("style");
		sheet.type = "text/css";
		document.head.appendChild(sheet);

		// render the ruleset as CSS and inject it into the stylsheet.
		// called using RAF to stop repeat rendering when called repeatedly
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

		// boolean to stop repeated calls to RAF
		var waiting;

		// specify the CSS selector to apply rules to
		function select (sel) {
			return {
				// add rules to the ruleset and request render
				css: function (rules, val) {

					// convert (rule, value) syntax to an object {rule: value}
					if (val) {
						var r = rules;
						rules = {};
						rules[r] = val;
					}
					// retrieving a rule rather than adding
					else if (typeof rules != "object")
						return ruleset[sel] ? ruleset[sel][dashify(rules)] : undefined;
					
					// get or create the object for this CSS selector
					ruleset[sel] = selRules = ruleset[sel] || {};

					// add rules and values to the ruleset
					for (var rule in rules)
						selRules[dashify(rule)] = rules[rule];

					// request render if not already waiting for a render
					if (!waiting) {
						raf(render);
						waiting = true;
					}
				}
			};
		}

		// make the stylesheet node accessible on the root function
		select.stylesheet = sheet;

		// remove the stylesheet from the page if it is on it
		select.remove = function () {
			try {
				document.head.removeChild(sheet);
			} catch (e) {}
		};
		return select;
	}
	return TinyStyle;
})();

// make TinyStyle function available as a module (for use with browserify)
if (typeof module != "undefined")
	module.exports = TinyStyle;