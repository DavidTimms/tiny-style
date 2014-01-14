TinyStyle
==========

A tiny (less than 1KB) JavaScript library for creating and manipulating stylesheets, with a similar API to jQuery. TinyStyle injects a &lt;style&gt; tag into the head of the page and generates CSS to fill it. This means you don't have to modify page elements directly, and the rules you define apply to new elements inserted into the page later. Performance is optimised on modern browsers using [requestAnimationFrame](https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame) to avoid excessive repainting of the page.

TinyStyle can be included in a normal &lt;script&gt; tag or required using [browserify](http://browserify.org/).

Start by creating a stylesheet:

    var ts = TinyStyle();
    
Then add rules in the same way you would change CSS properties using jQuery.

You can specify a rule and a value as two strings:

    ts("body").css("width", "400px");

You can specify multiple rules as an object:

    ts("p").css({
        color: "red",
        fontWeight: "bold",
        border: "1px solid black"
    });

You can use CamelCase or dash-case for rule names:

    ts(".active").css({fontSize: "18px"});
    ts("a:link").css({"text-decoration": "none"});

Calling .css() with just a rule name returns its value:

    ts("#banner").css({padding: "30px"});
    ts("#banner").css("padding"); // returns "30px"

The stylesheet element which TinyStyle created can be accessed direction using the stylesheet property:

    ts.stylesheet;

You can call remove() to destroy the stylesheet.

    ts.remove();

That's it!