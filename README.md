<p align="center" style="margin-top: -25px;">
  <img src="https://raw.githubusercontent.com/crazywolf132/AsherAPI/master/img/bg.png">
</p>
<h2 align="center">
    <a href="https://circleci.com/gh/crazywolf132/AsherAPI"><img src="https://circleci.com/gh/manekinekko/google-actions-server.svg?style=svg"/></a>
    <a href="https://codeclimate.com/github/crazywolf132/AsherAPI/maintainability"><img src="https://api.codeclimate.com/v1/badges/e66235017865b51adbf2/maintainability" /></a>
    <a class="badge-align" href="https://www.codacy.com/app/crazywolf132/AsherAPI?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=crazywolf132/AsherAPI&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/e0375f94ce4c4ac4b32a8b74df8b0bf7"/></a>
    <a href=""./LICENSE">
    <img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg"/>
    </a>
</h2>
<br />
<br />
<br />
<br />

## What the heck is this?
This is the Node.js API for the Asher personal assistant. Asher is a personal assistant with the aim of matching all the commands that products such as the Google Home can offer, and much more.

Asher is modular allowing for the community to add their part to his ever increasing module base.

## How do I connect?
There are 2 ways to connect to Asher.
1. Via REST API requests. Simply post a `post` request to `http://165.227.116.53/api/talk`, with the argument `command` and your message.
2. Via sockets. Port `4416` is open at `http://165.227.116.53/`, send a `message` through the socket with the raw text.

Asher allows for any language that can either use sockets or send get requests to interact with him. We just need the raw text input, and we will do the rest.

## Lets build a mod!
Mods are constructed of 3 parts.
- The Actual mod file `mod.js`
- The words file `words.txt`, which contains examples of triggers
- The type file `type.txt`. This is used to tell the system what kind of mod this is.

To start off, we need to create a folder in the `mods` directory for our new Mod.
We are going to make a mod called `funny`.
We then need to create all 3 of those files inside that folder.

We are going to start work on the `words.txt` file. We now need to decide different examples of triggering the mod. Seeing as our mod is going to be a joke mod. Here is what our words file is going to look like.
<img src="https://raw.githubusercontent.com/crazywolf132/AsherAPI/master/img/words.png">

For more special characters to use inside of your words file. Feel free to head over to the wiki where we explain the different characters used in the words files.

We now need to set the `type.txt` file. As we can see from our words file, our does not fit one of these categories...
<img src="https://raw.githubusercontent.com/crazywolf132/AsherAPI/master/img/type.png">

So, we need to set it as `other`. Thats it, our system will be able to do the rest.

We just now need to work on the actual `mod.js` file!
Every mod is composed of:
<img src="https://raw.githubusercontent.com/crazywolf132/AsherAPI/master/img/basicMod.png">

We are going to take that template, and we are going to add our elements to it:
<img src="https://raw.githubusercontent.com/crazywolf132/AsherAPI/master/img/ourMod.png">

Thats it. Asher now knows our `Funny` module, Once he restarts... we will be able to say one of our trigger words from `words.txt` and he will run this mod.

## Special thanks to...
- [Brayden Moon](https://github.com/crazywolf132)
- [Jamie](https://github.com/jsProj)
- [Kaidan](https://github.com/imnotbad/)
- [ThatsNoMoon](http://github.com/ThatsNoMoon)
- [Jean-Philippe Sirois](https://github.com/veksen)
