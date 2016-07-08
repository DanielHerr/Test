"use strict"

function test(testname = "", testcode = function() {
 throw("TEST NOT IMPLEMENTED")
}) {
 Object.defineProperty(testcode, "name", {
  configurable: true, value: testname
 })
 testcode.status = "running"
 test.tests[testname] = testcode
 test.total = test.total + 1
 test.totalcounter.textContent = test.total
 test.running = test.running + 1
 test.runningcounter.textContent = test.running
 let item = document.createElement("li")
 item.id = testname.split(" ").join("_")
 item.textContent = testname
 test.runninglist.appendChild(item)
 let result, failed
 try {
  result = testcode(function(result) {
   test.pass(testname, result)
  }, function(error) {
   test.fail(testname, error)
  })
 } catch(error) {
  test.fail(testname, error)
  failed = true
 }
 if(testcode.length == 0) {
  if(result && typeof(result.then) == "function") {
   result.then(function(result) {
    test.pass(testname, result)
   }).catch(function(error) {
    test.fail(testname, error)
   })
  } else if(failed != true) {
   test.pass(testname, result)
  }
 } else if(result && typeof(result.catch) == "function") {
  result.catch(function(error) {
   test.fail(testname, error)
}) } }

test.end = function(testname) {
 test.running = test.running - 1
 test.runningcounter.textContent = test.running
 test.runninglist.querySelector("#" + testname.split(" ").join("_")).remove()
}

test.pass = function(testname, result) {
 if(test.tests[testname].status == "running") {
  test.tests[testname].status = "passed"
  test.tests[testname].result = result
  test.end(testname)
  test.passed = test.passed + 1
  test.passedcounter.textContent = test.passed
  let item = document.createElement("li")
  item.id = testname.split(" ").join("_")
  if(result !== undefined) {
   item.textContent = testname + " : " + result
  } else {
   item.textContent = testname
  }
  test.passedlist.appendChild(item)
} }

test.fail = function(testname, error, consoleerror) {
 if(consoleerror != false) {
  console.error(error)
 }
 if(test.tests[testname].status == "running") {
  test.end(testname)
 } else if(test.tests[testname].status == "passed") {
  test.passed = test.passed - 1
  test.passedcounter.textContent = test.passed
  test.passedlist.querySelector("#" + testname.split(" ").join("_")).remove()
 }
 test.tests[testname].status = "failed"
 test.tests[testname].result = error
 test.failed = test.failed + 1
 test.failedcounter.textContent = test.failed
 let item = document.createElement("li")
 item.id = testname.split(" ").join("_")
 item.textContent = testname + " : " + error
 test.failedlist.appendChild(item)
}

test.catch = function(error, file, line, column) {
 let source = test.sources[file]
 let getsource = Promise.resolve(source)
 if(source == null) {
  getsource = fetch(file).then(function(response) {
   return(response.text())
  }).then(function(source) {
   test.sources[file] = source
   return(source)
  }).catch(function() {
   return("")
 }) }
 getsource.then(function(source) {
  if(source && source.includes("test(")) {
   let errorindex = 0
   let lines = source.split("\n")
   for(let lineindex = 0; lineindex <= line; lineindex++) {
    if(lineindex == line) {
     errorindex = errorindex + column
    } else {
     errorindex = errorindex + lines[lineindex].length
   } }
   let testsources = source.split("test(")
   testsources.shift()
   let tests = {}
   for(let testsource of testsources) {
    let stringsymbol = testsource[0]
    let testname = testsource.slice(1, testsource.indexOf(stringsymbol, 1))
    tests[testname] = {}
    tests[testname].start = source.indexOf("test(" + stringsymbol + testname + stringsymbol)
   }
   for(let testname of Object.keys(tests).reverse()) {
    if(errorindex > tests[testname].start) {
     test.fail(testname, error, false)
     break
} } } }) }

test.tests = {}
test.sources = {}

test.total = 0
test.running = 0
test.passed = 0
test.failed = 0

test.totalcounter = document.querySelector("total-tests")
test.runningcounter = document.querySelector("running-total")
test.passedcounter = document.querySelector("passed-total")
test.failedcounter = document.querySelector("failed-total")
test.runninglist = document.querySelector("#running")
test.passedlist = document.querySelector("#passed")
test.failedlist = document.querySelector("#failed")

Array.prototype.toString = function() {
 return(JSON.stringify(this, null, 1))
}
Object.prototype.toString = function() {
 return(JSON.stringify(this, null, 1))
}

self.addEventListener("error", function(event) {
 test.catch(event.error, event.filename, event.lineno, event.colno)
})
self.addEventListener("unhandledrejection", function(event) {
 if(event.reason && event.reason.stack) {
  let location = event.reason.stack.slice(event.reason.stack.lastIndexOf("at") + 3)
  let locationparts = location.split(":")
  let column = locationparts[locationparts.length - 1]
  let line = locationparts[locationparts.length - 2]
  let file = location.slice(0, -(line.length + column.length + 2))
  line = Number(line)
  column = Number(column)
  test.catch(event.reason, file, line, column)
} })

document.currentScript.remove()
if(document.documentElement.createShadowRoot) {
 let shadow = document.documentElement.createShadowRoot()
 let testresults = document.querySelector("test-results")
 testresults.remove()
 let body = document.createElement("body")
 body.appendChild(testresults)
 shadow.appendChild(body)
 shadow.appendChild(document.createElement("content"))
}