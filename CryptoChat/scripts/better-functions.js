var rootUrl = "http://cryptochat.apphb.com/CryptoChatService.svc/";
GibberishAES.size(128);
$(document).ready(onDocumentReady);
$.support.cors = true;
var chatHTML = '';
var loggedInHTML;
var isLoggedIn;
var allUsers;
var challengers;
var responders;
var chatBuddies;
var currentChat;
var currentMessages;
var chatN;
var currentKey = -1;
var ID;
var user;


function updateCookie() {
    var values = {
        log: isLoggedIn,
        name: user,
        users: allUsers,
        chal: challengers,
        resp: responders,
        chat: chatBuddies,
        curChat: currentChat,
        curMess: currentMessages,
        n: chatN,
        key: currentKey,
        session: ID,
        name: user,
        navHTML: $("#main-nav").html(),
        mainHTML: $("#main-content").html()
    };
    window.sessionStorage.setItem("keptValues", JSON.stringify(values));
}

function refreshValues() {
    isLoggedIn = false;
    allUsers = [];
    currentMessages = [];
    challengers = [];
    responders = [];
    chatBuddies = [];
    currentChat = "";
    chatN = -1;
    var currentKey = -1;
    ID = "";
    user = "";
    var homeNavHTML = '<li><a href="#" id="home-link">home</a></li>' +
                      '<li><a href="#" id="reg-link">register</a></li>' +
                      '<li><a href="#" id="login-link">login</a></li>';

    $("#main-nav-list").html(homeNavHTML);
    $("#chat-list").html("");
    $("#reg-link").on("click", navControl.regLink);
    $("#home-link").on("click", navControl.homeLink);
    $("#login-link").on("click", navControl.loginLink);
}

function getCookieValues(keptValues) {
    isLoggedIn = keptValues.log;
    user = keptValues.name;
    allUsers = keptValues.users;
    challengers = keptValues.chal;
    responders = keptValues.resp;
    chatBuddies = keptValues.chat;
    currentChat = keptValues.curChat;
    currentMessages = keptValues.curMess;
    chatN = keptValues.n;
    currentKey = keptValues.key;
    ID = keptValues.session;
    name = keptValues.user;
    var navHTML = keptValues.navHTML;
    var mainHTML = keptValues.mainHTML;
    loggedInHTML = '<li><span>' + user + '</span><a href="#" id="logout-link">(logout)</li>';
    $("#main-nav").html(navHTML);
    $("#main-content").html(mainHTML);
    $("#reg-link").on("click", navControl.regLink);
    $("#home-link").on("click", navControl.homeLink);
    $("#login-link").on("click", navControl.loginLink);
    $(".challenge-links").on("click", navControl.challengeLink);
    $(".active").on("click", navControl.respondLink);
    $("#logout-link").on("click", navControl.logoutLink);
    $(".chat-link").on("click", navControl.chatLink);
    $(".chat-cancel").on("click", navControl.cancelLink);
    $("#login-btn").on("click", navControl.loginButton);
    $("#message-btn").on("click", navControl.messageBtn);
    $("#reg-btn").on("click", navControl.regButton);
    message = setInterval(loginControl.getMessage, 500);
}

function onDocumentReady() {
    var keptValues = sessionStorage.getItem("keptValues");
    keptValues = $.parseJSON(keptValues);
    if (keptValues != null) {
        getCookieValues(keptValues);
    }
    else {
        refreshValues();
    }
}

var navControl = navControl || {
    challengeLink: function () {
        var challUser = this.id.slice(this.id.indexOf("-") + 1, this.id.length);
        var key = prompt("write key");
        if (key == null) {
            return;
        }
        else if (key.length < 3 || key.length > 30) {
            alert("The key must be between 3 and 30 symbols!");
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
        updateCookie()
    },
    respondLink: function () {
        var currentId = $(this).attr('id');
        var respUser = currentId.slice(currentId.indexOf("-") + 1, currentId.length);
        var key = prompt("write key");
        if (key == null) {
            return;
        }
        else if (key.length < 3 || key.length > 30) {
            "The key must be between 3 and 30 symbols!"
        }
        var lock;
        for (var i = 0; i < challengers.length; i++) {
            if (challengers[i].name == respUser) {
                lock = challengers[i].code;
                $("#respond-" + respUser).removeClass("active");
                challengers[i].key = key;
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
        updateCookie()
    },
    chatLink: function () {
        currentChat = this.id.slice(this.id.indexOf("-") + 1);
        for (var i = 0; i < chatBuddies.length; i++) {
            if (currentChat == chatBuddies[i].name) {
                currentMessages = chatBuddies[i].messages;
                chatN = i;
                break;
            }
        }
        chatControl.showChat();
        updateCookie()
    },
    homeLink: function () {
        $("#main-form").html("");
    },
    regLink: function () {
        var regHTML =
                '	<label for="username-tb">Username</label> <br />' +
                '	<input type="text" id="username-tb" /> <br />' +
                '	<label for="password-tb">Password</label> <br />' +
                '	<input type="password" id="password-tb" /> <br />' +
                '	<label for="password-tb">Repeat Password</label> <br />' +
                '	<input type="password" id="rep-password-tb" /> <br />' +
                '	<button id="reg-btn">sign in</button>';
        $("#main-form").html(regHTML);
        $("#reg-btn").on("click", navControl.regButton);
        updateCookie();
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
        var loginHTML =
                '	<label for="username-tb">Username</label> <br />' +
                '	<input type="text" id="username-tb" /> <br />' +
                '	<label for="password-tb">Password</label> <br />' +
                '	<input type="password" id="password-tb" /> <br />' +
                '	<button id="login-btn">log in</button>';
        $("#main-form").html(loginHTML);
        $("#login-btn").on("click", navControl.loginButton);
        updateCookie();
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
    cancelLink: function () {
        var cancelChat = this.id.slice(this.id.indexOf("-") + 1);
        for (var i = 0; i < chatBuddies.length; i++) {
            if (cancelChat == chatBuddies[i].name) {
                chatBuddies.splice(i, 1);
                break;
            }
        }
        chatControl.endChat(cancelChat);
        handleUsers.loadAllUsers(allUsers);
        updateCookie()
    },
    messageBtn: function () {
        var message = $("#message-text").val();
        if (message == "") {
            return;
        }
        else if (message.length > 400) {
            alert("Message is too long!");
        }
        var messageHTML = '<dt class="' + user + '-name user">' + user + ':' + '</dt>' +
                            '<dd>' + message + '</dd>' + '<br />';
        $("#message-text").val('');
        currentMessages.push(messageHTML);
        $("#chat-messages").append(messageHTML);
        $("#chat-box").animate({ scrollTop: $("#chat-box").prop("scrollHeight") - $("#chat-box").height() }, 100);
        var key;
        for (var i = 0; i < chatBuddies.length; i++) {
            if (currentChat == chatBuddies[i].name) {
                key = chatBuddies[i].key;
            }
        }
        chatControl.sendMessage(message, key);
        updateCookie()
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
        loggedInHTML = '<li><span>' + user + '</span><a href="#" id="logout-link">logout</li>';
        $("#main-form").html("");
        $("#main-nav-list").html(loggedInHTML);
        $("#logout-link").on("click", navControl.logoutLink);
        performRequest.get(rootUrl + "list-users/" + ID, ID, handleUsers.loadAllUsers, handleErrors.usersErr);
        message = setInterval(loginControl.getMessage, 500);
        updateCookie();
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
                updateCookie()
            }
            else if (newMessage.msgType == "MSG_USER_OFFLINE") {
                handleUsers.removeUser(newMessage.username);
                updateCookie()
            }
            else if (newMessage.msgType == "MSG_CHALLENGE") {
                handleUsers.addChallUser(newMessage.username, newMessage.msgText);
                chatControl.onChallenge(newMessage.username);
                updateCookie()
            }
            else if (newMessage.msgType == "MSG_RESPONSE") {
                chatControl.checkResponse(newMessage.username, newMessage.msgText);
                updateCookie()
            }
            else if (newMessage.msgType == "MSG_START_CHAT") {
                var key;
                for (var i = 0; i < challengers.length; i++) {
                    if (newMessage.username == challengers[i].name) {
                        key = challengers[i].key;
                        challengers.splice(i, 1);
                    }
                }
                chatControl.newChat(newMessage.username, key);
                updateCookie()
            }
            else if (newMessage.msgType == "MSG_CANCEL_CHAT") {
                var username = newMessage.username;
                alert(username + " canceled the chat!");
                $("#chat-item-" + username).remove();
                chatHTML = $("#chat-list").html();
                for (var i = 0; i < challengers.length; i++) {
                    if (username == challengers[i].name) {
                        challengers.splice(i, 1);
                    }
                }
                for (var i = 0; i < chatBuddies.length; i++) {
                    if (username == chatBuddies[i].name) {
                        chatBuddies.splice(i, 1);
                        break;
                    }
                }
                if (newMessage.username == currentChat) {
                    $("#chat").html('');
                }
                updateCookie()
            }
            else if (newMessage.msgType == "MSG_CHAT_MESSAGE") {
                chatControl.getNewMessage(newMessage.username, newMessage.msgText)
                updateCookie()
            }
        }
    },
    logOut: function () {
        $("#users-list").html("");
        $("#chat").html("");
        sessionStorage.setItem("keptValues", null);
        onDocumentReady();
    }
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
                responders.splice(i, 1);
                break;
            }
        }
        var check = parseFloat(GibberishAES.dec(code, key));
        if (999999999 - check == r) {
            chatControl.startChat(responder, key);
        }
        else {
            chatControl.endChat(responder);
        }
    },
    startChat: function (newChatBuddy, newKey) {
        var startChatData = {
            sessionID: ID,
            recipientUsername: newChatBuddy
        };
        var startChatUrl = rootUrl + "start-chat";
        performRequest.post(startChatUrl, startChatData, function () { return chatControl.newChat(newChatBuddy, newKey) }, handleErrors.startChatErr);
    },
    endChat: function (responder) {
        var endChatUrl = rootUrl + "cancel-chat";
        var endChatData = {
            sessionID: ID,
            recipientUsername: responder
        };
        performRequest.post(endChatUrl, endChatData, function () { chatBuddy = ""; alert("Your chat with " + responder + " was canceled!") }, handleErrors.endChatErr);
        $("#chat-item-" + responder).remove();
        chatHTML = $("#chat-list").html();
        if (currentChat == responder) {
            $("#chat").html("");
        }
    },
    newChat: function (newChatBuddy, newKey) {
        var newKey;

        var newChatData = {
            name: newChatBuddy,
            messages: [],
            key: newKey
        };
        chatBuddies.push(newChatData);
        var newChatHTML = '<li id="chat-item-' + newChatBuddy + '"><a href="#" class="chat-link" id="chat-' + newChatBuddy + '">' + newChatBuddy +
                                    '</a><a href="#" class="chat-cancel" id="cancel-' + newChatBuddy + '">cancel</a></li>';
        $("#chat-list").append(newChatHTML);
        chatHTML = $("#chat-list").html();
        $(".chat-link").on("click", navControl.chatLink);
        $(".chat-cancel").on("click", navControl.cancelLink);
        currentChat = newChatBuddy;
        currentMessages = chatBuddies[chatBuddies.length - 1].messages;
        chatControl.showChat();
        updateCookie();
    },
    sendMessage: function (message, key) {
        var encrypted = GibberishAES.enc(message, key);
        encrypted = Base64.encode(encrypted);
        var sendData = {
            sessionID: ID,
            recipientUsername: currentChat,
            encryptedMsg: encrypted
        };
        var sendUrl = rootUrl + "send-chat-message";
        performRequest.post(sendUrl, sendData, function () { }, handleErrors.sendError);
    },
    getNewMessage: function (username, message) {
        message = Base64.decode(message);

        for (var i = 0; i < chatBuddies.length; i++) {
            if (username == chatBuddies[i].name) {

                message = GibberishAES.dec(message, chatBuddies[i].key);
                var messageHTML = '<dt class="' + username + '-name buddy">' + username + ':' + '</dt>' +
                            '<dd>' + message + '</dd>' + '<br />';
                if (username == currentChat) {
                    currentMessages.push(messageHTML);
                    $("#chat-messages").append(messageHTML);
                    $("#chat-box").animate({ scrollTop: $("#chat-box").prop("scrollHeight") - $("#chat-box").height() }, 100);
                }
                else {
                    chatBuddies[i].messages.push(messageHTML);
                }
                break;
            }
        }
    },
    showChat: function () {
        var messagesHTML;
        if (currentMessages.length > 0) {
            messagesHTML = '<dl id="chat-messages">';
            for (var i = 0; i < currentMessages.length; i++) {
                messagesHTML += currentMessages[i];
            }
            messagesHTML += '</dl>'
        }
        else {
            messagesHTML = '<dl id="chat-messages"></dl>';
        }
        var chatHTML = '<h1>' + currentChat + '</h1>' +
                            '<div id="chat-box">' +
                                messagesHTML +
                            '</div>' +
                            '<form onsubmit="return false;" id="reg-form" method="post">' +
                                '<input type="text" id="message-text" />' +
                                '<button id="message-btn">Send</button>' +
                            '</form>';

        $("#chat").html(chatHTML);
        $("#message-btn").on("click", navControl.messageBtn);
        $("#chat-box").animate({ scrollTop: $("#chat-box").prop("scrollHeight") - $("#chat-box").height() }, 5);
    }
};

var handleUsers = handleUsers || {
    loadAllUsers: function (users) {
        allUsers = users;
        var usersHTML = '';
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
        $("#users-list").html(usersHTML);
        $(".challenge-links").off("click");
        $(".challenge-links").on("click", navControl.challengeLink);
        for (var i = 0; i < challengers.length; i++) {
            $("#respond-" + challengers[i].name).addClass("active");
        }
        $(".active").off("click");
        $(".active").on("click", navControl.respondLink);
        updateCookie();
    },
    loadNewUser: function (newUser) {
        for (var i = 0; i < allUsers.length; i++) {
            if (newUser == allUsers[i]) {
                return;
            }
        }
        allUsers.push(newUser);
        allUsers.sort();
        handleUsers.loadAllUsers(allUsers);
    },
    removeUser: function (remUser) {
        for (var i = 0; i < responders.length; i++) {
            if (responders[i].name == remUser) {
                responders.splice(i, 1);
            }
        }
        for (var i = 0; i < challengers.length; i++) {
            if (challengers[i].name == remUser) {
                challengers.splice(i, 1);
            }
        }
        for (var i = 0; i < chatBuddies.length; i++) {
            if (remUser == chatBuddies[i].name) {
                alert(remUser + "went offline!");
                $("#chat-item-" + remUser).remove();
                if (currentChat == remUser) {
                    $("#chat").html("");
                }
                chatBuddies.splice(i, 1);
                break;
            }
        }
        allUsers = $.grep(allUsers, function (value) {
            return value != remUser;
        });
        handleUsers.loadAllUsers(allUsers);
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

    },
    messageErr: function (error) {
        if (error.errorMsg == "ERR_SESSIONID") {
            alert("Your session has expired!");
            loginControl.logOut();
        }
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
    startChatErr: function (error) {
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

