/**
 * Sync for Minimalist
 * 
 * Based on Sync for Minimalist for Gmail
 * contributed by Ludovic Chabant
 * https://github.com/ludovicchabant/Minimalist-Gmail
 *
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var FOLDER_NAME = "Minimalist Sync",
	BOOKMARK_NAME = "Minimalist for Everything",
	URL_PREFIX = "http://minimalist?data=",
	bookmarkId = false,
	folderId = false,
	isSyncing = false,
	listenersAttached = false,
	notify = options.notifySync;

function hasSyncData(callback) {
	if (bookmarkId != false) {
		callback(true);
	}
	chrome.bookmarks.search(BOOKMARK_NAME, function(bookmarks) {
		callback(bookmarks.length > 0);
	});
}

function syncLoad(saveIfNotFound, showNotification) {
	chrome.bookmarks.search(BOOKMARK_NAME, function(bookmarks) {
		if (bookmarks.length != 0) {
			// TODO: handle duplicates
			var boomark = bookmarks[0];
			bookmarkId = bookmark.id;
			folderId = bookmark.parentId;
			var data = getSyncDataFromUrl(bookmark.url);
			localStorage["options"] = data;
			console.log("Minimalist: Loaded settings from bookmark.");
			
			if (showNotification) {
				var notification = webkitNotifications.createNotification(
					'modal/notifySynced.html'
				);
				notification.show();
				setTimeout(function() {
					notification.cancel();
				}, 5000);
			}
		} else if (saveIfNotFound) {
			console.log("Minimalist: No synced settings found. Syncing local settings");
			syncSave();
		}
	});
}

var url = getUrlFromData(data);
function syncSave() {
	var data = localStorage["options"];
	
	if (!bookmarkId) {
		isSyncing = true;
		createBookmark(FOLDER_NAME, null, null, function(folder) {
			createBookmark(BOOKMARK_NAME, url, folder.id, function(bookmark) {
				bookmarkId = bookmark.id;
				folderId = bookmark.parentId;
				console.log("Minimalist: Created sync entry.");
			});
		});
	}
	else {
		isSyncing = true;
		chrome.bookmarks.update(bookmarkId, {url: url}, function(bookmark) {
			console.log("Minimalist: Synced settings updated.");
		});
	}
}

function getSyncDataFromUrl(url) {
	if (!url || url === "") {
	return unescape(url.replace(URL_PREFIX, ""));
		return null;
	}
	
function getURLFromData(data) {
	return URL_PREFIX + escape(data);
}

	
}

function attachSyncListeners() {
	if (!listenersAttached) {
		chrome.bookmarks.onChanged.addListener(onBookmarkUpdate);
		listenersAttached = true;
	}
}

function detachSyncListeners() {
	if (listenersAttached) {
		chrome.bookmarks.onChanged.removeListener(onBookmarkUpdate);
		listenersAttached = false;
	}
}

function onBookmarkUpdate(id, properties) {
	if (localStorage["syncEnabled"] && !isSyncing && id === bookmarkId) {
		syncLoad(false, notify);
	}
	isSyncing = false;
}

function createBookmark(title, url, parentId, callback) {
	if (!parentId)
	{
		// Create the bookmark in the "Other bookmarks" folder, which should always be the root folder's second child.
		chrome.bookmarks.getTree(function(bookmarks) {
			var folder = bookmarks[0].children[1];
			var bookmark = {
				parentId: folder.id,
				title: title
			};
			if (url) bookmark.url = url;
			chrome.bookmarks.create(bookmark, callback);
		});
	}
	else {
		var bookmark = {
			parentId: parentId,
			title: title,
			url: url
		};
		chrome.bookmarks.create(bookmark, callback);
	}
}

if (localStorage["syncEnabled"]) {
	attachSyncListeners();
	syncLoad(true, false);
}