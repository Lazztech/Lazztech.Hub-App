# UX Analysis of LazzTech Hub 09/29/2025
## Sign up/Login/Profile
* No way to sign up from welcome page
* "Get started" → "Continue as Guest" (recognizable phrasing)
* Buttons should drive preferred behaviour. Right now the biggest button drives continuing without an account.
* A guest account shouldn't be able to make a hub or event
* Should be able to edit/add profile picture in edit profile page
* After saving edits to profile, redirect somewhere with a confirmation. Current pop-up system is easy to miss.
* Generated Username lingers with no way to edit
* Password reset pin is too long

## Events
* For new event form, Max > Min attendees should have an error added
* Creating an event from a hub sets the hub as location, location input is still visible even though is isn’t usable.
* Bottom bar should still be universal nav bar. Universal nav bar being missing on forms is okay because forms aren’t a part of the main site architecture, but hubs and events are.
* Unify layout to mirror hubs page.
* Bottom bar actions should be integrated either into an actions section or into logical sections related to the action (i.e. Uber/map with location, group chat with people section.)

## Hubs
* For new hub, Automatically chooses current location if no location is input, but there’s no indication of this on creation
* Lightbulb for active or inactive is confusing, setting hub active or not should be a toggle. Toggle is currently buried in manage hub page.
* Bottom bar should still be universal nav bar.
* Unify layout to mirror events.
* Bottom bar actions should be integrated either into an actions section or into logical sections related to the action (i.e. Uber/map with location, group chat with people section.)

## People 
* “Your common community members of shared Hubs will show up here. Create your first Hub and invite people to get started!” wordy and not entirely clear → possibly ”People from Hubs you’re part of will appear here. Create or join a Hub to start building community!”

## Map
* Ability to place a pin? 

## General
* Back buttons take you back to forms after forms are completed. Forms are not actually part of architecture, shouldn’t be part of back flow, confusing, leads to form resubmission.
* Search bar of home page doesn’t work to search everything, only hubs? Purpose unclear.
* “Upcoming” → “Upcoming Events”


## To Do 
### Feature and Copy Updates 
* Update copy:
    *  On people page: “Your common community members of shared Hubs will show up here. Create your first Hub and invite people to get started!” wordy and not entirely clear → possibly ”People from Hubs you’re part of will appear here. Create or join a Hub to start building community!”
    * On welcome page: "Get Started" → "Continue as Guest"
    * On home page: “Upcoming” → “Upcoming Events”
* Forms:
    * New Event from Hub page → Location defaults to that hub, hide disabled location input
    * New Event form needs error for max is less than min attendees
    * Add redirect after saving profile edits
    * Add profile picture to edit profile page
    * Ability to edit generated username OR generated username is replaced by name when profile is completed
    * Add explicit indication that current location will be set for a new hub if seperate location isn't specified
* Other:
    * Make home page search bar work to search both Hubs and Events
    * Possibly add the ability to select a location by placing a pin

### Clean Up Hub & Event Pages
* Make bottom bar universal navigation bar
* Integrate actions from current bottom bar into layout
* Ensure that layout for Hub and Event pages mirror each other
* Add prominient toggle to Hubs to replace lightbulb

### Clean Up Back Button Flow
* Back button should go back to latest page, not back to form.

### Simplify Auth Flow 
* Add Sign Up to welcome page
* Update login/sign up/continue as guest buttons to promote preferred behaviour 
* Restrict guest accounts ability to create events and hubs
* Shorten reset password pin


