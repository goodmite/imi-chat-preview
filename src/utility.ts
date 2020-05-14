import {$chatBody} from "./dom";

export function getTimeInHHMM(timeMS) {
    const time = timeMS ? new Date(timeMS) : new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function getTimeIn24HrFormat(timeMS) {
    const time = timeMS ? new Date(timeMS) : new Date();
    return time.getHours() + ":" + time.getMinutes();
}

export function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export function updateQueryStringParameter(uri, key, value) {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

export function encodeUrlForDomParser(url) {
    url = url.split("&").join("&amp;");
    return url;
}

export function scrollBodyToBottom() {
    $chatBody.scrollTop = $chatBody.scrollHeight
}

export function convertStringToDom(str: string) {

    var div = document.createElement('div');
    div.innerHTML = str.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    // if (div.children.length === 0) {
    //     return [div.firstChild];
    // }else {
        return div.children;
    // }
}

export function removeInActiveFeedbackPanel($chatbody: HTMLElement) {

    const askFeedbackPanels = $chatbody.querySelectorAll('.msg-bubble-options-panel.temp-div');

    Array.from(askFeedbackPanels).forEach((panel: HTMLElement) => {
        // const isActive = panel && panel.querySelector('.feedback.active');
        // if (!isActive) {
        panel && panel.parentElement.removeChild(panel);
        // }
    })
}

export function showToaster(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerText = message;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export function stopRecording (cb) {

}
export function startRecording (cb) {
/*https://codepen.io/Nishith/pen/ZxGBew*/
    if('webkitSpeechRecognition' in window) {
        var speechRecognizer = new webkitSpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'en-US';
        speechRecognizer.start();

        var finalTranscripts = '';

        speechRecognizer.onresult = function(event) {
            console.log(event);
            var interimTranscripts = '';
            for(var i = event.resultIndex; i < event.results.length; i++){
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                if(event.results[i].isFinal) {
                    finalTranscripts += transcript;
                }else{
                    interimTranscripts += transcript;
                }
            }
            // const innerHTML = finalTranscripts + '<span style="color: #999">' + interimTranscripts + '</span>';
            cb(finalTranscripts || interimTranscripts);
        };
        speechRecognizer.onerror = function (event) {

        };
    }else {
        const innerHTML = 'Your browser is not supported. Please download Google chrome or Update your Google chrome!!';
        alert(innerHTML);
    }
}