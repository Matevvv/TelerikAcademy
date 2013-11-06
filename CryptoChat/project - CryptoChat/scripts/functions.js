var rootUrl = "http://cryptochat.apphb.com/CryptoChatService.svc/";
GibberishAES.size(128);
$(document).ready(onDocumentReady);

var isLoggedIn = false;
var allUsers = [];
var allMessages = [];
var challengers = [];
var responders = [];
var chatBuddy = "";
var currentKey = "";
var ID = "";
var user = "";
var inChat = false;
var chatMessage = "";
var isLong = false;

function onDocumentReady() {
    isLoggedIn = false;
    allUsers = [];
    allMessages = [];
    challengers = [];
    responders = [];
    chatBuddy = "";
    ID = "";
    user = "";
    var homeNavHTML = '<li><a href="#" id="home-link">home</a></li>' +
                      '<li><a href="#" id="reg-link">register</a></li>' +
                      '<li><a href="#" id="login-link">login</a></li>';
    $("#main-nav-list").html(homeNavHTML);
    $("#reg-link").on("click", navControl.regLink);
    $("#home-link").on("click", navControl.homeLink);
    $("#login-link").on("click", navControl.loginLink);
}

var navControl = navControl || {
    homeLink: function () {
        $("#main-content").html("");
    },
    regLink: function () {
        var regHTML = '<form onsubmit="return false;" id="reg-form" method="post">' +
                '	<label for="username-tb">Username</label>' +
                '	<input type="text" id="username-tb" /> <br />' +
                '	<label for="password-tb">Password</label>' +
                '	<input type="password" id="password-tb" /> <br />' +
                '	<label for="password-tb">Repeat Password</label>' +
                '	<input type="password" id="rep-password-tb" /> <br />' +
                '	<button id="reg-btn">sign in</button>' +
              '</form>';
        $("#main-content").html(regHTML);
        $("#reg-btn").on("click", navControl.regButton);
    },
    regButton: function () {
        var user = document.getElementById("username-tb").value;
        if (user.length < 3 || user.length > 30) {
            alert("username must be between 3 and 30 symbols!")
            return;
        }
        var password = document.getElementById("password-tb").value;
        var repPassword = document.getElementById("rep-password-tb").value;
        if (password != repPassword) {
            alert("you have to type the same password!");
            return;
        }
        if (password.length < 8 || password.length > 30) {
            alert("password must be between 8 and 30 symbols!")
            return;
        }
        var hash = CryptoJS.SHA1(user + password).toString();
        var newUser = {
            username: user,
            authCode: hash
        };
        var regUrl = rootUrl + "register";
        performRequest.post(regUrl, newUser, onRegSuccess, handleErrors.regErr);
    },
    loginLink: function () {
        var loginHTML = '<form id="login-form" onsubmit="return false;" method="post">' +
                '	<label for="username-tb">Username</label>' +
                '	<input type="text" id="username-tb" /> <br />' +
                '	<label for="password-tb">Password</label>' +
                '	<input type="password" id="password-tb" /> <br />' +
                '	<button id="login-btn">log in</button>' +
                '</form>';
        $("#main-content").html(loginHTML);
        $("#login-btn").on("click", navControl.loginButton);
    },
    loginButton: function () {
        user = document.getElementById("username-tb").value;
        if (user.length < 3 || user.length > 30) {
            alert("username must be between 3 and 30 symbols!")
            return;
        }
        var password = document.getElementById("password-tb").value;

        if (password.length < 8 || password.length > 30) {
            alert("password must be between 8 and 30 symbols!")
            return;
        }
        var hash = CryptoJS.SHA1(user + password).toString();
        var loginUser = {
            username: user,
            authCode: hash
        };
        var loginUrl = rootUrl + "login";
        performRequest.post(loginUrl, loginUser, loginControl.loggedIn, handleErrors.loginErr);
    },
    logoutLink: function () {
        var logoutUrl = rootUrl + "logout/" + ID;
        performRequest.get(logoutUrl, ID, loginControl.logOut, loginControl.logOut);
    },
    challengeLink: function () {
        var challUser = this.id.slice(this.id.indexOf("-") + 1, this.id.length);
        var key = prompt("write key");

        if (key.length < 3 || key.length > 30) {
            alert("invalid key!");
            return;
        }
        var r = Math.random() * 999999999;
        keyNumber = r;
        var code = GibberishAES.enc(r, key);
        var challengeURL = rootUrl + "invite-user";
        var challengeData = {
            sessionID: ID,
            recipientUsername: challUser,
            challenge: code
        };
        var challengeUrl = rootUrl + "invite-user";
        performRequest.post(challengeUrl, challengeData, function () { return handleUsers.addRespUser(challUser, key, keyNumber) }, handleErrors.challErr);
    },
    respondLink: function () {
        var currentId = $(this).attr('id');
        var respUser = currentId.slice(currentId.indexOf("-") + 1, currentId.length);
        var key = prompt("write key");
        var lock;
        for (var i = 0; i < challengers.length; i++) {
            if (challengers[i].name == respUser) {
                lock = challengers[i].code;
                break;
            }
        }
        var r = parseFloat(GibberishAES.dec(lock, key));
        var answer = GibberishAES.enc(999999999 - r, key);
        var respData = {
            sessionID: ID,
            recipientUsername: respUser,
            response: answer
        }
        respUrl = rootUrl + "response-chat-invitation";
        performRequest.post(respUrl, respData, function () { alert("response success!"); currentKey = key; }, handleErrors.respErr);
    },
    usersLink: function () {
        var userUrl = rootUrl + "list-users/" + ID;
        handleUsers.loadAllUsers(allUsers);
    },
    chatLink: function () {
        var messagesHTML =  '<dl id="chat-messages"></dl>'
        if (allMessages.length > 0) {
            messagesHTML = '<dl id="chat-messages">';
            for (var i = 0; i < allMessages.length; i++) {
                messagesHTML += allMessages[i];
            }
            messagesHTML += '</dl>'
        }
        var chatHTML = '<div id="chat">' +
                            '<div id="chat-box">' +   
                                messagesHTML +
                            '</div>' +
                            '<form onsubmit="return false;" id="reg-form" method="post">' +
                                '<input type="text" id="message-text" />' +
                                '<button id="message-btn">Send</button>' +
                            '</form>' +
                        '</div>';
        $("#main-content").html(chatHTML);
        $("#message-btn").on("click", navControl.messageBtn);
    },
    messageBtn: function () {
        var message = $("#message-text").val();
        var messageHTML = '<dt class="' + user + '-name">' + user + '</dt>' +
                            '<dd>' + message + '</dd><br />';
        $("#message-text").val('');
        //If the message is more than 33 symbols, it must be divided.
        allMessages.push(messageHTML);
        $("#chat-messages").append(messageHTML);
        if (message.length > 20) {
            chatControl.sendFake("first");
            while (message.length > 20) {
                var part = message.substring(0, 20);
                chatControl.sendMessage(part);
                message = message.substring(20);
            }
            if (message.length > 0) {
                chatControl.sendMessage(message);
            }
            chatControl.sendFake("last");
            return;
        }
        chatControl.sendMessage(message);
    }
}
var loginControl = loginControl || {
    loggedIn: function (data) {
        user = user.toLowerCase();
        isLoggedIn = true;
        //Fix for Firefox.
        if (data.constructor === String) {
            data = $.parseJSON(data);
        }
        ID = data.sessionID;
        alert("success");
        var logoutNavHTML = '<li><span>' + user + '</span><a href="#" id="logout-link">(logout)</li>' +
                        '<li><a href="#" id="users-link">users</li>';
        $("#main-nav").children("#main-nav-list").html(logoutNavHTML);
        $("#logout-link").on("click", navControl.logoutLink);
        $("#users-link").on("click", navControl.usersLink)
        performRequest.get(rootUrl + "list-users/" + ID, ID, handleUsers.loadAllUsers, handleErrors.usersErr);
        message = setInterval(loginControl.getMessage, 500);
    },
    getMessage: function () {
        if (!isLoggedIn) {
            clearInterval(message);
            return;
        }
        var messageUrl = rootUrl + "get-next-message/" + ID;
        performRequest.get(messageUrl, ID, loginControl.handleMessages, handleErrors.messageErr);
    },
    handleMessages: function (newMessage) {
        if (newMessage.msgType != "MSG_NO_MESSAGES") {
            if (newMessage.msgType == "MSG_USER_ONLINE") {
                handleUsers.loadNewUser(newMessage.username);
            }
            else if (newMessage.msgType == "MSG_USER_OFFLINE") {
                handleUsers.removeUser(newMessage.username);
            }
            else if (newMessage.msgType == "MSG_CHALLENGE") {
                handleUsers.addChallUser(newMessage.username, newMessage.msgText);
                chatControl.onChallenge(newMessage.username);
            }
            else if (newMessage.msgType == "MSG_RESPONSE") {
                chatControl.checkResponse(newMessage.username, newMessage.msgText);
            }
            else if (newMessage.msgType == "MSG_START_CHAT") {
                chatBuddy = newMessage.username;
                chatControl.newChat();
            }
            else if (newMessage.msgType == "MSG_CANCEL_CHAT") {

            }
            else if (newMessage.msgType == "MSG_CHAT_MESSAGE") {
                var checkForSecret = GibberishAES.dec(newMessage.msgText, "f");
                if (checkForSecret == "first") {
                    isLong = true;
                    return;
                }
                else if (checkForSecret == "last") {
                    isLong = false;
                    chatControl.getNewMessage(newMessage.username)
                    return;
                }
                chatMessage += GibberishAES.dec(newMessage.msgText, currentKey);
                if (!isLong) {
                    chatControl.getNewMessage(newMessage.username)
                }
            }
        }
    },
    logOut: function () {
        $("#main-content").html("");
        onDocumentReady();
    },
};



var chatControl = chatControl || {
    onChallenge: function (challenger) {
        alert("You have been invited for a chat by " + challenger);
    },
    checkResponse: function (responder, code) {
        var r;
        var key;
        for (var i = 0; i < responders.length; i++) {
            if (responders[i].name == responder) {
                r = responders[i].number;
                key = responders[i].pass;
                break;
            }
        }
        var check = parseFloat(GibberishAES.dec(code, key));
        if (999999999 - check == r) {
            chatBuddy = responder;
            currentKey = key;
            chatControl.startChat();
        }
        else {
            chatControl.endChat(responder);
        }
    },
    startChat: function () {
        var startChatData = {
            sessionID: ID,
            recipientUsername: chatBuddy
        };
        var startChatUrl = rootUrl + "start-chat";
        performRequest.post(startChatUrl, startChatData, chatControl.newChat, handleErrors.startChatErr);
    },
    endChat: function (responder) {
        var endChatUrl = rootUrl + "cancel-chat";
        var endChatData = {
            sessionID: ID,
            recipientUsername: responder
        };
        performRequest.post(endChatUrl, endChatData, function () { chatBuddy = ""; alert("Your chat with " + responder + " was canceled!") }, handleErrors.endChatErr)
    },
    newChat: function() {
        $('#main-nav-list').append('<li><a href="#" id="chat-link">chat</a></li>');
        $('#chat-link').on("click", navControl.chatLink);
        inChat = true;
    },
    sendMessage: function(message) {
        var encrypted = GibberishAES.enc(message, currentKey);
        var sendData = {
            sessionID: ID,
            recipientUsername: chatBuddy,
            encryptedMsg: encrypted
        };
        var sendUrl = rootUrl + "send-chat-message";
        performRequest.post(sendUrl, sendData, function () { }, handleErrors.sendError);
    },
    sendFake: function (place) {
        var fake = GibberishAES.enc(place, "f");
        var sendData = {
            sessionID: ID,
            recipientUsername: chatBuddy,
            encryptedMsg: fake
        };
        var sendUrl = rootUrl + "send-chat-message";
        performRequest.post(sendUrl, sendData, function () { }, handleErrors.sendError);
    },
    getNewMessage: function (username) {
        //chatMessage += GibberishAES.dec(encMessage, currentKey);
        if (isLong) {
            return;
        }
        var messageHTML = '<dt class="' + username + '-name">' + username + '</dt>' +
                            '<dd>' + chatMessage + '</dd><br />';
        allMessages.push(messageHTML);
        $("#chat-messages").append(messageHTML);
        chatMessage = "";
    }
};

var handleUsers = handleUsers || {
    loadAllUsers: function (users) {
        allUsers = users;
        var usersHTML = '<ul id="users-list">';
        for (var i = 0; i < users.length; i++) {
            if (users[i] != user.toLowerCase()) {
                usersHTML += '<li class="users-list-items">' +
                                '<span id="user-' + users[i] + '">' + users[i] + '</span>' +
                                '<ul class="invite-links">' +
                                    '<li><a href="#" id="challenge-' + users[i] + '" class="challenge-links">invite</a></li>' +
                                    '<li><a href="#" id="respond-' + users[i] + '" class="respond-links">respond</a></li>' +
                                '</ul>' +
                             '</li>';
            }
        }
        usersHTML += '</ul>';
        $("#main-content").html(usersHTML);
        $(".challenge-links").off("click");
        $(".challenge-links").on("click", navControl.challengeLink);
        for (var i = 0; i < challengers.length; i++) {
            $("#respond-" + challengers[i].name).addClass("active");
        }
        $(".active").off("click");
        $(".active").on("click", navControl.respondLink);
    },
    loadNewUser: function (newUser) {
        for (var i = 0; i < allUsers.length; i++) {
            if (newUser == allUsers[i]) {
                return;
            }
        }
        allUsers.push(newUser);
        allUsers.sort();
        if (!inChat) {
            handleUsers.loadAllUsers(allUsers);
        }
    },
    removeUser: function (remUser) {
        for (var i = 0; i < responders.length; i++) {
            if (responders[i].name == remUser) {
                responders.splice(i, 1);
            }
        }
        for (var i = 0; i < challengers.length; i++) {
            if(challengers[i].name == remUser){
                challengers.splice(i, 1);
            }
        }
        allUsers = $.grep(allUsers, function (value) {
            return value != remUser;
        });
        if (!inChat) {
            handleUsers.loadAllUsers(allUsers);
        }
    },
    addRespUser: function (responder, code, keyNumber) {
        for (var i = 0; i < responders.length; i++) {
            if (responders[i].name == responder) {
                responders[i].number = keyNumber;
                responders[i].pass = code;
                return;
            }
        }        
        responders.push({ name: responder, number: keyNumber, pass: code });
    },
    addChallUser: function (challenger, enc) {
        for (var i = 0; i < length; i++) {
            if (challengers[i].name == challenger) {
                challengers[i].code = enc;
                return;
            }
        }
        challengers.push({ name: challenger, code: enc });
        $("#respond-" + challenger).addClass("active");
        $(".active").off("click");
        $(".active").on("click", navControl.respondLink);
    }
};

var handleErrors = handleErrors || {
    regErr: function (error) {
        alert(JSON.stringify(error));
    },
    loginErr: function (error) {
        alert(JSON.stringify(error));
    },
    logoutErr: function (error) {
        alert(JSON.stringify(error));
    },
    messageErr: function (error) {
        alert(JSON.stringify(error));
    },
    challErr: function (error) {
        alert(JSON.stringify(error));
    },
    respErr: function (error) {
        alert(JSON.stringify(error));
    },
    usersErr: function (error) {
        alert(JSON.stringify(error));
    },
    startChatErr: function(error){
        alert(JSON.stringify(error));
    },
    endChatErr: function (error) {
        alert(JSON.stringify(error));
    },
    sendError: function (error) {
        alert(JSON.stringify(error));
    }
};

var performRequest = performRequest || {
    post: function (serviceUrl, postData, onSuccess, onError) {
        $.ajax({
            url: serviceUrl,
            type: "POST",
            timeout: 5000,
            contentType: "application/json",
            data: JSON.stringify(postData),
            success: onSuccess,
            error: onError
        });
    },
    get: function (serviceUrl, postData, onSuccess, onError) {
        $.ajax({
            url: serviceUrl,
            type: "GET",
            timeout: 5000,
            dataType: "json",
            success: onSuccess,
            error: onError
        });
    }
};

function onRegSuccess(data) {
    alert("success!");
}