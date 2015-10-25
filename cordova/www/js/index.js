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
    var lwords = null,twords = null;
    var searchText;
    var lwordsCount = 0,twordsCount = 0;
    var jsForDataList = false;
    // event handlers
    document.getElementById("searchButton").addEventListener("click", function(e){
        e.preventDefault();
        searchText = searchInput.value;
        search(searchText);
    });
    searchInput.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            searchText = searchInput.value;
            search(searchText);
        }
    });
    document.getElementById("letterBar").addEventListener("click", function(e){
        searchInput.value += e.target.value;
    });
    switcherButton.addEventListener("click", function(e){
        if(switcherButton.value == "Lazca-Türkçe"){
            switcherButton.value = "Türkçe-Lazca";
            if(twords===null){
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
        if(twords===null || lwords.wordlist===null) console.log("can't parse twords");
        twordsCount = twords.wordlist.length;
        insertWordsToDatalist(twords,twordsCount);
    }
    // load LazcaWordList without switcher
    makeHTTPRequest("../data/datalistLazca.json",handleLazcaWordList);
    function handleLazcaWordList (responseText) {
        lwords = JSON.parse(responseText);
        if(lwords===null || lwords.wordlist===null) console.log("can't parse lwords");
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
            option.setAttribute("data-index", i);
            wordsDatalist.appendChild(option);
        }
        if(!Modernizr.datalistelem){
            var options = {
                    minLength: 2,
                    delay: 500,
                    source: words.wordlist
                };
            console.log("Modernizr datalistelem detected");
            if(jsForDataList){
                $(searchInput).autocomplete(options);
            }
            else{
                loadJS("js/jquery-2.1.4.min.js",function(){
                    loadJS("js/jquery-ui.min.js",function(){
                        $(searchInput).autocomplete(options);
                        loadCSS("css/jquery-ui-all.min.css",document.head);
                        jsForDataList = true;
                    },document.body);
                },document.body);
            }
        }
        console.log(wordsCount+" word inserted to datalist");
    }
    function displayDefinition(responseText){
        definition.setAttribute("style", "display:block;");
        // flush
        while(definition.firstChild){
            definition.removeChild(definition.firstChild);
        }
        // insert
        definition.innerHTML = responseText;
    }
    function displayMDefinition(responseText){
        definition.setAttribute("style", "display:block;");
        // insert
        definition.innerHTML += responseText + "<br>";
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
                    console.log("HTTP request: success",URL);
                    handler(httpRequest.responseText);
                } else {
                    console.log('There was a problem with the request.',httpRequest);
                }
            }
        }
    }
    function search(searchText){
        // find the index
        if(searchText==="") return;
        else if(lwords !== null && switcherButton.value=="Lazca-Türkçe"){
            for (var i = 0; i < lwordsCount - 1; i++) { // -1 for "END"
                if(searchText == lwords.wordlist[i]){
                    makeHTTPRequest("../data/Lazca_"+i+".html",displayDefinition);
                    return;
                }
            }
            deepSearch(searchText,true);
        }
        else if(twords !== null && switcherButton.value=="Türkçe-Lazca"){
            for (var j = 0; j < twordsCount - 1; j++) { // -1 for "END"
                if(searchText == twords.wordlist[j]){
                    makeHTTPRequest("../data/Turkce_"+j+".html",displayDefinition);
                    return;
                }
            }
            deepSearch(searchText,false);
        }
    }
    function deepSearch(stext,language){
        // language true: Lazca false: Turkce
        console.log('deep search: '+stext);
        stext = stext.trim();
        var swords = (language) ? lwords : twords;
        var scounter = (language) ? lwordsCount : twordsCount;
        var re = new RegExp("\(^"+stext+"| "+stext+")","gi");
        console.log(re.toString());
        for (var i = 0; i < scounter; i++) {
            if(re.test(swords.wordlist[i])){
                displayDefinition(""); // flush
                if(language) makeHTTPRequest("../data/Lazca_"+i+".html",displayMDefinition);
                else makeHTTPRequest("../data/Turkce_"+i+".html",displayMDefinition);
                return;
            }
        }
        displayDefinition("Bulunamadı... :(");
    }
    // http://stackoverflow.com/a/31374433
    function loadJS(url, implementationCode, location){
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = implementationCode;
        scriptTag.onreadystatechange = implementationCode;
        location.appendChild(scriptTag);
    }
    function loadCSS(url, location){
        var scriptTag = document.createElement('link');
        scriptTag.setAttribute("rel","stylesheet");
        scriptTag.setAttribute("type","text/css");
        scriptTag.setAttribute("href",url);
        location.appendChild(scriptTag);
    }
}