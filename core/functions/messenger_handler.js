const request = require("request");
const EventEmitter = require('eventemitter3');
const fetch = require('node-fetch');
var share = (module.exports = {});
const token =
  "";

share.messageProcess = (userID, message) => {
    /**
     * This is the process of responding...
     * 1. We view the message. Make it feel more human. (1.2 seconds...)
     * 2. We show typing bubbles. (1.2 seconds...)
     * 3. We hide typing bubbles... (0 seconds...)
     * 4. We send message. (0 seconds...)
     */

    let messageData = { text: message };
    request(
      {
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: token },
        method: "POST",
        json: {
          recipient: { id: userID },
          message: messageData
        }
      },
      function(error, response, body) {
        if (error) {
          console.log("Error sending messages: ", error);
        } else if (response.body.error) {
          console.log("Error: ", response.body.error);
        }
      }
    );
     
}

/**
 * Sends a message back to the user, with the provided format.
 * @param {String} userID 
 * @param {String|Array|Message} message 
 * @param {SendMessageOptions} options 
 * @returns {Promise}
 */
share.respond = (recipientId, message, options) => {
  if (typeof message === 'string') {
    return sendTextMessage(recipientId, message, [], options);
  } else if (message && message.text) {
    if (message.quickReplies && message.quickReplies.length > 0) {
      return sendTextMessage(recipientId, message.text, message.quickReplies, options);
    } else if (message.buttons && message.buttons.length > 0) {
      return sendButtonTemplate(recipientId, message.text, message.buttons, options);
    }
  } else if (message && message.attachment) {
    return sendAttachment(recipientId, message.attachment, message.url, message.quickReplies, options);
  } else if (message && message.elements && message.buttons) {
    return sendListTemplate(recipientId, message.elements, message.buttons, options);
  } else if (message && message.cards) {
    return sendGenericTemplate(recipientId, message.cards, options);
  } else if (Array.isArray(message)) {
    return message.reduce((promise, msg) => {
      return promise.then(() => say(recipientId, msg, options));
    }, Promise.resolve());
  }
  console.error('Invalid format for .say() message.');
}

sendTextMessage = (userID, text, quickReplies, options) => {
  console.log("Running this badass")
  const message = { text };
  const formattedQuickReplies = _formatQuickReplies(quickReplies);
  if (formattedQuickReplies && formattedQuickReplies.length > 0) {
    message.quick_replies = formattedQuickReplies;
  }
  return sendMessage(userID, message, options);
}

sendButtonTemplate = (userID, message, buttons, options) => {

}


share.seenMaker = (userID) => {
    request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: token },
      method: "POST",
      json: {
        recipient: { id: userID },
        sender_action: "mark_seen"
      }
    });
}

share.typingMarker = (userID) => {
    request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: token },
      method: "POST",
      json: {
        recipient: { id: userID },
        sender_action: "typing_on"
      }
    });
}


share.setGreetingText = (text) => {
  const greeting =
    typeof text !== "string"
      ? text
      : [
          {
            locale: "default",
            text
          }
        ];
  return sendProfileRequest({ greeting });
};


share.setGetStartedButton = (action)  => {
  const payload = (typeof action === 'string') ? action : 'GET_STARTED';
  if (typeof action === 'function') {
    EventEmitter.on(`postback:${payload}`, action);
  }
  return sendProfileRequest({
    get_started: {
      payload
    }
  });
}

/**
 * All the hidden functions that allow shit to work..
 * These are required for sending messages of different sorts. Such as...
 * - Quick Responses Messages
 * - Button Messages.
 * - Profile requests...
 * etc. Do not touch these...
 */

sendMessage = (userID, message, options) => {
  const recipient = _createRecipient(userID);
  const messagingType = options && options.messagingType;
  const notificationType = options && options.notificationType;
  const tag = options && options.tag;
  const onDelivery = options && options.onDelivery;
  const onRead = options && options.onRead;
  const reqBody = {
    recipient,
    message,
    messaging_type: messagingType || 'RESPONSE'
  };

  // There are optional params, only add them to the request body
  // if they are definied.
  if (notificationType) {
    reqBody.notification_type = notificationType
  }
  if (tag) {
    reqBody.tag = tag
  }

  const req = () => (
    sendRequest(reqBody).then((json) => {
      if (typeof onDelivery === 'function') {
        EventEmitter.once('delivery', onDelivery);
      }
      if (typeof onRead === 'function') {
        EventEmitter.once('read', onRead);
      }
      return json;
    })
  );
  if (options && options.typing) {
    const autoTimeout = (message && message.text) ? message.text.length * 10 : 1000;
    const timeout = (typeof options.typing === 'number') ? options.typing : autoTimeout;
    return sendTypingIndicator(userID, timeout).then(req);
  }
  return req();
}

sendTypingIndicator = (recipientId, milliseconds) => {
  const timeout = isNaN(milliseconds) ? 0 : milliseconds;
  if (milliseconds > 20000) {
    milliseconds = 20000;
    console.error('sendTypingIndicator: max milliseconds value is 20000 (20 seconds)');
  }
  return new Promise((resolve, reject) => {
    return sendAction(recipientId, 'typing_on').then(() => {
      setTimeout(() => sendAction(recipientId, 'typing_off').then((json) => resolve(json)), timeout);
    });
  });
}

sendAction = (recipientId, action, options) => {
  const recipient = _createRecipient(recipientId);
  return sendRequest({
    recipient,
    sender_action: action
  });
}

sendRequest = (body, endpoint, method) => {
  endpoint = endpoint || 'messages';
  method = method || 'POST';
  return fetch(`https://graph.facebook.com/v2.6/me/${endpoint}?access_token=${token}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        console.log('Messenger Error received. For more information about error codes, see: https://goo.gl/d76uvB');
        console.log(res.error);
      }
      return res;
    })
    .catch(err => console.log(`Error sending message: ${err}`));
}

sendProfileRequest = (body, method) => {
  return sendRequest(body, 'messenger_profile', method);
}

_getUserProfile = (userID) => {
  const url = `https://graph.facebook.com/v2.6/${userID}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${token}`;
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.log(`Error getting user profile: ${err}`));
}

_createRecipient = (recipient) => {
  return (typeof recipient === 'object') ? recipient : { id: recipient };
}

_formatQuickReplies = (quickReplies) => {
  return quickReplies && quickReplies.map((reply) => {
    if (typeof reply === 'string') {
      return {
        content_type: 'text',
        title: reply,
        payload: 'QuickR_' + normalizeString(reply)
      };
    } else if (reply && reply.title) {
      return Object.assign({
        content_type: 'text',
        payload: 'QuickR_' + normalizeString(reply.title)
      }, reply);
    }
    return reply;
  });
}

normalizeString = (str) => {
  return str.replace(/[^a-zA-Z0-9]+/g, "").toUpperCase();
}