import {IGeneratedMessageItem, IMessageData} from "./typings/send-api";

declare var IMI: any;
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import {serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";

export function initializeIMIConnect(previewBot: IBotDetailsApiResp, currentRoomId: number, startNewChatData: any, imiPreview) {

    try {
        IMI.IMIconnect.shutdown();
    } catch (e) {
        console.log(e);
    }

    // this.currentPreviewBot = previewBot;
    /*TODO: make initialization happen only once*/
    let imiConnectIntegrationDetails;
    try {
        imiConnectIntegrationDetails = previewBot.integrations.fulfillment_provider_details.imiconnect;
        if (!imiConnectIntegrationDetails.enabled || !imiConnectIntegrationDetails.send_via_connect) {

            return;
        }
    } catch (e) {
        return;
    }
    const appId = imiConnectIntegrationDetails.appId; // 'GS23064017';
    const appSecret = imiConnectIntegrationDetails.appSecret; // 'uZi6B5Zg';
    // var streamName = "bot";
    const serviceKey = imiConnectIntegrationDetails.serviceKey; // '3b8f6470-5e56-11e8-bf0b-0213261164bb';//'f6e50f7b-2bfd-11e8-bf0b-0213261164bb';
    // let userId = currentRoomId + '_hellothisissandeep1231312';
    let userId;
    if (startNewChatData && startNewChatData.consumerDetails) {
        userId = startNewChatData.consumerDetails.uid;
    }

    // startNewChatData.consumerDetails.uid
    const config = new IMI.ICConfig(appId, appSecret);
    const messaging = IMI.ICMessaging.getInstance();
    window.messaging = messaging;

    console.info('========initializing connection with imiconnect with following details');
    console.log(
        'appId= ' + appId + '\n' +
        'appSecret= ' + appSecret + '\n' +
        'serviceKey= ' + serviceKey + '\n' +
        'userId= ' + userId + '\n');


    const prepareMessage = (messageObj) => {
        debugger;
        console.info('============================message from IMICONNECT Has been recieved============================', messageObj);
        const generatedMessagesStr = messageObj.message;
        let generatedMessages: IGeneratedMessageItem[];
        try {
            generatedMessages = JSON.parse(generatedMessagesStr);
        } catch (e) {
            console.error('Unable to parse json from IMIConnect callback', generatedMessagesStr);
            console.error('Assuming its a string');
            generatedMessages = [{text: generatedMessagesStr, bot_message_id: null}];
            if (!generatedMessagesStr) {
                return;
            }
        }
        const serializedMessages: IMessageData[] = serializeGeneratedMessagesToPreviewMessages(generatedMessages, null);
        imiPreview.appendMessageInChatBody(serializedMessages);
        // this.store.dispatch([
        //     new AddMessagesToRoomByRoomId({
        //         id: currentRoomId,
        //         messageList: serializedMessages
        //     }),
        //     new ChangeBotIsThinkingDisplayByRoomId({roomId: currentRoomId, shouldShowBotIsThinking: false}),
        //     // new SetCurrentRoomID({roomId: 123456789.room.roomId})
        // ]);
    };

    const msgCallBack = {// messaging.setICMessagingReceiver(msgCallBack);
        onConnectionStatusChanged: function (statuscode) {
            let statusMessage = null;
            if (statuscode === 2) {
                statusMessage = 'Connected';
            } else if (statuscode === 6) {
                statusMessage = 'Error while connecting';
            } else {
                statusMessage = 'Not Connected';
            }
        },
        onMessageReceived: function (message) {
            prepareMessage(message);
            if (message.getType() === IMI.ICMessageType.Message) {
                const callback = {
                    onFailure: function (err) {
                        // handleFailure(err);
                    }
                };
                messaging.setMessageAsRead(message.getTransactionId(), callback);
            }
        }
    };
    messaging.setICMessagingReceiver(msgCallBack);
    const deviceId = IMI.ICDeviceProfile.getDefaultDeviceId();
    IMI.IMIconnect.startup(config);
    // unregister();
    IMI.IMIconnect.registerListener(
        {
            onFailure: function () {
                console.log('token got expired...');
            }
        });


    const regcallback = {
        onSuccess: function (msg) {

            try {
                messaging.connect();
                console.log('onSuccess: reg');
            } catch (ex) {
                console.log(ex);
            }

        },
        onFailure: function (err) {
            console.log('Registration failed');

        }
    };
    // unregister();
    const deviceProfile = new IMI.ICDeviceProfile(deviceId, userId);
    console.log('IMI.IMIconnect.isRegistered()' + IMI.IMIconnect.isRegistered());
    setTimeout(() => {
        IMI.IMIconnect.register(deviceProfile, regcallback);
        this.messaging = messaging;
    }, 1000);

    // window.addEventListener('onbeforeunload', () => {
    //
    // })

    var myEvent = window.attachEvent || window.addEventListener;
    var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable
    // myEvent(chkevent, function(e) { // For >=IE7, Chrome, Firefox
    //     unregister();
    //     alert();
    //     return "hello this is test";
    // });

}

function unregister() {
    localStorage.clear()
    try {
        if (IMI.IMIconnect.isRegistered()) {
            IMI.IMIconnect.unregister((data) => {
                console.log("IMI.IMIconnect.unregister", data);
            });
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * There are two methods used:
 * 1. initializeIMIConnect: to create connection (when page loads)
 * 2. sendHumanMessageViaImiConnect: to send message when user types keyword and presses enter
 * */

export function sendHumanMessageViaImiConnect(currentRoom, currentBot: IBot, messageByHuman: string) {

    let streamName: string; // 'gsureg';
    try {
        streamName = currentBot.integrations.fulfillment_provider_details.imiconnect.streamName;
    } catch (e) {
        console.log(e);
    }
    // this.currentRoom = currentRoom;
    // send message
    const pubcallback = {
        onSuccess: function () {
            console.log('message sent');

        },
        onFailure: function (errormsg) {
            console.log('failed to send message');
        }

    };

    const message = new IMI.ICMessage();
    message.setMessage(messageByHuman);

    const thread = new IMI.ICThread();
    thread.setId('bot');
    thread.setTitle('bot');
    thread.setStreamName(streamName);

    message.setThread(thread);
    this.messaging.publishMessage(message, pubcallback);
}