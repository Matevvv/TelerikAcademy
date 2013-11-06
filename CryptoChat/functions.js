var rootUrl = "http://cryptochat.apphb.com/CryptoChatService.svc/";
$(document).ready(onDocumentReady);
var isLogedin = false;
var allUsers = [];
var responseUsers = [];
var challengeUsers = [];
var userSessionID = "";
var user = "";

function onDocumentReady() {
    var homeNavHTML = '<li><a href="#" id="home-link">home</a></li>' +
                      '<li><a href="#" id="reg-link">register</a></li>' +
                      '<li><a href="#" id="login-link">login</a></li>';
    $("#main-nav-list").html(homeNavHTML);
    $("#reg-link").on("click", onRegLinkClick);
    $("#home-link").on("click", onHomeLinkClick);
    $("#login-link").on("click", onLoginLinkClick);
}
function onHomeLinkClick() {
    $("#main-content").html("");
}
function onRegLinkClick()
{
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
    $("#reg-btn").on("click", onRegButtonClick);
}
function onRegButtonClick() {
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
    performPostRequest(regUrl, newUser, onRegSuccess, onRegError);
}
function isPasswordSame(pass, repPass) {
    if (pass != repPass) {
        return false;
    }
    return true;
}

function onRegSuccess(data) {
    alert("success!");
}

function onRegError(data) {
    alert(JSON.stringify(data));
}

function onLoginLinkClick() {
    var loginHTML = '<form id="login-form" onsubmit="return false;" method="post">' +
                    '	<label for="username-tb">Username</label>' +
                    '	<input type="text" id="username-tb" /> <br />' +
                    '	<label for="password-tb">Password</label>' +
                    '	<input type="password" id="password-tb" /> <br />' +
                    '	<button id="login-btn">log in</button>' +
                    '</form>';
    $("#main-content").html(loginHTML);
    $("#login-btn").on("click", onLoginButtonClick);
}

function onLoginButtonClick() {
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
    performPostRequest(loginUrl, loginUser, onLoginSuccess, onLoginError);
}

function onLoginSuccess(data) {
    isLogedin = true;
    if (data.constructor === String) {
        data = $.parseJSON(data);
    }
    userSessionID = data.sessionID;
    alert("success");
    changeToLogoutNav();
    $("#logout-link").on("click", onLogoutLinkClick);
    $("#users-link").on("click", onUsersLinkClick)
    onUsersLinkClick();
    getMessage = setInterval(loadNewMessages, 1000);
}

function onLoginError(err) {
    alert(JSON.stringify(err));
}

function loadNewMessages() {
    if (!isLogedin) {
        clearInterval(getMessage);
    }
    var messageUrl = rootUrl + "get-next-message/" + userSessionID;
    performGetRequest(messageUrl, userSessionID, onMessageSuccess, onMessageError);
}

function onMessageSuccess(newMessage) {
    if (newMessage.msgType != "MSG_NO_MESSAGES") {
        if (newMessage.msgType == "MSG_USER_ONLINE") {
            var isDublicate = false;
            for (var i = 0; i < allUsers.length; i++) {
                if (newMessage.username == allUsers[i]) {
                    isDublicate = true;
                    break;
                }
            }
            if (!isDublicate) {
                allUsers.push(newMessage.username);
                allUsers.sort();
                loadUsersHTML(allUsers);
            }
        }
        else if (newMessage.msgType == "MSG_USER_OFFLINE") {
            allUsers = $.grep(allUsers, function (value) {
                return value != newMessage.username;
            });
            loadUsersHTML(allUsers);
        }
        else if (newMessage.msgType == "MSG_CHALLENGE") {
            challengeUsers.push(newMessage.username);
            loadChallengeUsers();
        }
        else if (newMessage.msgType == "MSG_RESPONSE") {
            responseUsers.push(newMessage.username);
            loadResponseUsers();
        }
        else if (newMessage.msgType == "MSG_START_CHAT") {
            $("#user-" + newMessage.username).css("color", "red");
        }
        else if (newMessage.msgType == "MSG_CANCEL_CHAT") {
            $("#user-" + newMessage.username).css("color", "black");
        }
    }
}

function loadChallengeUsers() {
    for (var i = 0; i < challengeUsers.length; i++) {
        $("#user-" + challengeUsers[i]).addClass("challenge");
    }
}

function loadResponseUsers() {
    for (var i = 0; i < responseUsers.length; i++) {
        $("#user-" + responseUsers[i]).addClass("response");
    }
}

function onMessageError(err) {
    alert(JSON.stringify(err));
}

function onUsersLinkClick() {
    var userUrl = rootUrl + "list-users/" + userSessionID;
    performGetRequest(userUrl, userSessionID, onUsersSuccess, onUsersError);
}

function loadUsersHTML(users) {
    var usersHTML = '<ul id="users-list">';
    for (var i = 0; i < users.length; i++) {
        if (users[i] != user.toLowerCase()) {
            usersHTML += '<li><span id="user-' + users[i] + '">' + users[i] + '</span><a href="#" id="challenge-' + users[i] + '" class="challenge-links">challenge</a></li>';
        }
    }
    usersHTML += '</ul>';
    $("#main-content").html(usersHTML);
    $(".challenge-links").on("click", onChallengeLinkClick);
    loadChallengeUsers();
    loadResponseUsers;
}

function onUsersSuccess(users) {
    allUsers = users;
    loadUsersHTML(users);
}

function onChallengeLinkClick() {
    var challUser = $("#user-" + this.id).prev()[0].innerHTML;
    var key = prompt("write key");
    if (key.length < 3 || key.length > 30) {
        alert("invalid key!");
        return;
    }
    var r = Math.random() * 999999999;
    var code = GibberishAES.enc(r, key);
    var challengeURL = rootUrl + "invite-user";
    var challengeData = {
        sessionID: userSessionID,
        recipientUsername: challUser,
        challenge: code
    };
    var challengeUrl = rootUrl + "invite-user";
    performPostRequest(challengeUrl, challengeData, onChallengeSuccess, onChallengeError);
}

function onChallengeSuccess(data) {
    alert(JSON.stringify(data));
}

function onChallengeError(err) {
    alert(JSON.stringify(err));
}

function onUsersError(err) {
    alert(JSON.stringify(err));
}

function changeToHomeNav() {
    onDocumentReady();
    $("#home").click();
}

function changeToLogoutNav() {
    var logoutNavHTML = '<li><a href="#" id="logout-link">logout</li>' +
                        '<li><a href="#" id="users-link">users</li>';
    $("#main-nav").children("#main-nav-list").html(logoutNavHTML);
}

function onLogoutLinkClick() {
    var logoutUrl = rootUrl + "logout/" + userSessionID;
    performGetRequest(logoutUrl, userSessionID, onLogoutSuccess, onLogoutError);
    changeToHomeNav();
}

function onLogoutSuccess()
{
    isLogedin = false;
    responseUsers = [];
    challengeUsers = [];
    alert("logout success!");
}

function onLogoutError(err) {
    alert(JSON.stringify(err));
}

function performPostRequest(serviceUrl, postData, onSuccess, onError) {
    $.ajax({
        url: serviceUrl,
        type: "POST",
        timeout: 5000,
        contentType: "application/json",
        data: JSON.stringify(postData),
        success: onSuccess,
        error: onError
    });
}

function performGetRequest(serviceUrl, postData, onSuccess, onError) {
    $.ajax({
        url: serviceUrl,
        type: "GET",
        timeout: 5000,
        dataType: "json",
        success: onSuccess,
        error: onError
    });
}