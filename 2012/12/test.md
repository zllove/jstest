this popup layer is also good: [DOMWindowDemo](http://swip.codylindley.com/DOMWindowDemo.html).

call is just as this of conversion, not the implementation of the function process have big change.

        var hello = 'hello',
            word = 'world';
        var snippet = function () {
          alert ( this.hello + this.word );
        };

        var p = {
            hello: 'jikey',
            word: 30
        }
        var p2 = function(){ this.hello = 'hello'; }
        console.log(snippet.call());
        console.log(snippet.call(p));
        console.log(snippet.call(new p2()));
This means: snippet this pointed to the p, and then call the snippet

     var jikey = {
        name : 'jikey',
        age  : 30,
        study: 'css,js,jq'
     }