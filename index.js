var n1, n2, div2, div3;
function fun1() {
    div2 = document.getElementById("edit1");
    div3 = document.getElementById("edit2");
    n1 = parseInt(div2.value);
    n2 = parseInt(div3.value);
}

var div1 = document.getElementById("result");

function getval() {
    let url = document.getElementById("form1").value;
    let equal;
    let flag = 0;
    let length = url.length;
    let j = 0;
    while (length != 0) {
        console.log(length);
        if (url[j] == "=") {
            equal = j;
            flag++;
        }
        j++;
        length--;
    }
    if (flag == 0) {
        return url;
    }
    if (flag == 1) {
        return url.slice(equal + 1, equal + 35);
    }
}

const cal = document.getElementById("cal");

cal.addEventListener("click", function () {
    cal.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`;
    getval();
    fun1();
    init(); 
});

async function init() {
    var time = 0;
    var total;
    var gettime = 0;
    const mykey = "AIzaSyAW00aK4GNjxhzMKBJomJ-L6To1EoqZbyc";
    const playListID = getval();
    let pageToken = '';
    
    do {
        let response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken,pageInfo&key=${mykey}&playlistId=${playListID}&pageToken=${pageToken}`);
        let data = await response.json();
        let resultCount = data.pageInfo.totalResults;
        total = resultCount;

        if (div2.value === '') {
            n1 = 1;
        }
        if (n1 > resultCount || n1 > n2) {
            div1.innerHTML = "Please fill correct video number.";
            cal.innerHTML = "Calculate";
            return;
        }
        if (n2 > resultCount) {
            n2 = resultCount;
        }
        if (div3.value === '') {
            n2 = resultCount;
        }

        for (let i = 0; i < data.items.length; i++) {
            if (i >= n1 - 1 && i < n2) {
                if (!data.items[i].contentDetails) {
                    continue;
                }
                let content = data.items[i].contentDetails.videoId;
                let respond = await fetch(`https://www.googleapis.com/youtube/v3/videos?&part=contentDetails&key=${mykey}&id=${content}&fields=items/contentDetails/duration`);
                let durate = await respond.json();

                if (!durate.items[0]) {
                    continue;
                }
                time += YTDurationToSeconds(durate.items[0].contentDetails.duration);
                gettime += YTDurationToSeconds(durate.items[0].contentDetails.duration);
            }
        }

        pageToken = data.nextPageToken;
    } while (pageToken);

    console.log("TOTAL TIME IS : ", gettime);

    addondisplay(gettime, total);
    atspeed(gettime / 1.25, 1.25);
    atspeed(gettime / 1.50, 1.50);
    atspeed(gettime / 1.75, 1.75);
    atspeed(gettime / 2.00, 2.00);
}

function YTDurationToSeconds(duration) {
    var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    match = match.slice(1).map(function (x) {
        if (x != null) {
            return x.replace(/\D/, '');
        }
    });

    var hours = (parseInt(match[0]) || 0);
    var Minute = (parseInt(match[1]) || 0);
    var seconds = (parseInt(match[2]) || 0);

    return hours * 3600 + Minute * 60 + seconds;
}

function addondisplay(time, total) {
    var hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    var Minutes = Math.floor(time / 60);
    time = Math.floor(time - Minutes * 60);
    div1.innerHTML = `Total Videos in playlist : ${total}<br><br>`;
    div1.innerHTML += `Length of playlist from Video No. ${n1} to ${n2} is : ${hours} Hours, ${Minutes} Minutes, ${time} seconds<br><br>`;
}

function atspeed(time, speed) {
    var hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    var Minutes = Math.floor(time / 60);
    time = Math.floor(time - Minutes * 60);
    speed = speed.toFixed(2);
    div1.innerHTML += `At ${speed}x : ${hours} Hours, ${Minutes} Minutes, ${time} seconds<br><br>`;
    document.getElementById("form1").value = '';
    div2.value = '';
    div3.value = '';
    cal.innerHTML = "Calculate";
}
