var rootUrl = "http://cryptochat.apphb.com/CryptoChatService.svc/";
$(document).ready(onDocumentReady);

//When a challenger invites another user, previous invitations are abolished.

var isLoggedIn = false;
var allUsers = [];
var allMessages = [];
var challenger = "";
var responder = "";
var lock = "";
var key = "";
var ID = "";
var user = "";
var keyNumber = -1;

function onDocumentReady() {
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
        if (!isPasswordSame(password, repPassword)) {
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
        key = prompt("write key");
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
        performRequest.post(challengeUrl, challengeData, function () { responder = challUser; alert("challenge success") }, handleErrors.challErr);
    },
    respondLink: function () {
        var respUser = this.id.slice(this.id.indexOf("-") + 1, this.id.length);
        var key = prompt("write key");
        var r = GibberishAES.dec(lock, key);
        var answer = GibberishAES.enc(999999999 - r, key);
        var respData = {
            sessionID: ID,
            recipientUsername: respUser,
            response: answer
        }
        respUrl = rootUrl + "response-chat-invitation";
        performRequest.post(respUrl, respData, function () { alert("response success!")}, handleErrors.respErr);
    },
    usersLink: function () {
        var userUrl = rootUrl + "list-users/" + ID;
        performRequest.get(userUrl, ID, handleUsers.loadAllUsers, handleErrors.usersErr);
    },
    chatLink: function () {
        var messagesHTML = ""
        if (allMessages.length > 0) {
            messagesHTML = '<dl id="chat-messages">';
            for (var i = 0; i < allMessages.length; i++) {
                messagesHTML += allMessages[i];
            }
            messagesHTML += '</dl>'
        }
        var chatHTML = '<div id="chatbox">' + messagesHTML  + '</div>' +
                        '<form onsubmit="return false;" id="reg-form" method="post">' +
                            '<input type="text" id="message-text" />' +
                            '<button id="message-btn">Send</button>' +
                        '</form>';
        $("#main-content").html(chatHTML);
        $("#message-btn").on("click", navControl.messageBtn);
    },
    messageBtn: function () {
        var message = $("#message-text").val();
        var messageHTML = '<dt class="' + user + '-message">' +
                            '<dd>' + message + '</dd>' +
                          '</dt>';
        allMessages.push(messageHTML);
        $("#message-text").val('');
        var encrypted = GibberishAES.enc(message, key);
        var sendUrl = rootUrl + "send-chat-message";
        //LAST
        var sendData = {
            SessionID: ID,
            recipientUserName: 
            }
        performRequest.post(sendUrl, );
    }
};

var loginControl = loginControl || {
    loggedIn: function (data) {
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
                if (newMessage.username != challenger) {
                    lock = newMessage.msgText;
                    chatControl.checkIfChallenged(newMessage.username);
                }
            }
            else if (newMessage.msgType == "MSG_RESPONSE") {
                if (chatControl.isResponse(newMessage.msgText) && newMessage.username == responder) {
                    chatControl.checkResponse(newMessage.msgText);
                }
            }
            else if (newMessage.msgType == "MSG_START_CHAT") {
                $("#user-" + newMessage.username).css("color", "red");
                chatControl.newChat();
            }
            else if (newMessage.msgType == "MSG_CANCEL_CHAT") {
                $("#user-" + newMessage.username).css("color", "black");
            }
            else if (newMessage.msgType == "MSG_CHAT_MESSAGE") {
                chatControl.getNewMessage(newMessage.msgText, newMessage.username)
            }
        }
    },
    logOut: function () {
        isLoggedIn = false;
        challenger = "";
        responder = "";
        ID = "";
        user = "";
        $("#main-content").html("");
        onDocumentReady();
    },
};



var chatControl = chatControl || {
    checkIfChallenged: function (name) {
        challenger = name;
        var check = GibberishAES.enc(-1, "c");
        var checkData = {
            sessionID: ID,
            recipientUsername: challenger,
            response: check
        }
        checkUrl = rootUrl + "response-chat-invitation";
        performRequest.post(checkUrl, checkData, chatControl.onChallenge, handleErrors.challErr);
    },
    onChallenge: function () {
        alert("You have been invited for a chat by " + challenger);
        $("#respond-" + challenger).addClass("active");
        $(".respond-links.active").on("click", navControl.respondLink);
    },
    sendChallenge: function () {
        var code = GibberishAES.enc(keyNumber, key);
        var challengeURL = rootUrl + "invite-user";
        var challengeData = {
            sessionID: ID,
            recipientUsername: responder,
            challenge: code
        };
        var challengeUrl = rootUrl + "invite-user";
        performRequest.post(challengeUrl, challengeData, function () { responder = challUser; alert("challenge success") }, handleErrors.challErr);
    },
    isResponse: function (code) {
        var r = GibberishAES.dec(code, "c");
        if (r == -1) {
            chatControl.sendChallenge();
            return false;
        }
        return true;
    },
    checkResponse: function (message) {
        var answer = GibberishAES.dec(message, key);
        if (answer == 999999999 - keyNumber) {
            chatControl.startChat();
        }
    },
    startChat: function () {
        var startChatData = {
            sessionID: ID,
            recipientUsername: responder
        };
        var startChatUrl = rootUrl + "start-chat";
        performRequest.post(startChatUrl, startChatData, chatControl.newChat, handleErrors.startChatErr);
    },
    newChat: function() {
        $('#main-nav-list').append('<li><a href="#" id="chat-link">chat</a></li>');
        $('#chat-link').on("click", navControl.chatLink);
    },
    getNewMessage: function(newMessage, username) {
        var messageHTML = '<dt class="' + username + '-message">' +
                            '<dd>' + newMessage + '</dd>' +
                          '</dt>';
        allMessages.push(messageHTML);
        $("#chatbox").append(messageHTML);
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
        $(".challenge-links").on("click", navControl.challengeLink);
        $("#respond-" + challenger).addClass("active");
        $(".respond-links.active").on("click", navControl.respondLink);
    },
    loadNewUser: function (newUser) {
        var isDublicate = false;
        for (var i = 0; i < allUsers.length; i++) {
            if (newUser == allUsers[i]) {
                isDublicate = true;
                break;
            }
        }
        if (!isDublicate) {
            allUsers.push(newUser);
            allUsers.sort();
            handleUsers.loadAllUsers(allUsers);
        }
    },
    removeUser: function (remUser) {
        if (remUser == challenger) {
            challenger = "";
        }
        else if (remUser == responder) {
            responder = "";
        }
        allUsers = $.grep(allUsers, function (value) {
            return value != remUser;
        });
        handleUsers.loadAllUsers(allUsers);
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
    usersErr: function (error) {
        alert(JSON.stringify(error));
    },
    challErr: function (error) {
        alert(JSON.stringify(error));
    },
    respErr: function (error) {
        alert(JSON.stringify(error));
    },
    startChatErr: function(error){
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