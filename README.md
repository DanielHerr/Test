# Test
Tests functions. Throw an error or return a value, use the pass and fail function arguments, or fullfill or reject a promise.

Usage:
```
test("test 1", function() {
 return(undefined) 
})

test(function test_2() {
 throw(new Error("error") )
})

test(function test_3() {
 return(new Promise(function(pass, fail) {
  fail(new Error("error") )
})) })

test("test 4", function(pass, fail) {
 pass("result")
})

test(function test_5(pass, fail) {
 fail(new Error("error"))
})

test(async function test_6() {
 return("result")
})
```
Result:

5 tests total<br>
0 tests running<br>
3 tests passed<br>
3 tests failed<br>

Tests failed:
<ol>
<li>test_2 : Error: error</li>
<li>test_5 : Error: error</li>
<li>test_3 : Error: error</li>
</ol>
Tests passed:
<ol>
<li>test 1</li>
<li>test 4 : result</li>
<li>test_6 : result</li>
</ol>
Tests running:
<ol></ol>
