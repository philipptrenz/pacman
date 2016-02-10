/*
 * This function pauses the game and shows the input field for saving.
 */
function savenewgame() {
    // pause game
    isRunning = false;
    // show savegameform
    document.getElementById("savegameform").style.display = 'inline-block';

    // hide save and load buttons
    document.getElementById("saveandloadbuttons").style.display = 'none';

    // set focus on input field
    document.getElementById("cookiename").focus();
    
    // hide loadgameform
    document.getElementById("loadgameform").style.display = 'none';

    // show cancel button
    document.getElementById("cancelbutton").style.display = 'inline';
}

/*
 * This function sets a new cookie with the entered name and the values of level and life.
 */
function setNewCookie() {
    // get name from savegameform
    var nickname = document.getElementById('cookiename').value;
    if (!nickname || 0 === nickname.length) {
        var date = new Date();
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Dec"];
        nickname = month[date.getMonth()]+"-"+date.getDate()+"-"+date.getFullYear()+"_"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    }

    console.log(nickname)

    var expireDate = new Date();
    expireDate = new Date(expireDate.getTime()+1000*60*60*24);
    expireDate = expireDate.toGMTString();

    // save new cookie
    document.cookie = nickname+'='+level+'|'+life+'; expires='+expireDate+';';

    closesaveorload();
}

/*
 * This function pauses the game, shows the select pane and loads every cookie as option to the select pane.
 */
function getAllCookies() {
    // pause game
    isRunning = false;
    // show loadgameform
    document.getElementById("loadgameform").style.display = 'inline-block';

    // hide savegameform
    document.getElementById("savegameform").style.display = 'none';

    // hide save and load buttons
    document.getElementById("saveandloadbuttons").style.display = 'none';

    // show cancel button
    document.getElementById("cancelbutton").style.display = 'inline';

    var values = new Array();

    // get cookie values
    var cookie = document.cookie;
    while (cookie.indexOf(';') != -1) {
        var index = cookie.indexOf('; ');
        var temp = cookie.substr(0, index);
        cookie = cookie.substr(index+2);

        values[values.length] = temp;
    }
    if (cookie.length > 0) values[values.length] = cookie;

    var select = document.getElementById('cookieselect');

    var before = "<option value='";
    var middle = "'>";
    var after = "</option>";
    
    select.innerHTML = before+"' style='display: none;' selected>Choose your game"+after;
    select.innerHTML += before+"0|"+quantityOfLifes+middle+"Level 1"+after;

    /* just for developement *
    for (var i = 1; i < levelImages; i++) {
        select.innerHTML += before+i+"|"+quantityOfLifes+middle+"Level "+(i+1)+after;
    }
    * --------------------- */
   
    for (var i = 0; i < values.length; i++) {
        tempvalue = values[i];

        var sign = tempvalue.indexOf('=');
        var cookiename = tempvalue.substr(0, sign);
        var cookievalue = tempvalue.substr(sign+1)

        select.innerHTML += before+cookievalue+middle+cookiename+after;
    }

}

/*
 * This function loads the game depending on the selected option from the select pane.
 */
function loadnewgame() {

    var x = document.getElementById("cookieselect");
    var cookievalue = x.options[x.selectedIndex].value;

    var sign = cookievalue.indexOf('|');

    var templevel = parseInt(cookievalue.substr(0, sign));
    var templife = parseInt(cookievalue.substr(sign+1));

    if (typeof templevel === 'number' && typeof templevel === 'number') {
        level = templevel;
        life = templife;

        clearInterval(interval);
        direction = 0;
        dots = null;
        borders = null;
        isRunning = false;
        isBeginning = true;
        initial();
    } else {
        console.log("something went wrong while loading the game.");
    }
    
    closesaveorload();
}

/*
 * This function closes the save input field and the select pane if it is open.
 */
function closesaveorload() {
	// hide savegameform
    document.getElementById("savegameform").style.display = 'none';

	// hide loadgameform
    document.getElementById("loadgameform").style.display = 'none';

    // hide cancel button
    document.getElementById("cancelbutton").style.display = 'none';

	// show save and load buttons
    document.getElementById("saveandloadbuttons").style.display = 'inline';
}


