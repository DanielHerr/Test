# Test
Tests functions. Throw an error or reject a returned promise to fail a test.

Usage:
```
test("test name", function() {
 return("result") 
})

test(function testname() {
 throw(new Error("error") )
})

test(function testname() {
 return(new Promise(pass, fail) {
  fail(new Error("error") )
})) })

test("test name", async function() {
 return("result)
})

```
