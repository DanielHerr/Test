"use strict"

Array.prototype.toString = function() { 
 return(JSON.stringify(this, null, 1))
}
Object.prototype.toString = function() {
 return(JSON.stringify(this, null, 1))
}

function test(testname = "", testcode = function() {
 throw("TEST NOT IMPLEMENTED")
}) {
 if(typeof(testname) == "function") {
  testcode = testname
  testname = testcode.name
 }
 testname = testname || testcode.name
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
  result = testcode()
 } catch(error) {
  test.fail(testname, error)
  failed = true
 }
 if(result && typeof(result.then) == "function") {
  result.then(function(result) {
   test.pass(testname, result)
  }).catch(function(error) {
   test.fail(testname, error)
  })
 } else if(failed != true) {
  test.pass(testname, result)
} }

test.end = function(testname) {
 test.running = test.running - 1
 test.runningcounter.textContent = test.running
 test.runninglist.querySelector("#" + testname.split(" ").join("_")).remove()
}

test.pass = function(testname, result) {
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
}

test.fail = function(testname, error) {
 test.end(testname)
 test.failed = test.failed + 1
 test.failedcounter.textContent = test.failed
 let item = document.createElement("li")
 item.id = testname.split(" ").join("_")
 item.textContent = testname + " : " + error
 test.failedlist.appendChild(item)
}

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