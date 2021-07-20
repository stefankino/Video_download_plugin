var links = [];

// Display all links in the table dom element.
// TODO: add maybe a simple template engine...
//this code is only can useing in the format data


chrome.extension.onRequest.addListener(function(videosData) {
  for (var index in videosData) {
    links.push(videosData[index]);
  }
  showLinks();
});

window.onclick = function() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'scrape_video_urls.js', allFrames: true});
    });
  });
};

function showLinks() {

  console.log("links", links);
  document.getElementById("notifications").innerHTML = links.length ?
      '' :
      'No videos found';

  if (!links.length) {
    return;
  }

  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 0) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1]);
  }

  for (var i = 0; i < links.length; i++) {

    // icon to download
    var list = document.createElement('td');
    var videoimag = document.createElement('img');
    videoimag.src = 'assets/down_arrow.png';
    videoimag.title = 'Download video';
    videoimag.setAttribute('data-url', links[i].url);
    videoimag.onclick = function(event) {
      chrome.downloads.download({
        url: event.target.getAttribute('data-url'),
        saveAs: true
      }, function(id) {});
    };
    list.appendChild(videoimag);

    // icon to open in new window
    var list1 = document.createElement('td');
    var imgOpen = document.createElement('img');
    imgOpen.src = 'assets/new_window.png';
    imgOpen.title = 'Open video in new tab';
    imgOpen.setAttribute('data-url', links[i].url);
    imgOpen.onclick = function(event) {
      chrome.tabs.create({
        url: event.target.getAttribute('data-url'),
        active: false
      });
    };
    list1.appendChild(imgOpen);

    var list2 = document.createElement('td');
    list2.innerText = links[i].name;
    list2.style.whiteSpace = 'nowrap';

    var row = document.createElement('tr');
    row.appendChild(list);
    row.appendChild(list1);
    row.appendChild(list2);
    linksTable.appendChild(row);
  }
}