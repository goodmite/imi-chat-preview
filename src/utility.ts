import {$chatBody} from "./dom";

export function getTimeInHHMM(timeMS) {
    const time = timeMS? new Date(timeMS) :new Date();
    return (("0" + time.getHours()).slice(-2)   + ":" + ("0" + time.getMinutes()).slice(-2));
}

export function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export function updateQueryStringParameter(uri, key, value) {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
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

    const el = document.createElement('template');
    // const el = document.createElement('DIV');
    el.innerHTML = str;
    let x = el.content.children;
    console.log(x);
    return x;
}

export function removeInActiveFeedbackPanel($chatbody: HTMLElement) {
    debugger;
    const askFeedbackPanels = $chatBody.getElementsByClassName('msg-bubble-options-panel');
    Array.from(askFeedbackPanels).forEach((panel: HTMLElement)=>{
        const isActive = panel && panel.querySelector('.feedback.active');
        if (!isActive) {
            panel && panel.parentElement.removeChild(panel);
        }
    })
}
