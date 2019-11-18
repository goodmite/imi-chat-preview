import {ESourceType} from "../typings/send-api";
import {convertStringToDom, encodeUrlForDomParser} from "../utility";

export class AudioReply {
    constructor(message){}

    getTemplate(url, source?: ESourceType) {
        url = encodeUrlForDomParser(url);
        const htmlStr = `
                <div class="message-wrapper  message-wrapper-bot" style="width: 100%;">
                    <audio controls="controls" style="width: 95%; max-width: 300px">
                          <source src="${encodeUrlForDomParser(url)}"/>
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `;
        return htmlStr;
    }

    getElement(text, source?: ESourceType) {
        const str = this.getTemplate(text, source);
        return convertStringToDom(str);
    }
}
