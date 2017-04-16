# Minimalist for Everything

## What Does it Do?
  * Centralized script and style management
  * Core Modules that customize web experience
  * Easily develop and deploy custom styles and scripts


## Permissions

#### "tabs"
  * This permissions results in the "This extensions can access your tabs and browsing activity" warning.
  * I *NEVER* store or transmit your browsing activity.
  * I need this permission to check the URL of websites so I know which module to activate (if any).
  * This permission is also used to refresh tabs and open new tabs (only when initiated by you, the user).

#### "all_urls"
  * This permission results in the "This extension can access your data on all websites" warning.
  * I *NEVER* access, read, modify, store, or transmit your personal data.
  * I need this permission to run user scripts on specific pages in the browser.
  * I need access to all sites because Minimalist Modules can apply to any site.

  Want to check for yourself? Go to [https://github.com/anstosa/Minimalist-Everything] to see the entire source code.


## Features

  * Powerful, easy-to-use options pages for modules
  * Pages and pages of customization options for Gmail
  * Syntax highlighting in module code editor


## Changelog

#### 0.7.0 (Apr 13, 2017)
 * Changed: Minor code refactor to modern-ish standards
 * Fixed: UI and engine broken
 * Removed: Third-party site imports
 * Removed: Pages in dashboard with obsolete information
 * Removed: Screenshots

#### 0.6.8 (Jul 25, 2013)
 * Changed: Migrated update notification to Notification Center API
 * Fixed: Section label display issue in Dashboard
 * Fixed: (UserScripts.org) Fixed import
 * Fixed: (Gmail) Hide Search not working
 * Fixed: (Gmail) Hide Back button not working
 * Fixed: (Gmail) Hide Chat Search box not working
 * Fixed: (Gmail) Hide Call phone button not working
 * Fixed: (Gmail) Hide storage manage link not working
 * Removed: (Gmail) Hide Chat invisible message
 * Removed: (Gmail) Hide Chat statuses
 * Removed: (Gmail) Hide offline contacts
 * Removed: (Gmail) Hide away contacts
 * Removed: (Reader) Google Reader module :-(

#### 0.6.7 (Feb 03, 2013)
 * Added: Repair Core Modules option in Data. This will restore your core modules while preserving your options
 * Fixed: (Reader) Open items in background not working with highlighted items

#### 0.6.6 (Feb 03, 2013)
 * Fixed: Downloading data from sync breaking modules

#### 0.6.5 (Feb 03, 2013)
 * Fixed: Upload Data button not responding after data uploaded

#### 0.6.4 (Feb 03, 2013)
 * Added: Basic sync support
 * Added: Permission request for storage to make the new sync method possible
 * Added: Support for https:// import from userscript, userstyles and stylebot
 * Changed: Import now overwrites conflicting modules and leaves others alone
 * Changed: Update notifications for minor updates
 * Changed: Copy code button is visible whenever there is something to be copied
 * Fixed: (Gmail) Hide Storage not working in some non-US locales
 * Fixed: (Gmail) Hide Storage Manage not working in some non-US locales
 * Fixed: (Gmail) Hide Call Phone button hiding other buttons
 * Fixed: (Gmail) Hide reply placeholder also hiding reply compose window
 * Fixed: Install from UserScripts not working
 * Fixed: Install from UserStyles not working
 * Fixed: Install from StyleBot not working
 * Fixed: Import data not working
 * Fixed: Legacy modules will remove themselves automatically
 * Fixed: Button overlap glitches on hover
 * Removed: Support for old export styles. It was making it too easy for people to break things
 * Removed: Unnecessary or deprecated permissions: contextMenus, bookmarks

#### 0.6.3 (Jan 24, 2013)
 * Fixed: Database migration failing for legacy accounts

#### 0.6.2 (Jan 23, 2013)
 * Fixed: update notification opens the correct pages now

#### 0.6.1 (Jan 23, 2013)
 * Fixed: syntax error in master data file

#### 0.6.0 (Jan 23, 2013)
 * Added: Minor UI facelift
   * FontAwesome for icons
   * Roboto for fonts
   * Moved to flexboxes for complex layout
   * CSS modernization
   * Other misc tweaks
 * Added: Minor UX improvements
 * Added: Refactored and modernized entire codebase
 * Added: (Gmail) m4a support in better attachment icons
 * Changed: Changed editors from Ace to CodeMirror
 * Changed: Moved screenshot data for core modules to file instead of module storage
 * Changed: Changed module API for variable access from MIN. to _min.
 * Changed: (Gmail) Refactored and modernized all options
 * Changed: (Gmail) Moved Google User section to Header tab
 * Changed: (Gmail) Hide user photos also hides point of Share button
 * Changed: (Gmail) Hiding the last button in a group uses a more reliable method or preserving the gutter
 * Changed: (Gmail) Performance and reliability improvements for highlight starred items
 * Changed: (Gmail) Performance and reliability improvements for highlight selected
 * Changed: (Gmail) Reliability improvements for hide unstarred stars
 * Changed: (Gmail) Hide zero-inbox Google Reader ad to Hide Zero-inbox message
 * Fixed: Dashboard not loading
 * Fixed: Active browserAction icon now has a transparent background
 * Fixed: (Gmail) Hide Google Bar
     * Not appearing correctly
     * Toggling when using new compose window
 * Fixed: (Gmail) Hide Header
     * Not appearing correctly
     * Toggling when using compose window
 * Fixed: (Gmail) Show checkbox tools list not hiding button or repositioning sidebars
 * Fixed: (Gmail) Hide back not working
 * Fixed: (Gmail) Hide report spam not working
 * Fixed: (Gmail) Hide delete not working
 * Fixed: (Gmail) Hide Move to Inbox not working
 * Fixed: (Gmail) Hide Refresh not working
 * Fixed: (Gmail) Hide Move to not working
 * Fixed: (Gmail) Hide Labels not working
 * Fixed: (Gmail) Hide More working
 * Fixed: (Gmail) Hide page count not working
 * Fixed: (Gmail) Hide page navigation not working
 * Fixed: (Gmail) Hide Preview Pane button not working
 * Fixed: (Gmail) Highlight read items not working
 * Fixed: (Gmail) Highlight unread items not Fixed
 * Fixed: (Gmail) Hide reply placeholder not working
 * Fixed: (Gmail) Hide sidebar ads not working
 * Fixed: (Gmail) Hide trash message only partially hiding message
 * Fixed: (Gmail) Hide call phone not working
 * Fixed: (Gmail) Hide storage not working
 * Fixed: (Gmail) Hide storage management not working
 * Fixed: (Gmail) Hide legal not working
 * Fixed: (Gmail) Hide account activity not working
 * Fixed: (Reader) Open items in background not working
 * Fixed: (Reader) Hide Google Bar not working
 * Fixed: (Reader) Hide background and border not working
 * Removed: Body JS. That was just silly.
 * Removed: (Gmail) Hide Google links. Redundant
 * Removed: (Gmail) Hide Google settings. No longer necessary
 * Removed: (Gmail) Hide Google+ link. No longer necessary
 * Removed: (Gmail) Hide privacy link. Reprioritization
 * Removed: (Gmail) Right align share button. No longer necessary
 * Removed: (Gmail) Add + operand support in search. No longer necessary
 * Removed: (Gmail) Hide More tip. No longer necessary
 * Removed: (Gmail) Hide consider including. No easy CSS solution. May re-introduce later.
 * Removed: (Gmail) Hide "Invite X to Gmail". No longer necessary
 * Removed: (Gmail) Hide Chat title bar. No longer necessary
 * Removed: (Gmail) Hide Me in Chat. No longer necessary
 * Removed: (Gmail) Hide Set Status. No longer necessary
 * Removed: (Gmail) Hide Invites. No longer necessary
 * Removed: (Gmail) Collapse gadget pane.
 * Removed: (Reader) Animate transitions. As elegant as a sawed off shotgun...
 * Removed: (Reader) Hide Google Links. Redundant
 * Removed: (Reader) Right align share button. No longer necessary
 * Removed: (Reader) Hide Google+ link. No longer necessary
 * Removed: (Reader) Hide privacy link. Reprioritization
 * Removed: (Reader) Hide Google settings. No longer necessary
 * Removed: (Reader) Hide Search filter. No longer necessary
 * Removed: (Reader) Hide Snippet view. Not necessary
 * Removed: (Reader) Hide Reader blog. Not necessary
 * Removed: (Reader) Hide Send to. Not necessary

#### 0.5.20 (Jan 11, 2013)
 * Fixed: new rgba colors broken by save button (prepends "#")

#### 0.5.19 (Jan 11, 2013)
 * Fixed: Auto-update didn't fire because I forgot to increment a version number

#### 0.5.18 (Jan 11, 2013)
 * Added: Reset settings buttong (database persists across reinstalls)
 * Fixed: openTab event handling not working because of new content-script sandboxing in dev channel
 * Fixed: Export/Import everything not working
 * Fixed: Minimalist icon looking bad on dark backgrounds
 * Fixed: Userscripts not importing with @includes when declared.
 * Fixed: (Gmail) Hide Compose + Hide Mail/Contacts/Tasks makes top sidebar items unclickable
 * Fixed: (Gmail) Highlight starred items only working for standard star (may have only fixed English language)
 * Fixed: (Gmail) Hide chat hiding resize handle
 * Fixed: (Reader) New subscription popup obscured by new Google Bar when Subscription button hidden
 * Removed: (Gmail) Animate transitions
 * Removed: (Gmail) Hide new look popup

#### 0.5.17 (Dec 03, 2011)
 * Added: (Gmail) Force Refresh to show in split-pane view
 * Added: (Gmail) Collapse Gadget Pane
 * Added: (Reader) Hide Send to
 * Added: (Reader) Better item style (some styles by david.rixon)
 * Added: Ability to delete screenshots from features
 * Changed: Color pickers now use rgba instead of hex to allow transparency
 * Fixed: (Gmail) Highlight Starred items not working consistently
 * Fixed: (Gmail) Highlight starred not working in non-english Gmail
 * Fixed: Import from userscripts.org not compatible with Black Canvas Script Handler (thanks jiefoxi)
 * MORE!: See 0.5.11 for more updates this version

#### 0.5.16t (Dec 03, 2011)
 * Fixed: Options page not accepting database data until extension reload

#### 0.5.15t (Dec 03, 2011)
 * Fixed: Storing legacy data exceeding localStorage data limit

#### 0.5.14t (Dec 03, 2011)
 * Changed: LocalStorage to WebkitIndexDB for module storage

#### 0.5.13t (Nov 30, 2011)
 * Changed: Testing for cause of "QUOTA_EXCEEDED_ERR: DOM Exception 22"

#### 0.5.12t (Nov 30, 2011)
 * Changed: Testing for cause of "QUOTA_EXCEEDED_ERR: DOM Exception 22"

#### 0.5.11t (Nov 30, 2011)
 * Added: (Gmail, Reader) Support for new Google Bar
 * Added: (Reader) Hide No Entries message
 * Added: (Reader) Hide Home sidebar
 * Added: (Reader) Custom sidebar width
 * Changed: (Gmail, Reader) Hide user photo no longer hides user name
 * Changed: (Gmail, Reader) Responsive layout changed from JS listeners to CSS media queries
 * Changed: (Gmail) Tweaked hide offline and hide away to be faster
 * Changed: Editor page scrolls to top when a new option is selected
 * Fixed: Re-initialization of Editor listeners causing each save to be progressively slower
 * Removed: (Reader) Force compact layout density (Google finally pushed the new settings menu and built-in responsive layout for Reader)

#### 0.5.10 (Nov 25, 2011)
 * Fixed: Typo on options page
 * Fixed: Export selected not exporting the correct module consistently

#### 0.5.9 (Nov 22, 2011)
 * Added: Import from [stylebot.me] (thanks jiefoxi)
 * Fixed: (Gmail) Hide Header breaking all following options that involve CSS

#### 0.5.8 (Nov 21, 2011)
 * Added: Toggle options on and off from edit page
 * Added: Change field values from options page
 * Added: (Gmail) Highlight checked items
 * Added: Hidden shortcuts to Options and Edit pages (Thanks jiefoxi). [ Ctrl ] + click module name for options page, [ Shift ] + Click for edit page
 * Added: Option to save changes without reloaded targetted pages. [ Shift ] + click Save or [ Ctrl ] + [ Shift ] + [ S ]
 * Changed: (Gmail) default highlight colors (#f3f3f3, #75b44b, #fff8b0, #ed6254, & #5eabff respectively)
 * Changed: Edit page can now extend to full width of browser window
 * Changed: Code editors to height of 300px (can't make them resizable because of limitation in ACE)
 * Fixed: (Gmail) Highlight unread items not working consistently
 * Fixed: (Gmail) Hide Google Bar fatally polluting global namespace on accounts without G+ profiles
 * Fixed: (Gmail) Hide Move To and Hide Labels hidding Settings on some accounts (Thanks jiefoxi)

#### 0.5.7 (Nov 21, 2011)
 * Added: (Gmail) Hide Labels
 * Added: (Gmail) Hide Move To
 * Added: (Gmail) Hide Back
 * Added: (Gmail) Hide Spam count
 * Added: (Gmail) Better attachment icon support: js, db, py, java, class, apk, jar
 * Changed: (Gmail) v9 better attachment icons
 * Fixed: (Reader) Items opening in background when typing [ v ] into field or textarea
 * Fixed: (Reader) Hide footer not working in list view
 * Fixed: (Gmail) Inconsistent or not functional options under Main > Toolbars
 * Fixed: (Gmail) Hide Google logo not working
 * Fixed: (Gmail) Hide Move To and Hide Labels causing Labels dropdown to loose anchor point

#### 0.5.6 (Nov 20, 2011)
 * Fixed: Display bug in popup

#### 0.5.5 (Nov 20, 2011)
 * Added: Tooltip in popup to make enable/disable action clearer
 * Added: (Gmail) Hide consider including
 * Added: "(disabled)" after the names of disabled modules in dashboard and popup
 * Changed: Enabling or disabling a module from the dashboard now refreshes the page. This should solve conflicts.
 * Fixed: (Gmail) Google Bar background covering up elements when Google Links were hidden
 * Fixed: (Gmail) Show checkbox tools list not working
 * Removed: Sync (again). It won't work because of limitations in Chrome. See: http://goo.gl/53Fg4

#### 0.5.4 (Nov 19, 2011)
 * Changed: (Gmail) Alerts appear even when header is hidden
 * Changed: (Gmail) [ / ] can no longer close the Google Bar (See next change)
 * Fixed: (Gmail) [ / ] while header is already open just focuses the search field instead of hidding the header
 * Fixed: (Gmail) Footer options not working in split pane mode
 * Fixed: (Gmail) Hide statuses not working
 * Fixed: (Gmail) Hide offline not working. Selector too specific.
 * Fixed: (Gmail) Hide away not working. Selector too specific.
 * Fixed: (Gmail) Hide more tip not working
 * Fixed: (Gmail) Highlight starred items not working consistently
 * Fixed: (Reader) Force comopact layout density not working consistently

#### 0.5.3 (Nov 18, 2011)
 * Added: Sync is back and hopefully more stable (it still doesn't work all the time but it won't slow down Chrome anymore.)
 * Added: (Reader) Force compact layout density
 * Added: (Reader) Hide row borders in list view
 * Fixed: (Reader) Layout density is set at page load and not at first resize
 * Fixed: (Gmail) Hide Mail dropdown not working
 * Fixed: (Gmail) Hide compose button not working
 * Fixed: (Gmail) Hide chat not working
 * Fixed: (Gmail) Hide more tip not working
 * Fixed: (Gmail) Keyboard shortcuts for highlight selected not working
 * Fixed: (Gmail) Hide search button not working
 * Fixed: (Gmail) Hide background and border not working
 * Fixed: (Gmail) Hide Google Links not hiding background and border
 * Fixed: (Gmail) Hide unstarred stars not working
 * Fixed: (Gmail) Show checkbox tools list not working

#### 0.5.2 (Nov 15, 2011)
 * Fixed: Syntax error in manifest

#### 0.5.1 (Nov 15, 2011)
 * Fixed: (Gmail) Highlight starred items not working
 * Fixed: (Gmail) Highlight selected items not working with keyboard shortcuts
 * Removed: Sync (temporarily). It is too unstable for public use at the moment. I'll get it back ASAP

#### 0.5.0 (Nov 15, 2011)
 * Changed: Incremented version to trigger update notification

#### 0.4.9t (Nov 15, 2011)
 * Added: Custom event 'openTab'. $('#openTab').innerHTML() is the url and $('#openTab').attr('selected') is whether the tab should open in the foreground.
 * Added: (Reader) Core Google Reader module
 * Changed: (Gmail) Moved Show checkbox tools list from bottom of Toolbar section to 3rd from top
 * Changed: (Gmail) Hide Google Bar is toggleable by clicking the toggle bar, ( \ ) or ( / )
 * Changed: (Gmail) Hide Header is toggleable by clicking the toggle bar, ( \ ) or ( / )
 * Fixed: All UserScripts and UserStyles reporting as installed
 * Fixed: Hover previews getting stretched or loading out of the viewport if they were too tall for the
 * Fixed: (Gmail) Header not hiding
 * Fixed: (Gmail) Hide new look popup not working for some (thanks jiefoxi)
 * Fixed: (Gmail) Hide bottom ads not working in split-pane mode (thanks jiefoxi)
 * Fixed: (Gmail) Hide sidebar not working in split-pane mode (thanks jiefoxi)
 * Fixed: (Gmail) Hide offline not working for some
 * Fixed: (Gmail) Hide privacy link and hide Google+ link hiding links under the more menu
 * Fixed: (Gmail) Hide sidebar not working in split pane views

#### 0.4.8 (Nov 12, 2011)
 * Fixed: Just kidding it wasn't broken, just forgot to update the VERSION var :-)

#### 0.4.7 (Nov 12, 2011)
 * Fixed: Broken version handler in 0.4.6 causing core modules not to update.

#### 0.4.6 (Nov 12, 2011)
 * Fixed: Some options incorrectly enabled by default in the core modules

#### 0.4.5t (Nov 12, 2011)
 * Fixed: Core module data not updated

#### 0.4.4t (Nov 12, 2011)
 * Added: (Gmail) Show checkbox tools list
 * Added: (Gmail) Hide zero-inbox Google Reader ad
 * Added: (Gmail) Hide Mail/Contacts/Tasks menu
 * Changed: (Gmail) Hiding user photo also hides user email since clicking it does nothing without the photo
 * Fixed: (Gmail) Highlight starred items not working if 2 or more stars enabled in settings
 * Fixed: (Gmail) Hide Chat title bar hiding all gadget title bars
 * Fixed: (Gmail) Hide unstarred stars not working if 2 or more stars enabled in settings
 * Fixed: (Gmail) Hide user email hiding many links in the user menu
 * Fixed: (Gmail) Hide privacy link and hide Google+ link hiding links under the settings menu
 * Fixed: (Gmail) Hide statuses in chat leaving extra padding
 * Fixed: @includes in imports from [UserStyles.org] not being sanitized for single or double quotes
 * Fixed: Force updating imports from [UserScripts.org] and [UserStyles.org] did not replace exisiting installs
 * Removed: Starter module. It was corrupt and redundant.

#### 0.4.3 (Nov 07, 2011)
 * Fixed: See changes button not opening changelog
 * Fixed: Version number not updating for bugfixes
 * Fixed: Notification not appearing for

#### 0.4.2t (Nov 07, 2011)
 * Fixed: Core module installation failed

#### 0.4.1t (Nov 07, 2011)
 * Changed: Install starter module to install Core modules

#### 0.4.0t (Nov 07, 2011)
 * Added: Adding fields to options
 * Added: Adding color pickers to options
 * Added: Support for core module updating
 * Added: Gmail core module
 * Fixed: Screenshot upload button not resetings after switching features

#### 0.3.1 (Sep 25, 2011)
 * Fixed: Import from bookmark failing when debugging is off

#### 0.3.0 (Sep 25, 2011)
 * Added: Import from [userstyles.org]
 * Added: Import from [userscripts.org]
 * Fixed: Sync failing to remove duplicate bookmarks
 * Fixed: Update notifications showing without real update (maybe)

#### 0.2.0 (Sep 17, 2011)
 * Changed: Update notifications no longer shown for bugfixes (x.x.X)
 * Fixed: Sync bookmark not being updated after saves

#### 0.1.4 (Sep 17, 2011)
 * Added: Two way sync using a bookmark (experimental)
 * Added: Share via URL after export. MinEverything users that click on your link will have their Import fields populated with your export data
 * Added: Update notifications
 * Added: "New Mod" in popup now creates a new module that targets the domain on that page and is named the title of that page
 * Added: Export will now ask to export Everything or just Specific Modules
 * Added: Importing single modules will only overwrite modules with the same name & author. Otherwise they will be appended
 * Changed: Copy Code button now becomes disabled when copy is successful to avoid excited users making their processors angry
 * Fixed: Toggling modules from dropdown only working if module index and active module index match

#### 0.1.3 (Sep 09, 2011)
 * Added:   Tooltips to document confusing things
 * Changed: New modules are enabled by default
 * Changed: New options are enabled by default
 * Changed: New modules have a single new option by default so metadata saves correctly
 * Fixed: Creating a new module when no modules exist no redirecting to infinite loading page
 * Fixed: Expanding collapsed items in the editor tree causing overlap
 * Fixed: Syntax highlighted fields not initializing consistently

#### 0.1.2 (Sep 08, 2011)
 * Fixed: Link to market page from Dashboard works
 * Fixed: Link change from 0.1.1

#### 0.1.1 (Sep 08, 2011)
 * Changed: a URL in the manifest (to make sure it won't trigger a permissions auto-disable)

#### 0.1.0 (Sep 08, 2011)
 * Alpha released!


## Legal

  I am not a Google Employee nor am I officially affiliated with Google in any way.
  This extension is not endorsed by Google. Google, Gmail, Google Calendar,
  Google Reader, Google+, and their respective logos are trademarks of Google Inc.
  Use of these trademarks is subject to Google Permissions.

  All modules are owned by their authors and licensed under GNU GPL v3.
