assert = 
	equal: (x, y) ->
		if x != y
			throw Error("assertion failed: #{x} does not equal #{y}")
	notEqual: (x, y) ->
		if x == y
			throw Error("assertion failed: #{x} equals #{y}")
	false: (x) ->
		if x != false
			throw Error("assertion failed: #{x} should be false")
	true: (x) ->
		if x != true
			throw Error("assertion failed: #{x} should be true")
	defined: (x) ->
		if x == undefined
			throw Error("assertion failed: variable is undefined")

removeNode = (node) ->
	node?.parentNode?.removeChild?(node)

describe 'Adding and Removing Stylesheets', ->
	describe 'Creating and Removing stylesheets from the DOM', ->
		ts1 = null;
		ts2 = null;
		countStylesheets = ->
			 document.getElementsByTagName("style").length
		it 'Should allow multiple different stylesheets to be created', ->
			before = countStylesheets()
			ts1 = TinyStyle()
			ts2 = TinyStyle()
			assert.defined(ts1)
			assert.defined(ts2)
			diff = countStylesheets() - before
			assert.equal(diff, 2)
		it 'Should make style node accessible as ts.stylesheet', ->
			assert.equal(ts1.stylesheet.nodeName, "STYLE")
		it 'Should allow removing stylesheets', ->
			before = countStylesheets()
			removeNode(ts1.stylesheet)
			removeNode(ts2.stylesheet)
			diff = countStylesheets() - before
			assert.equal(diff, -2)

describe 'Adding and Removing Rules', ->
	ts = null
	para = document.createElement("p")
	para.className = "para"
	document.body.appendChild(para)
	beforeEach ->
		ts = TinyStyle()
	afterEach ->
		removeNode(ts.stylesheet)
	after ->
		removeNode(para)

	describe 'Adding and retrieving rules', ->
		it 'Adding single rules using object syntax', ->
			# Add rule
			ts("body").css({color: "blue"})
			# Check internally
			assert.equal(ts("body").css("color"), "blue")
			# Check in the DOM
			assert.equal(getComputedStyle(document.body).color, "rgb(0, 0, 255)")
		it 'Adding multiple rules using object syntax', ->
			# Add rules
			ts("p").css
				color: "blue"
				"font-weight": "600"
				"font-size": "24px"
			# Check internally
			assert.equal(ts("p").css("color"), "blue")
			assert.equal(ts("p").css("font-weight"), "600")
			assert.equal(ts("p").css("font-size"), "24px")
			# Check in the DOM
			assert.equal(getComputedStyle(para).color, "rgb(0, 0, 255)")
			assert.equal(getComputedStyle(para).fontWeight, "600")
			assert.equal(getComputedStyle(para).fontSize, "24px")

		it 'Adding single rules using string syntax', ->
			# Add rule
			ts(".para").css("display", "none")
			# Check internally
			assert.equal(ts(".para").css("display"), "none")
			# Check in the DOM
			assert.equal(getComputedStyle(para).display, "none")

		it 'Rules apply to nodes added after rule added', ->
			# Add rule
			ts(".para").css("position", "absolute")
			# Add new paragraph
			newPara = document.createElement("p")
			newPara.className = "para"
			document.body.appendChild(newPara)
			# Check that the rule applies to the new paragraph
			assert.equal(getComputedStyle(newPara).position, "absolute")
			removeNode(newPara)

		it 'CamelCase and dash syntax are mixable', ->
			ts("div").css("font-family", "sans-serif")
			ts("a").css({paddingLeft: "10em"})
			assert.equal(ts("div").css("fontFamily"), "sans-serif")
			assert.equal(ts("a").css("padding-left"), "10em")

		it 'Querying an undefined rule returns undefined', ->
			ts("div").css("font-family", "sans-serif")
			assert.equal(ts("div").css("height"), undefined)
			assert.equal(ts("span").css("font-family"), undefined)

	describe 'Removing rules', ->
		it 'Removing stylesheet should stop rules', ->
			ts("body").css({width: "1000px"})
			assert.equal(getComputedStyle(document.body).width, "1000px")
			removeNode(ts.stylesheet)
			assert.notEqual(getComputedStyle(document.body).width, "1000px")

		it 'Setting to null should stop rules', ->
			ts(".para").css({marginTop: "50px"})
			assert.equal(getComputedStyle(para).marginTop, "50px")
			ts(".para").css({marginTop: null})
			assert.notEqual(getComputedStyle(para).marginTop, "50px")
