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
    var switcherButton = document.getElementById("switcher");
    var wordsDatalist = document.getElementById("words");
    var lwords,twords;
    var searchText;
    var lwordsCount = 0,twordsCount = 0;
    // event handlers
    document.getElementById("searchButton").addEventListener("click", function(e){
        // find the index
        searchText = searchInput.value;
        if(lwords != null && switcherButton.value=="Lazca-Türkçe"){
            for (var i = 0; i < lwordsCount - 1; i++) { // -1 for "END"
                if(searchText == lwords.wordlist[i]){
                    makeHTTPRequest("../data/Lazca"+i+".html",displayDefinition);
                    break;
                }
                displayDefinition("Sonuç bulunamadi... :(");
            };
        }
        if(twords != null && switcherButton.value=="Türkçe-Lazca"){
            for (var i = 0; i < twordsCount - 1; i++) { // -1 for "END"
                if(searchText == twords.wordlist[i]){
                    makeHTTPRequest("../data/Turkce"+i+".html",displayDefinition);
                    break;
                }
                displayDefinition("Sonuç bulunamadi... :(");
            };
        }
    });
    document.getElementById("letterButtons").addEventListener("click", function(e){
        searchInput.value += e.target.value;
    });
    switcherButton.addEventListener("click", function(e){
        if(switcherButton.value == "Lazca-Türkçe"){
            switcherButton.value = "Türkçe-Lazca";
            if(twords==null){
                makeHTTPRequest("../data/datalistTurkce.json",handleTurkceWordList);  
                return;
            }
            insertWordsToDatalist(twords,twordsCount);
        }
        else{
            switcherButton.value = "Lazca-Türkçe";
            insertWordsToDatalist(lwords,lwordsCount);
        }
    });
    // functions
    function handleTurkceWordList(responseText){
        twords = JSON.parse(responseText);
        if(twords==null || lwords.wordlist==null) console.log("can't parse twords");
        twordsCount = lwords.wordlist.length;
        insertWordsToDatalist(twords,twordsCount);
    }
    // load LazcaWordList without switcher
    makeHTTPRequest("../data/datalistLazca.json",handleLazcaWordList);
    function handleLazcaWordList (responseText) {
        lwords = JSON.parse(responseText);
        if(lwords==null || lwords.wordlist==null) console.log("can't parse lwords");
        lwordsCount = lwords.wordlist.length;
        insertWordsToDatalist(lwords,lwordsCount);
    }
    function insertWordsToDatalist(words,wordsCount){
        // flush
        while(wordsDatalist.firstChild){
            wordsDatalist.removeChild(wordsDatalist.firstChild);
        }
        // insert
        for (var i = 0; i < wordsCount - 1; i++) { // -1 for "END"
            var option = document.createElement("OPTION");
            option.setAttribute("value",words.wordlist[i]);
            wordsDatalist.appendChild(option);
        };
        console.log(wordsCount+" word inserted to datalist");
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