/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        mainFunction();
    }
};

app.initialize();

function mainFunction (){
    var searchInput = document.getElementById("search");
    var definition = document.getElementById("definition");
    var lwords;
    // event handlers
    document.getElementById("searchButton").addEventListener("click", function(e){
        console.log(e);
        // find the index
        var text = searchInput.value;
        if(lwords == null) return;
        for (var i = 0; i < lwords.wordlist.length - 1; i++) { // -1 for "END"
            if(text == lwords.wordlist[i]){
                makeHTTPRequest("../data/Lazca"+i+".html",displayDefinition);
                break;
            } 
        };
    });
    function displayDefinition(responseText){
        definition.setAttribute("style", "display:block;");
        definition.innerHTML = responseText;
    }
    // 
    makeHTTPRequest("../data/datalistLazca.json",handleLazcaWordList);
    // 
    function handleLazcaWordList (responseText) {
        lwords = JSON.parse(responseText);
        for (var i = 0; i < lwords.wordlist.length - 1; i++) { // -1 for "END"
            var option = document.createElement("OPTION");
            option.setAttribute("value",lwords.wordlist[i]);
            document.getElementById("lazcaWords").appendChild(option);
        };
        console.log("LazcaWordList created",lwords.wordlist.length);
    }
    function makeHTTPRequest(URL, handler){
        // https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            console.log('Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = handleResponse;
        httpRequest.open('GET', URL);
        httpRequest.send();
        function handleResponse() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log("HTTP request: success");
                    handler(httpRequest.responseText);
                } else {
                    console.log('There was a problem with the request.',httpRequest);
                }
            }
        }
    }
}