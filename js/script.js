/*global $, jQuery, window, alert*/
var user = {};
var userIsUsed = 2;
var fontsize, username, userlevel, userhp, usermaxhp, userhpbar, userxp, usermaxxp, usergold, useravatar, useratt, userdef, level, monsterxp;

function loginCreate() {
    "use strict";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            $("#login").append(xmlHttp.responseText);
        }
        $("#loginFrame svg").height(fontsize * 2);
    };
    xmlHttp.open("POST", "login.html", true);
    xmlHttp.send();
}

function loginToCreate() {
    "use strict";
    $("#load").css("z-index", "10000");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            $("#login").append(xmlHttp.responseText);
        }
        $("#loginFrame").hide();
        $("#createUser svg").height(fontsize * 2);
    };
    xmlHttp.open("POST", "create.html", true);
    xmlHttp.send();
    $("#load").css("z-index", "0");
    $("#loginUsername").val("");
    $("#loginPassword").val("");
}

function create() {
    var usernameCheck;
    var newuser = $("#createUsername").val().toLowerCase();
    var newpass = $("#createPassword").val();

    $.getJSON("js/users.json", {
        format: "json"
    }).done(function (data) {
        user = data;
        var userIndex = 0;
        userIsUsed = 0;
        $.each(user, function (index, number) {
            userIndex++;
            usernameCheck = user[index].name.toLowerCase();
            if (newuser === usernameCheck) {
                userIsUsed++;
            }
        });
        if (userIsUsed > 0) {
            alert("This username has already been taken \n \n Please use another username");
        }
        if (userIsUsed == 0) {
            array = {
                "name": newuser,
                "pass": newpass,
                "level": 1,
                "hp": 100,
                "xp": 0,
                "gold": 0,
                "avatar": "swordsman"
            }
            user.push(array);
            $.ajax({
                type: "POST",
                url: "json.php",
                data: {
                    users: user
                }
            });
            $("#createUser").remove();
            $("#loginFrame").show();
            alert("User has been created");
        }
    });
}

function removeCreate() {
    "use strict";
    $("#load").css("z-index", "10000");
    $("#createUser").remove();
    $("#loginFrame").show();
    $("#load").css("z-index", "0");
}

function removeBattle(xp) {
    "use strict";
    $("#load").css("z-index", "10000");
    $("#Battle").remove();
    $("#load").css("z-index", "0");
    userxp += xp;
    $("#mapStatusXp").text("XP " + userxp + " / " + usermaxxp);
}

function battleCreate(level, index) {
    "use strict";
    level = this.level;
    monsterxp = level * 10;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            $("#game").append(xmlHttp.responseText);
            $("#enemyBattleName").text(level);
            $("#playerBattleName").text(user[index].name);
            $("#attack").on("click", function () {
                removeBattle(monsterxp);
                user[index].xp = parseInt(user[index].xp) + parseInt(monsterxp);
                user[index].gold = parseInt(user[index].gold) + parseInt(monsterxp);
                if (user[index].xp > Math.ceil(Math.pow(3, (user[index].level - 1) / 7) * 100)) {
                    user[index].xp -= Math.ceil(Math.pow(3, (user[index].level - 1) / 7) * 100);
                    user[index].level = parseInt(user[index].level) + 1;
                    usermaxxp = Math.ceil(Math.pow(3, (user[index].level - 1) / 7) * 100);
                    user[index].att = Math.floor(Math.pow(1.07, user[index].level - 1) * 10);
                    user[index].def = Math.floor(Math.pow(1.06, user[index].level - 1) * 10);
                    $("#mapStatusXp").text("XP " + user[index].xp + " / " + usermaxxp);
                    $("#mapStatusLevel").text("Level " + user[index].level);
                    $("#mapStatusAtt").text("Level " + user[index].att);
                    $("#mapStatusDef").text("Level " + user[index].def);
                }
                $("#mapStatusGold").text("Gold " + user[index].gold);
                $.ajax({
                    type: "POST",
                    url: "json.php",
                    data: {
                        users: user
                    }
                });
            });
        }
    };
    xmlHttp.open("POST", "battle.html", true);
    xmlHttp.send();
}

function mapCreate(index) {
    "use strict";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            $("#game").append(xmlHttp.responseText);

            username = user[index].name;
            userlevel = parseInt(user[index].level);
            userhp = Math.floor(Math.pow(1.05, userlevel - 1) * 100);
            usermaxhp = userhp;
            userhpbar = (userhp / usermaxhp) * 100;
            userxp = parseInt(user[index].xp);
            usermaxxp = Math.ceil(Math.pow(3, (userlevel - 1) / 7) * 100);
            usergold = parseInt(user[index].gold);
            useravatar = user[index].avatar;
            useratt = Math.floor(Math.pow(1.07, userlevel - 1) * 10);
            userdef = Math.floor(Math.pow(1.06, userlevel - 1) * 10);
            $("#mapStatusName").text(username);
            $("#mapStatusLevel").text("Level " + userlevel);
            $("#mapStatusHp").text("HP " + userhp + " / " + usermaxhp);
            $("#mapStatusXp").text("XP " + userxp + " / " + usermaxxp);
            $("#mapStatusGold").text("Gold " + usergold);
            $("#mapStatusAvatar").attr("src", "img/" + useravatar + ".png");
            $("#mapStatusAtt").text("Att " + useratt);
            $("#mapStatusDef").text("Def " + userdef);
            $("button[id*='level']").click(function () {
                level = this.id.replace("level", "");
                battleCreate(level, index);
            });
        }
    };
    xmlHttp.open("POST", "map.html", true);
    xmlHttp.send();
}

function aspect() {
    "use strict";
    var width, height, margin, renew;
    width = $(window).width() - 4;
    height = $(window).height() - 4;
    if (width / height < 16 / 9) {
        renew = width * 9 / 16;
        margin = (height - renew) / 2;
        $("#game").css("margin-left", "0");
        $("#game").css("margin-top", margin);
        $("#game").width(width);
        $("#game").height(renew);
        fontsize = (renew - 4) / 15;
        $("body").css("font-size", fontsize);
        $("body").css("line-height", fontsize);
        $("#loginFrame svg").height(fontsize * 2);
        $("#createUser svg").height(fontsize * 2);
    } else if (width / height > 16 / 9) {
        renew = height * 16 / 9;
        margin = (width - renew) / 2;
        $("#game").css("margin-left", margin);
        $("#game").css("margin-top", "0");
        $("#game").width(renew);
        $("#game").height(height);
        fontsize = (height - 4) / 15;
        $("body").css("font-size", fontsize);
        $("body").css("line-height", fontsize);
        $("#loginFrame svg").height(fontsize * 2);
        $("#createUser svg").height(fontsize * 2);
    } else if (width / height === 16 / 9) {
        $("#game").css("margin-left", "0");
        $("#game").css("margin-top", "0");
        $("#game").width(width);
        $("#game").height(height);
        fontsize = (height - 4) / 15;
        $("body").css("font-size", fontsize);
        $("body").css("line-height", fontsize);
        $("#loginFrame svg").height(fontsize * 2);
        $("#createUser svg").height(fontsize * 2);
    }

}

function login() {
    "use strict";
    var usernameInput, usernameCheck, userpassInput, userpassCheck;
    var userNotCorrect = 0;

    $.getJSON("js/users.json", {
        format: "json"
    }).done(function (data) {
        user = data;
        usernameInput = $("#loginUsername").val().toLowerCase();
        userpassInput = $("#loginPassword").val();
        for (i = 0; i < user.length; i++) {
            usernameCheck = user[i].name.toLowerCase();
            userpassCheck = user[i].pass;
            if (usernameInput === usernameCheck) {
                if (userpassInput === userpassCheck) {
                    $("#login").hide();
                    mapCreate(i);
                    userNotCorrect++;
                }
            }
        }
        if (userNotCorrect == 0) {
            alert("Username/Password not correct")
        }
    });
}

function logout() {
    $.ajax({
        type: "POST",
        url: "json.php",
        data: {
            users: user
        }
    }).done(function () {
        $("#map").remove();
        $("#login").css("display", "block");
    });
};

//Dom loaded
$(document).ready(function () {
    "use strict";
    $("#playerBattle").load();
});


//Dom + images loaded
$(window).on("load", function () {
    "use strict";
    aspect();
    loginCreate();
});

//Screen resize
$(window).on("resize", function () {
    "use strict";
    aspect();
});