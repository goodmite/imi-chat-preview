import {
    $chatBody,
    $chatFooter,
    $chatInput,
    $chatInputIcon,
    $envOptions,
    $langSelect,
    $langSubmit,
    $loader,
    $phoneModel,
    AppendMessageInChatBody, domInit,
    setOptions
} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {ESourceType, IMessageData} from "./typings/send-api";
import {getQueryStringValue, updateQueryStringParameter} from "./utility";
import {data} from "./mock-data";

let isModelShown = false;

export enum modes {
    responsive = "responsive",
    full_screen = "full_screen",
}


document.addEventListener('DOMContentLoaded', async function () {

    initEnvironment();
    const botDetails = await getBotDetails<IBotDetailsApiResp>();
    initEnvironment(botDetails);
    debugger;
    // $chatFooter.classList.add('d-none');
    try {
        $loader && $loader.classList.add('d-none');
        $chatFooter && $chatFooter.classList.remove('d-none');
    } catch (e) {
        console.log(e);
    }

    const imiPreview = new ImiPreview();
    imiPreview.setEventCallback((val)=>{
        humanMessageHandler(val);
        // imiPreview.appendMessageInChatBody([{
        //     sourceType: 'human',
        //     text: val,
        //     time: Date.now()
        // }]);
    });
    const fullBody = true || getQueryStringValue('fullbody') === "true";
    const phoneCasing = true || getQueryStringValue('phonecasing') === "true";
    const brandColor =  getQueryStringValue('brandcolor');
    imiPreview.viewInit('.test-container', fullBody, phoneCasing);
    imiPreview.appendMessageInChatBody(data.generated_msg);
    // const botDetails = {description: "dummy description", logo: "dummy logo", title: "dummy title"};
    // const languageApi =
    const theme = {brandColor: brandColor || 'green', showMenu: false};
    imiPreview.setOptions(botDetails, theme);
    imiPreview.appendMessageInChatBody([{
        sourceType: 'human',
        text: "humanMessage",
        time: Date.now()
    }]);
    initClientEvents();
});


function initClientEvents(){
    try {
        $chatInput.addEventListener('keypress', ($event) => {
            if ($event.key === 'Enter') {
                let humanMessage = $chatInput.value;
                if (!humanMessage || !humanMessage.trim()) {
                    return;
                }
                $chatInput.value = "";
                humanMessageHandler(humanMessage);
            }
        });
    } catch (e) {
        console.log(e)
    }

    try {
        $chatInputIcon.addEventListener('click', () => {
            let humanMessage = $chatInput.value;
            if (!humanMessage || !humanMessage.trim()) {
                return;
            }
            humanMessageHandler(humanMessage);
        });
    } catch (e) {
        console.log(e)
    }
}

async function initApp(imiPreview: ImiPreview) {

    initEvents(imiPreview);
    // environment.bot_access_token = botDetails.bot_access_token;
    // setIntroDetails({description: botDetails.description, logo: botDetails.logo, title: botDetails.name});
    // const messageData: IMessageData[] = [{
    //     sourceType: ESourceType.bot,
    //     'text': botDetails.first_message
    // }];
    // AppendMessageInChatBody(data.generated_msg);
}

class ImiPreview {
    _cb;
    viewInit(selector, fullBody = true, phoneCasing = true) {
        debugger;
        let mainParent = document.querySelector(selector) as HTMLElement;
        mainParent.innerHTML = mainBodyTemplate(fullBody, phoneCasing);
        domInit();
        initApp(this);
    }

    setEventCallback(cb){
        this._cb = cb;
    }

    setOptions(botDetails: { description: string, logo: string, title: string }, theme: { brandColor: string }) {
        setOptions(botDetails);
        initEnvironment(botDetails);
    }

    setTheme(theme: { brandColor: string }) {
        let root = document.documentElement;
        root.style.setProperty('--color-brand', theme.brandColor || 'red');
    }

    appendMessageInChatBody(generated_msg) {
        AppendMessageInChatBody(generated_msg);
    }

    removeAllChatMessages() {
        $chatBody.innerHTML = "";
    }
}

(<any>window).ImiPreview = ImiPreview;


function removeModal() {
    $phoneModel.classList.add('d-none');
    $phoneModel.classList.remove('d-flex');
    $chatBody.classList.remove('bg-opaque');
    $chatFooter.classList.remove('opacity-0');
}


function initEvents(imiPreview: ImiPreview) {

    // document.getElementById('close-modal1').addEventListener('click', ($event) => {
    //     removeModal();
    // });


    console.log($chatBody);
    $chatBody.addEventListener('click', ($event) => {
        const target = $event.target as HTMLElement;

        if(target.hasAttribute('data-payload')){
            imiPreview._cb(target.getAttribute('data-payload'));
            return;
        }

        try {
            removeModal();
        } catch (e) {
            console.log(e);
        }

        try {
            let img = $event.target as HTMLImageElement;
            if (img.classList.contains('click-to-zoom')) {
                /*zoom the div  */
                // Get the modal
                const modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
                const modalImg = document.getElementById("img01") as HTMLImageElement;
                const captionText = document.getElementById("caption");
                // img.onclick = function(){
                modal.style.display = "block";
                modalImg.src = img.src;
                // captionText.innerHTML = this.alt;
                // }

// Get the <span> element that closes the modal
                const span = document.getElementsByClassName("close")[0] as HTMLElement;

// When the user clicks on <span> (x), close the modal
                span.onclick = function () {
                    modal.style.display = "none";
                }
            }

            if (img.classList) {
            }
        } catch (e) {
            console.log(e);
        }

        try {
            if (target.classList.contains('control')) {
                const itemInView = 2;
                const $carasalContainer = findParentWithClass(target, 'carousal-container') as HTMLElement;
                const shouldMoveRight = target.classList.contains('control-right');
                const $carasalInner = $carasalContainer.querySelector('.carousal-container-inner') as HTMLElement;
                const $carasalItemLength = ($carasalContainer.querySelectorAll('.item')).length;
                let dataStep = Number($carasalContainer.getAttribute('data-step'));
                $carasalContainer.classList.remove('hide-left-control');
                $carasalContainer.classList.remove('hide-right-control');
                if ((dataStep < $carasalItemLength - itemInView) && shouldMoveRight) {
                    dataStep++;
                    if (dataStep === ($carasalItemLength - itemInView)) {
                        setTimeout(() => {
                            $carasalContainer.classList.add('hide-right-control');
                        }, 350);
                    }
                } else if ((dataStep > 0) && !shouldMoveRight) {
                    dataStep--;
                    if (dataStep === 0) {
                        setTimeout(() => {
                            $carasalContainer.classList.add('hide-left-control');
                        }, 350);
                    }
                } else {
                    return;
                }

                $carasalContainer.setAttribute('data-step', dataStep.toString());
                const carasalContainerWidth = $carasalContainer.offsetWidth;
                const itemWidth = ($carasalInner.querySelector('.item') as HTMLElement).offsetWidth;
                const base = (itemWidth * 100) / carasalContainerWidth;
                $carasalInner.style.transform = `translateX(${-1 * base * dataStep}%)`;
            }
        } catch (e) {
            console.log(e);
        }


    });
    try {
        $langSubmit.addEventListener('click', ($event) => {
            const lang = $langSelect.value;
            if (lang) {

                let splits = environment.bot_unique_name.split("_");
                splits.pop();
                environment.bot_unique_name = splits.join("_") + '_' + lang;
                let newUrl = updateQueryStringParameter(location.href, "bot_unique_name", environment.bot_unique_name);
                newUrl = updateQueryStringParameter(newUrl, "lang", lang);
                location.href = newUrl;
                initEnvironment();
            }
        });
    } catch (e) {
        console.log(e)
    }


    try {
        $envOptions.addEventListener('click', () => {
            let $phoneView = document.getElementsByClassName('chat-body')[0];
            let $langPanel = $phoneModel.querySelector('.lang-panel') as HTMLElement;
            if (!isModelShown) {
                $phoneView.classList.add('bg-opaque');
                $phoneModel.classList.add('d-flex');
                $phoneModel.classList.remove('d-none');
                $chatFooter.classList.add('opacity-0');
                $langPanel.classList.add('d-flex');
            } else {
                $phoneView.classList.remove('bg-opaque');
                $phoneModel.classList.remove('d-flex');
                $phoneModel.classList.add('d-none');
                $chatFooter.classList.remove('opacity-0');
                $langPanel.classList.remove('d-flex');
            }
            isModelShown = !isModelShown
        });
    } catch (e) {
        console.log(e);
    }


}

async function humanMessageHandler(humanMessage: string) {
    AppendMessageInChatBody([{
        sourceType: ESourceType.human,
        text: humanMessage,
        time: Date.now()
    }]);
    const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
    let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
    AppendMessageInChatBody(messageData);

}

function initEnvironment(botDetails:any = {}) {
    // const lang = getQueryStringValue('lang');
    const lang = botDetails.language || getQueryStringValue('language') || getQueryStringValue('lang') || 'en';

    if (lang === 'ar' || lang === 'rtl') {
        document.body.classList.add('lang-rtl');
        $chatInput.setAttribute("dir", "rtl");
        $chatInput.placeholder = "أكتب السؤال ..";
    }

    environment.bot_access_token = botDetails.bot_access_token;
    environment.logo = botDetails.logo;
    const root = getQueryStringValue('root');
    if (root) {
        if (root === '.') {
            environment.root = "";
        } else {
            environment.root = root + '.';
        }

    }
    const enterprise_unique_name = botDetails.enterprise_unique_name || getQueryStringValue('enterprise_unique_name');
    if (enterprise_unique_name) {
        environment.enterprise_unique_name = enterprise_unique_name;
    }
    const bot_unique_name = botDetails.bot_unique_name || getQueryStringValue('bot_unique_name');
    if (bot_unique_name) {
        environment.bot_unique_name = bot_unique_name;
    }

}

function findParentWithClass($child, className) {
    while ($child) {
        if ($child.classList.contains(className)) {
            return $child;
        }
        $child = $child.parentElement;
    }
}

// initApp().then(_ => console.log('app init success'));
// setTimeout(() => {
//
// }, 2000);


function mainBodyTemplate(fullBody, phoneCasing) {
    let str = "";
    if (fullBody) {
        str = phoneCasing ? getPhoneCoverTemplate() : getFullBodyExceptPhoneCover();
    } else {
        str = `
    <!-- The Modal -->
            <div id="myModal" class="modal2">
                <span class="close">&times;</span>
                <img class="modal-content" id="img01">
                <div id="caption"></div>
            </div>

                <div class="imi-preview-grid-container">

                       
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 6px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        
                    </div>
    
    
    `
    }

    return str;
}

function getModelTemplate() {
    return `
        <div id="myModal" class="modal2">
                <span class="close">&times;</span>
                <img class="modal-content" id="img01">
                <div id="caption"></div>
            </div>
    `;
}


function getChatBodyTemplate() {
    return `
    <div class="imi-preview-grid-container">

                       
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 6px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        
                    </div>
`
}





function getFullBodyExceptPhoneCover() {
    return `
        <div class="imi-preview-grid-container">
                        <div class="header" style="z-index: 1">
                            <div class="bot-intro" id="botIntro">
                                <span class="bot-logo">
                                    <img id="bot-logo"
                                    onerror="this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'" 
                                    src="https://whizkey.ae/wisdom/static/media/rammas.42381205.gif"
                                         alt="">
                                </span>
                                <div class="bot-details">
                                    <div id="bot-title" class="title"></div>
                                    <div id="bot-title" class="title">asdadasd</div>
                                </div>
                                <div class="options" id="env-options">
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                        </div>
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 6px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        <!--chat body ends-->
                        <div class="footer">
                            <input placeholder="Type a message" id="chat-input" dir="ltr" autocomplete="off" autofocus
                                   type="text">
                            <span class="icon" id="chat-input-icon">
                                <span class="fa fa-send"></span>
                            </span>
                        </div>
                    </div>
    
    `
}


function getPhoneCoverTemplate() {
    return `
    <div class="page1">
    <div class="page__content">
        <div class="phone">
            <div class="phone__body">
                <div class="phone__view">
                    <div id="phone-modal" class="modal1" style="">
                        <i class="fa fa-times" id="close-modal1"></i>
                        <div class="lang-panel">
                            <h1>Select language</h1>
                            <div>
                                <select id="lang-select">
                                    <option value="en">English</option>
                                    <option value="ar" style="direction: rtl;">عربي</option>
                                </select>
                            </div>
                            <button class="imi-button-primary" id="lang-submit">Submit</button>
                        </div>
                    </div>
                    <div class="imi-preview-grid-container">

                        <div class="header" style="z-index: 1">
                            <div class="basel-bg"></div>
                            <div class="bot-intro" id="botIntro">
                                <span class="bot-logo">
                                    <img id="bot-logo"
                                    onerror="this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'" 
                                       alt="">
                                </span>
                                <div class="bot-details">
                                    <div id="bot-title" class="title"></div>
                                </div>
                                <div class="options" id="env-options">
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                        </div>
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 6px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        <!--chat body ends-->
                        <div class="footer">
                            <input placeholder="Type a message" id="chat-input" dir="ltr" autocomplete="off" autofocus
                                   type="text">
                            <span class="icon" id="chat-input-icon">
                                <span class="fa fa-send"></span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="phone__notch">
                    <div class="phone__speaker"></div>
                    <div class="phone__camera"></div>
                </div>
            </div>
            <div class="phone__btn">
                <button class="phone__btn--power"></button>
                <div class="phone__btn--volume">
                    <button class="phone__btn--volume-up"></button>
                    <button class="phone__btn--volume-down"></button>
                </div>
                <button class="phone__btn--mute"></button>
            </div>
        </div>
    </div>
</div>
    `;
}


function getHeaderTemplate() {
    return `
    <div class="header" style="z-index: 1">
                            <div class="basel-bg"></div>
                            <div class="bot-intro" id="botIntro">
                                <span class="bot-logo">
                                    <img id="bot-logo" src="https://whizkey.ae/wisdom/static/media/rammas.42381205.gif"
                                         alt="">
                                </span>
                                <div class="bot-details">
                                    <div id="bot-title" class="title"></div>
                                </div>
                                <div class="options" id="env-options">
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                        </div>
    `;
}

function getFooterTemplate() {
    return `
    <div class="footer">
                            <input placeholder="Type a message" id="chat-input" dir="ltr" autocomplete="off" autofocus
                                   type="text">
                            <span class="icon" id="chat-input-icon">
                                <span class="fa fa-send"></span>
                            </span>
                        </div>`
}
