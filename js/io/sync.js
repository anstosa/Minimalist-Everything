/**
 * Sync for Minimalist
 * 
 * dependencies: bookmark.js
 *
 * Based on Sync for chrome extensions
 * Copyright (c) 2010 Ankit Ahuja
 * Dual licensed under GPL and MIT licenses.
 **/

var FOLDER = "Minimalist Sync",
	BOOKMARK = "Minimalist_for_Everything",
	URL_PREFIX = "http://minimalistsuite.com?data=",
	bookmarkId = null,
	folderId = null;

function syncLoad() {
	lastSync = localStorage["lastSync"];
	chrome.bookmarks.search(BOOKMARK, function(results) {
		if (results.length > 0) {
			// TODO: handle duplicates
			var bookmark = results[0];
			bookmarkId = bookmark.id;
			folderId = bookmark.parentId;
			var data = getSyncDataFromUrl(bookmark.url);
			if (lastSync == null || data.split("%%%")[0] > lastSync) {
				data = data.split("%%%")[1];
				setRawData({isSyncing: data.split("###")[1].split("|||")[0], isEnabled: data.split("###")[1].split("|||")[1]}, data.split("###")[1].split("|||").slice(2));
				lastSync = (new Date()).getTime();
				save();
				debug("loaded settings from bookmark");
			} else {
				syncSave();
			}
		} else {
			if (modules.length > 0) {
				debug("no synced settings found. Syncing local settings");
				syncSave();
			}
		}
	});
}

function syncSave() {
	var url = getUrlFromData(getRawData());
	
	if (bookmarkId == null) {
		chrome.bookmarks.search(FOLDER, function(results) {
			if (results.length > 0) {
				createBookmark(BOOKMARK, url, results[0].id, function(bookmark) {
					bookmarkId = bookmark.id;
					folderId = bookmark.parentId;
					debug("created sync entry");
				});
			} else {
				createBookmark(FOLDER, null, null, function(folder) {
					createBookmark(BOOKMARK, url, folder.id, function(bookmark) {
						bookmarkId = bookmark.id;
						folderId = bookmark.parentId;
						debug("created sync entry");
					});
				});
			}
		});
	} else {
		chrome.bookmarks.update(bookmarkId, {url: url}, function(bookmark) {
			debug("synced settings updated.");
		});
	}
}

function getSyncDataFromUrl(url) {
	if (url != "" && url != URL_PREFIX) {
		return unescape(url.substr(URL_PREFIX.length + 1))
	}
	return null
}
	
function getUrlFromData(data) {
	return URL_PREFIX + (new Date()).getTime() + "%%%" + escape(data);
}

function attachSyncListeners() {
	chrome.bookmarks.onChanged.addListener(onBookmarkUpdate);
}

function onBookmarkUpdate(id, properties) {
	if (id === bookmarkId) {
		syncLoad();
	}
}

function createBookmark(title, url, parentId, callback) {
	if (parentId == null) {
		// Create the bookmark in the "Other bookmarks" folder, which should always be the root folder's second child.
		chrome.bookmarks.getTree(function(results) {
			var folder = results[0].children[1],
				bookmark = {
					parentId: folder.id,
					title: title
				};
			if (url != null) {
				bookmark.url = url;
			}
			chrome.bookmarks.create(bookmark, callback);
		});
	} else {
		var bookmark = {
			parentId: parentId,
			title: title,
			url: url
		};
		chrome.bookmarks.create(bookmark, callback);
	}
}