/**
 * Sync for Minimalist
 * 
 * dependencies: bookmark.js
 *
 * Based on Sync for chrome extensions
 * Copyright (c) 2010 Ankit Ahuja
 * Dual licensed under GPL and MIT licenses.
 **/

var FOLDER = 'Minimalist_Sync',
	BOOKMARK = 'Minimalist_for_Everything',
	URL_PREFIX = 'http://minimalistsuite.com?data=',
	bookmarkId = null,
	folderId = null,
	wasJustUpdated = false;

function syncLoad() {
	if (KILLSYNC) {
		return;
	}
	lastSync = localStorage['lastSync'];
	chrome.bookmarks.search(BOOKMARK, function(results) {
		if (results.length != 0) {
			var bookmark = results[0],
				data = getSyncDataFromUrl(bookmark.url),
				syncTime = parseInt(data.split('%%%')[0], 10);
			bookmarkId = bookmark.id;
			folderId = bookmark.parentId;
			
			if (results.length > 1) {
				for (var i = 1, l = results.length; i < l; i++) {
					if (results[i].parentId != bookmark.parentId) {
						chrome.bookmarks.removeTree(results[i].parentId);
					} else {
						chrome.bookmarks.remove(results[i].id);
				   	}
				}
			}
			if (lastSync == null || parseInt(data.split('%%%')[0], 10) > lastSync) {
				debug('loading settings from bookmark');
				data = data.split('%%%')[1];
				lastSync = syncTime;
				setRawData({isSyncing: data.split('###')[1].split('|||')[0], isEnabled: data.split('###')[1].split('|||')[1]}, data.split('###')[1].split('|||').slice(2));
			} else if (parseInt(data.split('%%%')[0], 10) == lastSync) {
				debug('sync up to date');
			} else {
				syncSave(false);
			}
		} else {
			if (modules.length > 0) {
				debug('no synced settings found. Syncing local settings');
				syncSave(false);
			}
		}
	});
}

function syncSave(isSaved) {
	if (KILLSYNC) {
		return;
	}
	var url = getUrlFromData(getRawData());
	wasJustUpdated = true;
	
	if (bookmarkId == null) {
		chrome.bookmarks.search(FOLDER, function(results) {
			if (results.length > 0) {
				createBookmark(BOOKMARK, url, results[0].id, function(bookmark) {
					bookmarkId = bookmark.id;
					folderId = bookmark.parentId;
					wasJustUpdated = false;
					debug('created sync entry');
				});
			} else {
				createBookmark(FOLDER, null, null, function(folder) {
					createBookmark(BOOKMARK, url, folder.id, function(bookmark) {
						bookmarkId = bookmark.id;
						folderId = bookmark.parentId;
						wasJustUpdated = false;
						debug('created sync entry');
					});
				});
			}
		});
	} else {
		chrome.bookmarks.update(bookmarkId, {url: url}, function(bookmark) {
			wasJustUpdated = false;
			debug('synced settings updated.');
		});
	}

	if (!isSaved) {
		save();
	}
}

function getSyncDataFromUrl(url) {
	if (url != '' && url != URL_PREFIX) {
		return unescape(url.substr(URL_PREFIX.length + 1));
	}
	return null;
}
	
function getUrlFromData(data) {
	lastSync = (new Date()).getTime();
	return URL_PREFIX + lastSync + '%%%' + escape(data);
}

function attachSyncListeners() {
	if (KILLSYNC) {
		return;
	}
	chrome.bookmarks.onChanged.addListener(onBookmarkUpdate);
}

function detachSyncListeners() {
	chrome.bookmarks.onChanged.removeListener(onBookmarkUpdate);
}

function onBookmarkUpdate(id, properties) {
	if (id === bookmarkId && !wasJustUpdated) {
		syncLoad();
	}
}

function createBookmark(title, url, parentId, callback) {
	if (parentId == null) {
		// Create the bookmark in the 'Other bookmarks' folder, which should always be the root folder's second child.
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