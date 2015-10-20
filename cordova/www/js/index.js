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
    // variables
    var searchInput = document.getElementById("search");
    var definition = document.getElementById("definition");
    var lwords,twords;
    var searchText,switcherButton;
    var lwordsCount = 0,twordsCount = 0;
    var turkceWordsDatalist = document.getElementById("turkceWords");
    var lazcaWordsDatalist = document.getElementById("lazcaWords");
    // event handlers
    document.getElementById("searchButton").addEventListener("click", function(e){
        // find the index
        searchText = searchInput.value;
        if(lwords == null) return;
        for (var i = 0; i < lwords.wordlist.length - 1; i++) { // -1 for "END"
            if(searchText == lwords.wordlist[i]){
                makeHTTPRequest("../data/Lazca"+i+".html",displayDefinition);
                break;
            } 
        };
    });
    document.getElementById("letterButtons").addEventListener("click", function(e){
        searchInput.value += e.target.value;
    });
    document.getElementById("switcher").addEventListener("click", function(e){
        switcherButton = e.target;
        if(switcherButton.value == "Türkçe-Lazca"){
            switcherButton.value = "Lazca-Türkçe";
            if(twords==null) makeHTTPRequest("../data/datalistTurkce.json",handleTurkceWordList);
            searchInput.setAttribute("list", "turkceWords");
        }
        else{
            switcherButton.value = "Türkçe-Lazca";
            searchInput.setAttribute("list", "lazcaWords");   
        }
    });
    // functions
    function handleTurkceWordList(responseText){
        twords = JSON.parse(responseText);
        if(twords==null || lwords.wordlist==null) console.log("can't parse twords");
        twordsCount = lwords.wordlist.length;
        for (var i = 0; i < twordsCount - 1; i++) { // -1 for "END"
            var option = document.createElement("OPTION");
            option.setAttribute("value",lwords.wordlist[i]);
            turkceWordsDatalist.appendChild(option);
        };
        console.log("TurkceWordList created",twordsCount);
    }
    // load LazcaWordList without switcher
    makeHTTPRequest("../data/datalistLazca.json",handleLazcaWordList);
    function handleLazcaWordList (responseText) {
        lwords = JSON.parse(responseText);
        lwordsCount = lwords.wordlist.length;
        for (var i = 0; i < lwordsCount - 1; i++) { // -1 for "END"
            var option = document.createElement("OPTION");
            option.setAttribute("value",lwords.wordlist[i]);
            lazcaWordsDatalist.appendChild(option);
        };
        console.log("LazcaWordList created",lwordsCount);
    }
    function displayDefinition(responseText){
        definition.setAttribute("style", "display:block;");
        definition.innerHTML = responseText;
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