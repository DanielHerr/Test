"use strict"

function test(testname = "", testcode = function() {
 throw("TEST NOT IMPLEMENTED")
}) {
 test.prepareresults().then(function() {
  Object.defineProperty(testcode, "name", {
   configurable: true, value: testname
  })
  testcode.status = "running"
  test.tests[testname] = testcode
  test.total = test.total + 1
  test.totalcounter.textContent = test.total
  test.running = test.running + 1
  test.runningcounter.textContent = test.running
  let item = test.results.document.createElement("li")
  item.id = testname.split(" ").join("_")
  item.textContent = testname
  test.runninglist.appendChild(item)
  test.setpadding("running")
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
}) } }) }

test.end = function(testname) {
 test.running = test.running - 1
 test.runningcounter.textContent = test.running
 test.runninglist.querySelector("#" + testname.split(" ").join("_")).remove()
 test.setpadding("running")
}

test.pass = function(testname, result) {
 if(test.tests[testname].status == "running") {
  test.tests[testname].status = "passed"
  test.tests[testname].result = result
  test.end(testname)
  test.passed = test.passed + 1
  test.passedcounter.textContent = test.passed
  let item = test.results.document.createElement("li")
  item.id = testname.split(" ").join("_")
  if(result !== undefined) {
   item.textContent = testname + " : " + result
  } else {
   item.textContent = testname
  }
  test.passedlist.appendChild(item)
  test.setpadding("passed")
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
  test.setpadding("passed")
 }
 test.tests[testname].status = "failed"
 test.tests[testname].result = error
 test.failed = test.failed + 1
 test.failedcounter.textContent = test.failed
 let item = test.results.document.createElement("li")
 item.id = testname.split(" ").join("_")
 item.textContent = testname + " : " + error
 test.failedlist.appendChild(item)
 test.setpadding("failed")
}

test.catch = function(error, file, line, column) {
 let source = test.sources[file]
 let getsource = Promise.resolve(source)
 if(source == null) {
  getsource = fetch(file).then(function(response) {
   if(response.ok) {
    return(response.text())
   } else {
    throw(new Error(response.statusText))
   }
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

test.setpadding = function(list) {
 let item = test.results.document.createElement("li")
 item.textContent = test[list + "list"].children.length + "."
 item.style.display = "inline-block"
 item.style.visibility = "hidden"
 test.results.document.body.appendChild(item)
 test[list + "list"].style.paddingLeft = item.clientWidth + 4 + "px"
 item.remove()
}

test.prepareresults = function() {
 return(new Promise(function(resolver) {
  if(test.prepareresults.done) {
   resolver()
  } else {
   if(test.prepareresults.resolvers == null) {
    test.prepareresults.resolvers = []
   }
   test.prepareresults.resolvers.push(resolver)
} })) }

test.mainscript = document.currentScript
test.mainscript.remove()
test.testsscript = document.querySelector('script[src="tests.js"]')
if(test.testsscript) {
 test.testsscript.remove()
}

test.tests = {}
test.sources = {}

test.total = 0
test.running = 0
test.passed = 0
test.failed = 0

Array.prototype.toString = function() {
 return(JSON.stringify(this, null, 1))
}
Object.prototype.toString = function() {
 return(JSON.stringify(this, null, 1))
}

fetch("test.html").then(function(response) {
 if(response.ok) {
  return(response)
 } else {
  throw(new Error(response.statusText))
 }
}).catch(function() {
 return(fetch("https://danielherr.github.io/Test/test.html").then(function(response) {
  if(response.ok) {
   return(response)
  } else {
   throw(new Error(response.statusText))
 } }))
}).then(function(response) {
 return(response.text())
}).then(function(text) {
 return(new Promise(function(resolve, reject) {
  if(self.chrome && self.chrome.app && self.chrome.app.window) {
   chrome.app.window.create("manifest.json", { state: "maximized" }, function(newview) {
    if(chrome.runtime.lastError) {
     reject(new Error(chrome.runtime.lastError.message))
    } else {
     let resultsview = newview.contentWindow
     resultsview.document.documentElement.remove()
     let doctype = resultsview.document.implementation.createDocumentType("html", "", "")
     resultsview.document.appendChild(doctype)
     resolve(resultsview)
   } })
  } else {
   let resultsview = open()
   resultsview.document.documentElement.remove()
   let doctype = resultsview.document.implementation.createDocumentType("html", "", "")
   resultsview.document.appendChild(doctype)
   resolve(resultsview)
 } }).then(function(resultsview) {
  let resultselements = new DOMParser().parseFromString(text, "text/html")
  resultsview.document.appendChild(resultselements.documentElement)
  resultsview.document.head.insertBefore(test.mainscript, resultsview.document.head.children[1])
  if(self.chrome && self.chrome.app && self.chrome.app.window) {
   let stylesheet = resultsview.document.createElement("style")
   stylesheet.textContent = "html, body { font-size: 100%; overflow: auto; }"
   resultsview.document.head.appendChild(stylesheet)
  }
  if(test.testsscript) {
   resultsview.document.head.appendChild(test.testsscript)
  }
  resultsview.document.title = "Test Results: " + (document.title || document.URL)
  test.results = resultsview
  test.totalcounter = resultsview.document.querySelector("total-tests")
  test.runningcounter = resultsview.document.querySelector("running-total")
  test.passedcounter = resultsview.document.querySelector("passed-total")
  test.failedcounter = resultsview.document.querySelector("failed-total")
  test.runninglist = resultsview.document.querySelector("#running")
  test.passedlist = resultsview.document.querySelector("#passed")
  test.failedlist = resultsview.document.querySelector("#failed")

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
  test.prepareresults.done = true
  for(let resolver of test.prepareresults.resolvers || []) {
   resolver()
 } }))
}).catch(function(error) {
 console.error(error)
 document.body.textContent = "Unable to load test results HTML: " + error
})